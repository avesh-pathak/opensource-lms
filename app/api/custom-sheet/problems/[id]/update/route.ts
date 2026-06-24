import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import CustomSheetProblem from '@/models/CustomSheetProblem'
import {
  validateObjectId,
  validateRequestBody,
  handleApiError,
} from '@/lib/api-utils'
import { z } from 'zod'

// Zod schema for problem updates
const UpdateProblemSchema = z.object({
  notes: z.string().optional(),
  solution: z.string().optional(),
  approach: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

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

    // Zod validation
    const validation = await validateRequestBody(req, UpdateProblemSchema)
    if ('error' in validation) return validation.error
    const body = validation.data

    await dbConnect()

    // 1. Find the problem (ownership ensured by findOne with userId)
    const problem = await CustomSheetProblem.findOne({ _id: id, userId })

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 })
    }

    // 2. Update fields if provided
    if (body.notes !== undefined) problem.notes = body.notes
    if (body.solution !== undefined) problem.solution = body.solution
    if (body.approach !== undefined) problem.approach = body.approach
    if (body.tags !== undefined) problem.tags = body.tags

    problem.updatedAt = new Date()

    await problem.save()

    return NextResponse.json({
      success: true,
      data: problem,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
