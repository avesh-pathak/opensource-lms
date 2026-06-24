import { NextResponse } from 'next/server'
import ActivityLog from '@/models/ActivityLog'
import dbConnect from '@/lib/dbConnect'
import { handleApiError, validateObjectId, ApiResponse } from '@/lib/api-utils'

import { auth } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const { id } = await params

    const idError = validateObjectId(id, 'User ID')
    if (idError) return idError

    const logs = await ActivityLog.find({ userId: id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    return ApiResponse(logs)
  } catch (error) {
    return handleApiError(error)
  }
}
