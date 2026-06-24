import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import CustomSheetPattern from '@/models/CustomSheetPattern'
import CustomSheetProblem from '@/models/CustomSheetProblem'
import CustomSheet from '@/models/CustomSheet'
import ExcelJS from 'exceljs'
import { toSlug } from '@/lib/utils'

// This endpoint intentionally avoids MongoDB transactions.
// We rely on deterministic deletes + idempotent upserts
// so it works on MongoDB free tiers and standalone instances.

import { logger } from '@/lib/logger'

// Helper to normalize column names
const _normalizeHeader = (header: string) => header.trim().toLowerCase()

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id
  logger.info(`[CustomSheet][Import] Started by user: ${userId}`)

  await dbConnect()

  let mode: 'replace' | 'append' = 'replace'
  let sheetId = ''
  let sheetName = ''
  let isNewSheet = false

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    isNewSheet = formData.get('isNewSheet') === 'true'
    mode = (formData.get('mode') as 'replace' | 'append') || 'replace'

    if (formData.has('sheetId')) {
      sheetId = formData.get('sheetId') as string
    }

    // CASE 1: Create New Sheet
    if (isNewSheet) {
      // Derive name from filename (remove extension)
      const filename = file.name
      sheetName = filename.substring(0, filename.lastIndexOf('.')) || filename

      // Check if sheet exists first to handle duplicates gracefully
      const existingSheet = await CustomSheet.findOne({
        userId,
        name: sheetName,
      })

      if (existingSheet) {
        logger.info(
          `[CustomSheet][Import] Sheet name collision '${sheetName}'. Switching to REPLACE mode on existing sheet: ${existingSheet._id}`
        )
        sheetId = existingSheet._id.toString()

        // CRITIAL: Switch mode to treat this as an overwrite on the existing sheet
        // This ensures we hit the 'shouldDelete' logic later to clear old data
        isNewSheet = false
        mode = 'replace'
      } else {
        // Create new sheet if it doesn't exist
        const newSheet = await CustomSheet.create({
          userId,
          name: sheetName,
          isDefault: false,
        })
        sheetId = newSheet._id.toString()
        logger.info(
          `[CustomSheet][Import] Created new sheet: ${sheetId} (${sheetName})`
        )
      }
    } else {
      // CASE 2: Existing Sheet
      if (!sheetId) {
        return NextResponse.json(
          { error: 'No sheetId provided' },
          { status: 400 }
        )
      }

      // Validate sheet ownership
      const sheet = await CustomSheet.findOne({ _id: sheetId, userId })
      if (!sheet) {
        return NextResponse.json(
          { error: 'Sheet not found or unauthorized' },
          { status: 404 }
        )
      }
    }

    // Validate File Type
    const isExcel = file.name.endsWith('.xlsx')
    const isCsv = file.name.endsWith('.csv')
    if (!isExcel && !isCsv) {
      return NextResponse.json(
        { error: 'Invalid file type. Only .xlsx and .csv are supported.' },
        { status: 400 }
      )
    }

    // Validate File Size (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large (Max 5MB)' },
        { status: 400 }
      )
    }

    const buffer = await file.arrayBuffer()
    const workbook = new ExcelJS.Workbook()

    try {
      if (isCsv) {
        await workbook.csv.read(new Response(file).body as any)
      } else {
        await workbook.xlsx.load(buffer)
      }
    } catch (e) {
      logger.error(`[CustomSheet][Import][Error] Parsing failed:`, { error: e })
      return NextResponse.json(
        { error: 'File parsing error. Ensure the file is valid.' },
        { status: 400 }
      )
    }
    const worksheet = workbook.worksheets[0]
    if (!worksheet || worksheet.rowCount <= 1) {
      return NextResponse.json(
        { error: 'Empty sheet or missing data rows' },
        { status: 400 }
      )
    }

    // 1. Header Extraction & Validation
    const headerRow = worksheet.getRow(1)
    const headers: { name: string; index: number }[] = []
    headerRow.eachCell((cell, colNumber) => {
      let val = cell.value
      if (typeof val === 'object' && val !== null && 'text' in val)
        val = (val as any).text
      const text = val?.toString().trim() || ''
      if (text) headers.push({ name: text, index: colNumber })
    })

    const columnMapping: any = {}
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')
    headers.forEach((h) => {
      const n = normalize(h.name)
      // Case-insensitive matching for Pattern column
      if (
        !columnMapping.patternIdx &&
        (n.includes('pattern') || n.includes('topic') || n.includes('category'))
      )
        columnMapping.patternIdx = h.index
      // Case-insensitive matching for Problem/Title column
      if (
        !columnMapping.problemIdx &&
        (n.includes('problem') || n.includes('title') || n.includes('question'))
      )
        columnMapping.problemIdx = h.index
      // Case-insensitive matching for Link/URL column
      if (
        !columnMapping.linkIdx &&
        (n.includes('link') || n.includes('url') || n.includes('href'))
      )
        columnMapping.linkIdx = h.index
      // Case-insensitive matching for Difficulty column
      if (
        !columnMapping.difficultyIdx &&
        (n.includes('diff') || n.includes('level'))
      )
        columnMapping.difficultyIdx = h.index
    })

    if (
      !columnMapping.patternIdx ||
      !columnMapping.problemIdx ||
      !columnMapping.linkIdx
    ) {
      return NextResponse.json(
        {
          error:
            'Invalid columns: Mandatory headers (Pattern, Problem, Link) not found.',
        },
        { status: 400 }
      )
    }

    // 2. Parse Data Rows
    const problemsToInsert: any[] = []
    const uniquePatternNames = new Set<string>()
    let skippedRows = 0

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return
      const getVal = (idx: number) => {
        if (!idx) return ''
        const cell = row.getCell(idx)
        if (typeof cell.value === 'object' && cell.value !== null) {
          if ('hyperlink' in cell.value)
            return (cell.value as any).hyperlink?.toString() || ''
          if ('text' in cell.value)
            return (cell.value as any).text?.toString() || ''
        }
        return cell.value?.toString().trim() || ''
      }

      const patternName = getVal(columnMapping.patternIdx)
      const title = getVal(columnMapping.problemIdx)
      const link = getVal(columnMapping.linkIdx)

      // Log missing fields for first few failures
      // Log missing fields for first few failures
      if (!patternName || !title || !link) {
        if (skippedRows < 5)
          logger.warn(`[Import][Skip] Row ${rowNumber} missing data:`, {
            patternName,
            title,
            link,
          })
        skippedRows++
        return
      }

      // Skip intermediate header/separator rows
      const lowerPattern = patternName.toLowerCase().trim()
      const lowerTitle = title.toLowerCase().trim()
      const lowerLink = link.toLowerCase().trim()

      if (
        lowerPattern === 'pattern' ||
        lowerTitle === 'question title' ||
        lowerTitle === 'problem title' ||
        lowerTitle === 'title' ||
        lowerLink === 'leetcode url' ||
        lowerLink === 'link'
      ) {
        return
      }

      // Robustness: URL and Data Validation
      let isValidUrl = false
      try {
        new URL(link)
        isValidUrl = true
      } catch (_e) {
        if (link.startsWith('http://') || link.startsWith('https://')) {
          isValidUrl = false
        }
      }

      // If it's not a valid URL, it's likely junk or intermediate row
      // If it's not a valid URL, it's likely junk or intermediate row
      if (
        !isValidUrl &&
        !link.includes('leetcode.com') &&
        !link.includes('geeksforgeeks')
      ) {
        if (skippedRows < 5)
          logger.warn(`[Import][Skip] Row ${rowNumber} invalid URL:`, { link })
        skippedRows++
        return
      }

      uniquePatternNames.add(patternName)

      let difficulty = 'Medium'
      if (columnMapping.difficultyIdx) {
        const rawDiff = getVal(columnMapping.difficultyIdx).toLowerCase()
        if (rawDiff.includes('easy')) difficulty = 'Easy'
        else if (rawDiff.includes('hard')) difficulty = 'Hard'
      }

      problemsToInsert.push({ patternName, title, link, difficulty })
    })

    logger.info(
      `[CustomSheet][Import] Parsed ${problemsToInsert.length} valid problems. Skipped ${skippedRows} rows.`
    )

    if (problemsToInsert.length === 0) {
      return NextResponse.json(
        {
          error:
            'No valid problem records found. Check column headers and URLs.',
        },
        { status: 400 }
      )
    }

    // 3. RESET LOGIC (Conditional Delete)
    const shouldDelete = mode === 'replace' && !isNewSheet

    if (shouldDelete) {
      logger.info(
        `[CustomSheet][Import] Clearing existing data for user ${userId} in sheet ${sheetId}`
      )
      await CustomSheetProblem.deleteMany({
        userId: new mongoose.Types.ObjectId(userId),
        sheetId: new mongoose.Types.ObjectId(sheetId),
      })
      await CustomSheetPattern.deleteMany({
        userId: new mongoose.Types.ObjectId(userId),
        sheetId: new mongoose.Types.ObjectId(sheetId),
      })
    }

    // 4. BULK UPSERTS (Patterns)
    const patternsOps = Array.from(uniquePatternNames).map((name) => ({
      updateOne: {
        filter: { sheetId: new mongoose.Types.ObjectId(sheetId), name },
        update: {
          $set: {
            userId: new mongoose.Types.ObjectId(userId),
            sheetId: new mongoose.Types.ObjectId(sheetId),
            name,
            slug: toSlug(name),
          },
        },
        upsert: true,
      },
    }))

    if (patternsOps.length > 0) {
      await CustomSheetPattern.bulkWrite(patternsOps)
    }

    // Fetch created patterns to map IDs
    const createdPatterns = await CustomSheetPattern.find({
      sheetId: new mongoose.Types.ObjectId(sheetId),
    })
    const patternIdMap = new Map()
    createdPatterns.forEach((p) => patternIdMap.set(p.name, p._id))

    logger.debug(
      `[Import] Found ${createdPatterns.length} patterns in DB for sheet ${sheetId}. Expected ${uniquePatternNames.size}.`
    )

    // 5. INSERT PROBLEMS
    const problemsData = problemsToInsert
      .map((p) => {
        const patternId = patternIdMap.get(p.patternName)
        if (!patternId) {
          logger.warn(`[Import] Pattern ID missing for '${p.patternName}'`)
          return null
        }

        return {
          userId: new mongoose.Types.ObjectId(userId),
          sheetId: new mongoose.Types.ObjectId(sheetId),
          patternId,
          title: p.title,
          difficulty: p.difficulty,
          link: p.link,
          status: 'TODO',
        }
      })
      .filter(Boolean)

    let insertedCount = 0
    if (problemsData.length > 0) {
      const res = await CustomSheetProblem.insertMany(problemsData)
      insertedCount = res.length
    }

    logger.info(
      `[CustomSheet][Import] Success for user ${userId}. Patterns: ${patternsOps.length}, Problems Inserted: ${insertedCount}`
    )

    return NextResponse.json({
      success: true,
      sheetId,
      mode,
      meta: {
        patternsCreated: patternsOps.length,
        problemsCreated: insertedCount,
      },
    })
  } catch (error: any) {
    console.error(
      `[CustomSheet][Import][Error] Failed for user ${userId}:`,
      error
    )
    // Check for duplicate key errors just in case
    if (error.code === 11000) {
      // FIX: If we failed to create a new sheet due to duplicate name, recover the ID
      if (isNewSheet && !sheetId && sheetName) {
        try {
          const existingSheet = await CustomSheet.findOne({
            userId,
            name: sheetName,
          })
          if (existingSheet) {
            logger.warn(
              `[CustomSheet][Import] Recovered existing sheet ID for duplicate import: ${existingSheet._id}`
            )
            return NextResponse.json({
              success: true,
              sheetId: existingSheet._id.toString(),
              mode,
              meta: {
                patternsCreated: 0,
                problemsCreated: 0,
              },
            })
          }
        } catch (recoveryErr) {
          console.error('Failed to recover existing sheet ID', recoveryErr)
        }
      }

      logger.warn('Duplicate key error during import (ignored)', { error })
      return NextResponse.json({
        success: true,
        sheetId, // This might be empty if recovery fails, but we tried
        mode,
        meta: {
          patternsCreated: 0,
          problemsCreated: 0,
        },
      })
    }
    return NextResponse.json(
      {
        error: error.message || 'Unknown import error',
        // SECURITY: Never expose headers/stack traces
      },
      { status: 500 }
    )
  }
}
