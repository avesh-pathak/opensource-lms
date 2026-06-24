import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { ExportEngine } from '@/lib/export-engine'
import { ExportAdapters } from '@/lib/export-adapters'
import dbConnect from '@/lib/dbConnect'
import { handleApiError } from '@/lib/api-utils'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Safety: Demo Admin can EXPORT (Read-only) but cannot mutate.
    // However, if we want to log the export action, we would do it here.

    await dbConnect()
    const body = await request.json()
    const { type, format, filters = {} } = body

    if (!type || !format) {
      return NextResponse.json(
        { error: 'Type and format are required' },
        { status: 400 }
      )
    }

    // 1. Get adapted data
    let exportConfig
    switch (type) {
      case 'students':
        exportConfig = await ExportAdapters.students(filters)
        break
      case 'results':
        exportConfig = await ExportAdapters.results(filters)
        break
      case 'audit-logs':
        exportConfig = await ExportAdapters.auditLogs(filters)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid export type' },
          { status: 400 }
        )
    }

    // 2. Generate file based on format
    let buffer: Buffer | Uint8Array | string
    let contentType: string
    let extension: string

    switch (format) {
      case 'csv':
        buffer = await ExportEngine.toCSV(exportConfig)
        contentType = 'text/csv'
        extension = 'csv'
        break
      case 'xlsx':
        buffer = await ExportEngine.toExcel(exportConfig)
        contentType =
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        extension = 'xlsx'
        break
      case 'pdf':
        buffer = await ExportEngine.toPDF(exportConfig)
        contentType = 'application/pdf'
        extension = 'pdf'
        break
      default:
        return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
    }

    // 3. Return as a streamable response
    const headers = new Headers()
    headers.set('Content-Type', contentType)

    // Sanitize filename
    const safeFilename = exportConfig.filename.replace(/[^a-zA-Z0-9._-]/g, '_')
    const encodedFilename = encodeURIComponent(exportConfig.filename)

    headers.set(
      'Content-Disposition',
      `attachment; filename="${safeFilename}.${extension}"; filename*=UTF-8''${encodedFilename}.${extension}`
    )

    return new NextResponse(buffer as any, {
      status: 200,
      headers,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
