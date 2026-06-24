import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import { NextResponse } from 'next/server'
import mongoose from 'mongoose'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await dbConnect()
  const db = mongoose.connection.db
  if (!db) return NextResponse.json({ error: 'DB Error' }, { status: 500 })
  const users = db.collection('users')

  try {
    const { ObjectId } = await import('mongodb')

    // Validate ObjectId format (24 character hex string)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(session.user.id)
    if (!isValidObjectId) {
      // Admin or non-standard user - return null state
      return NextResponse.json({ data: null })
    }

    const user = await users.findOne({ _id: new ObjectId(session.user.id) })

    return NextResponse.json({ data: user?.state || null })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data } = await req.json()
    await dbConnect()
    const db = mongoose.connection.db
    if (!db) return NextResponse.json({ error: 'DB Error' }, { status: 500 })
    const users = db.collection('users')
    const problemsCol = db.collection('problems')

    const { ObjectId } = await import('mongodb')

    // 1. Calculate XP and Solved Count
    const completedProblemIds = Object.keys(data.problems || {}).filter(
      (id) => data.problems[id].status === 'Completed'
    )

    // Fetch difficulties for these problems
    const problems = await problemsCol
      .find({
        _id: {
          $in: completedProblemIds.map((id) =>
            id.length === 24 ? new ObjectId(id) : id
          ) as any,
        },
      })
      .toArray()

    let totalXP = 0
    const problemsSolved = completedProblemIds.length

    problems.forEach((p) => {
      const difficulty = p.difficulty || 'Easy'
      if (difficulty === 'Easy') totalXP += 10
      else if (difficulty === 'Medium') totalXP += 30
      else if (difficulty === 'Hard') totalXP += 100
    })

    // Validate ObjectId format (24 character hex string)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(session.user.id)
    if (!isValidObjectId) {
      // Admin or non-standard user - skip state update
      return NextResponse.json({ success: true, points: 0, problemsSolved: 0 })
    }

    // 2. Update user document
    await users.updateOne(
      { _id: new ObjectId(session.user.id) },
      {
        $set: {
          state: data,
          points: totalXP,
          problemsSolved: problemsSolved,
          updatedAt: new Date().toISOString(),
        },
      }
    )

    return NextResponse.json({ success: true, points: totalXP, problemsSolved })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
