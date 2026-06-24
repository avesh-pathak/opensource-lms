import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import CustomSheetPattern from '@/models/CustomSheetPattern'
import CustomSheet from '@/models/CustomSheet'
import { handleApiError } from '@/lib/api-utils'
import CustomSheetProblem from '@/models/CustomSheetProblem'
import mongoose from 'mongoose'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const userId = session.user.id
    const { searchParams } = new URL(req.url)
    let sheetId = searchParams.get('sheetId')

    // 1. If no sheetId provided, find the default sheet or create one
    if (!sheetId) {
      let defaultSheet = await CustomSheet.findOne({ userId, isDefault: true })
      if (!defaultSheet) {
        defaultSheet = await CustomSheet.findOne({ userId })
      }
      if (!defaultSheet) {
        // Auto-create default sheet for legacy users
        defaultSheet = await CustomSheet.create({
          userId,
          name: 'Default Sheet',
          isDefault: true,
        })
        // Migration: Update patterns/problems without sheetId
        await Promise.all([
          CustomSheetPattern.updateMany(
            { userId, sheetId: { $exists: false } },
            { $set: { sheetId: defaultSheet._id } }
          ),
          CustomSheetProblem.updateMany(
            { userId, sheetId: { $exists: false } },
            { $set: { sheetId: defaultSheet._id } }
          ),
        ])
      }
      sheetId = defaultSheet._id.toString()
    }

    // 2. Parallel Execution: Get all patterns and problem stats concurrently
    const [patterns, problemStats] = await Promise.all([
      CustomSheetPattern.find({ userId, sheetId })
        .select('_id name slug')
        .sort({ createdAt: 1 })
        .lean(),
      CustomSheetProblem.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            sheetId: new mongoose.Types.ObjectId(sheetId as string),
          },
        },
        {
          $group: {
            _id: '$patternId',
            total: { $sum: 1 },
            solved: {
              $sum: {
                $cond: [{ $eq: ['$status', 'DONE'] }, 1, 0],
              },
            },
          },
        },
      ]),
    ])

    // 3. Map stats to patterns
    const statsMap = new Map()
    problemStats.forEach((stat: any) => {
      statsMap.set(stat._id.toString(), {
        total: stat.total,
        solved: stat.solved,
      })
    })

    const result = patterns.map((p: any) => {
      const stats = statsMap.get(p._id.toString()) || { total: 0, solved: 0 }
      return {
        id: p._id,
        name: p.name,
        slug: p.slug,
        total: stats.total,
        solved: stats.solved,
        domain: 'Custom', // For UI consistency if reused
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    return handleApiError(error)
  }
}
