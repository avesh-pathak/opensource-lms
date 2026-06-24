import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { StoredProblemData, MentorshipSession } from '@/lib/types'
import { syncSchema } from '@/lib/validators'

const COLLECTION_NAME = 'user_profiles'

// GET: Fetch user progress
export async function GET() {
  const session = await auth()
  const user = session?.user

  if (!user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const client = await clientPromise
    const db = client.db('lms_db') // Use your DB name

    const profile = await db
      .collection(COLLECTION_NAME)
      .findOne({ userId: user.id })

    if (!profile) {
      return NextResponse.json({ progress: {} })
    }

    return NextResponse.json({
      progress: profile.progress || {},
      mentorshipSessions: profile.mentorshipSessions || [],
      userGoal: profile.userGoal || null,
    })
  } catch (error) {
    console.error('Sync Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// POST: Merge or Overwrite progress
export async function POST(request: Request) {
  const session = await auth()
  const user = session?.user

  if (!user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const bodyRaw = await request.json()
    const validationResult = syncSchema.safeParse(bodyRaw)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation Error', details: validationResult.error.format() },
        { status: 400 }
      )
    }

    const { progress, mentorshipSessions, userGoal } = validationResult.data
    const client = await clientPromise
    const db = client.db('lms_db')
    const collection = db.collection(COLLECTION_NAME)

    const existingProfile = await collection.findOne({ userId: user.id })

    // 1. Merge Progress
    const existingProgress = (existingProfile?.progress || {}) as Record<
      string,
      StoredProblemData
    >
    const incomingProgress = (progress || {}) as Record<
      string,
      StoredProblemData
    >
    const mergedProgress = { ...existingProgress }

    for (const [key, value] of Object.entries(incomingProgress)) {
      const existing = existingProgress[key]
      if (
        !existing ||
        !existing.updatedAt ||
        (value.updatedAt &&
          new Date(value.updatedAt) > new Date(existing.updatedAt))
      ) {
        mergedProgress[key] = value
      }
    }

    // 2. Sync User Goal
    // If incoming has goal, use it. Otherwise keep existing.
    // If user clears goal, client should send null/empty string?
    // For now assuming if provided, it's the latest.
    const finalUserGoal =
      userGoal !== undefined ? userGoal : existingProfile?.userGoal

    // 2. Merge Mentorship Sessions
    const existingSessions = (existingProfile?.mentorshipSessions ||
      []) as MentorshipSession[]
    const incomingSessions = (mentorshipSessions || []) as MentorshipSession[]

    // Simple merge: Create a map by ID
    const sessionsMap = new Map()
    existingSessions.forEach((s) => sessionsMap.set(s.id, s))
    incomingSessions.forEach((s) => {
      // If exists, overwrite (assuming latest sync has truth, or we could check timestamps if we had them)
      // For now, overwrite is safe as client usually has latest
      sessionsMap.set(s.id, s)
    })
    const mergedSessions = Array.from(sessionsMap.values())

    await collection.updateOne(
      { userId: user.id },
      {
        $set: {
          progress: mergedProgress,
          mentorshipSessions: mergedSessions,
          userGoal: finalUserGoal,
          email: user.email,
          lastSyncedAt: new Date(),
        },
      },
      { upsert: true }
    )

    return NextResponse.json({
      progress: mergedProgress,
      mentorshipSessions: mergedSessions,
      userGoal: finalUserGoal,
      success: true,
    })
  } catch (error) {
    console.error('Sync Save Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
