import { NextResponse } from 'next/server'
import Problem from '@/models/Problem'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import { handleApiError, validateObjectId } from '@/lib/api-utils'

// GET all problems for this pattern
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const idError = validateObjectId(id, 'Pattern ID')
    if (idError) return idError

    await dbConnect()

    // Fetch problems linked to this pattern
    const problems = await Problem.find({ patternId: id }).sort({ order: 1 })

    return NextResponse.json(problems)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST: Add (Link) or Remove (Unlink) problems
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const idError = validateObjectId(id, 'Pattern ID')
    if (idError) return idError

    const body = await request.json()
    const { problemIds, action } = body // action: 'add' | 'remove'

    if (!problemIds || !Array.isArray(problemIds)) {
      return NextResponse.json({ error: 'Invalid problemIds' }, { status: 400 })
    }

    // Validate problem IDs (optional but good practice)
    for (const pid of problemIds) {
      const pidError = validateObjectId(pid, 'Problem ID')
      if (pidError) return pidError
    }

    await dbConnect()

    if (action === 'add') {
      // Link problems to this pattern
      await Problem.updateMany(
        { _id: { $in: problemIds } },
        { $set: { patternId: id } }
      )
    } else if (action === 'remove') {
      // Unlink problems (remove patternId)
      await Problem.updateMany(
        { _id: { $in: problemIds } },
        { $unset: { patternId: '' } }
      )
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ success: true, count: problemIds.length })
  } catch (error) {
    return handleApiError(error)
  }
}
