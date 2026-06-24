import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import CustomSheetPattern from '@/models/CustomSheetPattern'
import { handleApiError } from '@/lib/api-utils'

export async function GET(_req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    await dbConnect()

    // Fast check: limit 1 is enough to know it exists
    const count = await CustomSheetPattern.countDocuments({ userId }).limit(1)

    return NextResponse.json({
      success: true,
      data: {
        exists: count > 0,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
