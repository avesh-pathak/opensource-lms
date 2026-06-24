import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import MentorAvailability from '@/models/MentorAvailability' // Added import

interface Props {
  params: Promise<{ id: string }>
}

// GET: Fetch mentor's availability slots (Real Data)
export async function GET(req: NextRequest, { params }: Props) {
  try {
    await dbConnect()
    const { id } = await params

    // Ideally we filter by mentorId if we had it in the slots.
    // user "id" param is available if we need it later.

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const slots = await MentorAvailability.find({
      mentorId: id,
      date: { $gte: today },
    })
      .sort({ date: 1, startTime: 1 })
      .lean()

    return NextResponse.json(slots)
  } catch (error: any) {
    console.error('Error fetching mentor availability:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}
