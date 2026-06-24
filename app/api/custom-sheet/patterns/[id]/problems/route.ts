import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import CustomSheetProblem from '@/models/CustomSheetProblem'
import { handleApiError, validateObjectId } from '@/lib/api-utils'
import CustomSheetPattern from '@/models/CustomSheetPattern'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params // Pattern ID

    // ObjectId validation
    const idError = validateObjectId(id, 'Pattern ID')
    if (idError) return idError

    await dbConnect()
    const userId = session.user.id

    // Validate Pattern belongs to user
    const pattern = await CustomSheetPattern.findOne({ _id: id, userId })
    if (!pattern) {
      return NextResponse.json({ error: 'Pattern not found' }, { status: 404 })
    }

    // Fetch problems
    const problems = await CustomSheetProblem.find({
      userId,
      patternId: id,
    }).sort({ difficulty: 1, title: 1 }) // Simple sort

    return NextResponse.json({
      patternName: pattern.name,
      problems,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
