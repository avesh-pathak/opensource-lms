import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Mentor from '@/models/Mentor'
import { auth } from '@/lib/auth'

interface Props {
  params: Promise<{
    id: string
  }>
}

// GET: Fetch single mentor
export async function GET(req: NextRequest, { params }: Props) {
  try {
    await dbConnect()
    const { id } = await params
    const mentor = await Mentor.findById(id)
    if (!mentor) {
      return NextResponse.json({ error: 'Mentor not found' }, { status: 404 })
    }
    return NextResponse.json(mentor)
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch mentor' },
      { status: 500 }
    )
  }
}

// PUT: Update mentor
export async function PUT(req: NextRequest, { params }: Props) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const { id } = await params
    const body = await req.json()
    const mentor = await Mentor.findByIdAndUpdate(id, body, { new: true })
    if (!mentor) {
      return NextResponse.json({ error: 'Mentor not found' }, { status: 404 })
    }
    return NextResponse.json(mentor)
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to update mentor' },
      { status: 500 }
    )
  }
}

// DELETE: Soft delete mentor (set isActive: false) or hard delete
export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const { id } = await params
    // Standard delete for now, or use soft delete based on requirements
    const mentor = await Mentor.findByIdAndDelete(id)
    if (!mentor) {
      return NextResponse.json({ error: 'Mentor not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Mentor deleted successfully' })
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to delete mentor' },
      { status: 500 }
    )
  }
}
