import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Mentor from '@/models/Mentor'
import { auth } from '@/lib/auth'

// GET: Fetch all mentors
export async function GET() {
  try {
    await dbConnect()
    const mentors = await Mentor.find({ isActive: true }).sort({
      createdAt: -1,
    })
    return NextResponse.json(mentors)
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch mentors' },
      { status: 500 }
    )
  }
}

// POST: Create a new mentor
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const body = await req.json()

    // Basic validation could go here

    const mentor = await Mentor.create(body)
    return NextResponse.json(mentor, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to create mentor' },
      { status: 500 }
    )
  }
}
