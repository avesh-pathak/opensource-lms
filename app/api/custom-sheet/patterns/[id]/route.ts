import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import CustomSheetPattern from '@/models/CustomSheetPattern'
import CustomSheetProblem from '@/models/CustomSheetProblem'
import {
  validateObjectId,
  handleApiError,
  validateOwnership,
} from '@/lib/api-utils'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // ObjectId validation
    const idError = validateObjectId(id, 'Pattern ID')
    if (idError) return idError

    const _userId = session.user.id
    await dbConnect()

    // 1. Fetch the pattern first to check existence and ownership
    const pattern = await CustomSheetPattern.findById(id)

    // 2. Validate existence and ownership using standardized utility
    const ownershipError = validateOwnership(pattern, session, 'Pattern')
    if (ownershipError) return ownershipError

    // 3. Delete all problems associated with this pattern
    const problemsResult = await CustomSheetProblem.deleteMany({
      patternId: id,
    })

    // 4. Delete the pattern itself
    const _patternResult = await CustomSheetPattern.deleteOne({ _id: id })

    return NextResponse.json({
      success: true,
      message: 'Pattern and associated problems deleted',
      deletedProblems: problemsResult.deletedCount,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
