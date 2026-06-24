import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import CustomSheetProblem from '@/models/CustomSheetProblem'
import { validateObjectId, handleApiError } from '@/lib/api-utils'

// SAFETY GUARD: Custom Sheet is private, not counted in leaderboard. Do NOT update User XP or Global Solved counts here.
export async function POST(
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
    const idError = validateObjectId(id, 'Problem ID')
    if (idError) return idError

    const userId = session.user.id

    await dbConnect()

    // 1. Find the problem (ownership ensured by findOne with userId)
    const problem = await CustomSheetProblem.findOne({ _id: id, userId })

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 })
    }

    // 2. Toggle Status
    const newStatus = problem.status === 'DONE' ? 'TODO' : 'DONE'
    problem.status = newStatus
    problem.updatedAt = new Date()

    // 3. Handle completedAt (For Analytics/Streaks)
    if (newStatus === 'DONE') {
      // Only set if not already set or update it to now?
      // Usually for streaks we want the time it was marked done.
      problem.completedAt = new Date()
    } else {
      // Unset if moving back to TODO
      problem.completedAt = undefined
    }

    await problem.save()

    return NextResponse.json({
      success: true,
      status: newStatus,
      completedAt: problem.completedAt,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
