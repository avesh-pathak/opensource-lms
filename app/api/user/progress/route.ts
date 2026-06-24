import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import User from '@/models/User'
import Problem from '@/models/Problem'
import dbConnect from '@/lib/dbConnect'
import { handleApiError, validateRequestBody } from '@/lib/api-utils'
import { z } from 'zod'

const ProgressSchema = z.object({
  problemId: z.string().min(1),
})

export async function GET(_req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const user = await User.findOne({ email: session.user.email }).populate(
      'solvedProblems'
    )

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      solvedProblems: user.solvedProblems || [],
      experiencePoints: user.experiencePoints || 0,
      currentStreak: user.currentStreak || 0,
      lastActivityDate: user.lastActivityDate,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const validation = await validateRequestBody(req, ProgressSchema)
    if ('error' in validation) return validation.error
    const { problemId } = validation.data

    await dbConnect()

    // 1. Verify problem exists
    const problem = await Problem.findById(problemId)
    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 })
    }

    // 2. Find user
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 3. Update user progress
    const isAlreadySolved = user.solvedProblems?.some(
      (id: any) => id.toString() === problemId
    )

    let xpGained = 0
    if (!isAlreadySolved) {
      // Assign XP based on difficulty
      const difficultyXP = {
        Easy: 10,
        Medium: 20,
        Hard: 40,
      }
      xpGained =
        difficultyXP[problem.difficulty as keyof typeof difficultyXP] || 10

      user.solvedProblems.push(problemId)
      user.experiencePoints = (user.experiencePoints || 0) + xpGained
    }

    // Update streak logic
    const now = new Date()
    const lastActivity = user.lastActivityDate
      ? new Date(user.lastActivityDate)
      : null
    let diffDays = 0

    if (lastActivity) {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const lastDate = new Date(
        lastActivity.getFullYear(),
        lastActivity.getMonth(),
        lastActivity.getDate()
      )

      const diffTime = Math.abs(today.getTime() - lastDate.getTime())
      diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        // Precise consecutive day
        user.currentStreak = (user.currentStreak || 0) + 1
      } else if (diffDays > 1) {
        // Missed a day (or more), reset
        user.currentStreak = 1
      }
      // If diffDays === 0, same day, do nothing
    } else {
      // First activity ever
      user.currentStreak = 1
    }

    // Update activity date
    user.lastActivityDate = now

    // Save user
    await user.save()

    // Log Activity
    const { logActivity } = await import('@/lib/activity')

    if (!isAlreadySolved) {
      await logActivity(session.user.id, 'PROBLEM_SOLVED', {
        problemId,
        title: problem.title,
        difficulty: problem.difficulty,
        xpGained,
      })
    }

    if (user.currentStreak > 1 && diffDays === 1) {
      await logActivity(session.user.id, 'STREAK_UPDATED', {
        streak: user.currentStreak,
      })
    }

    return NextResponse.json({
      success: true,
      solved: !isAlreadySolved,
      xpGained,
      totalXP: user.experiencePoints,
      solvedCount: user.solvedProblems.length,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
