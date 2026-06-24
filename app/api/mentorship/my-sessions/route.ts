import { NextResponse } from 'next/server'
import Booking from '@/models/Booking'
import Mentor from '@/models/Mentor'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import { handleApiError } from '@/lib/api-utils'

// GET: Fetch current user's upcoming sessions
export async function GET(_request: Request) {
  try {
    await dbConnect()

    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get upcoming bookings (date >= today) for the authenticated user
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const bookings = await Booking.find({
      studentId: session.user.id,
      date: { $gte: today },
      paymentStatus: { $in: ['completed', 'pending'] },
    })
      .sort({ date: 1 })
      .limit(10)
      .lean()

    // Enrich with mentor data using batch fetch instead of N+1
    const mentorIds = [
      ...new Set(bookings.map((b: any) => b.mentorId).filter(Boolean)),
    ]

    const mentors =
      mentorIds.length > 0
        ? await Mentor.find({ _id: { $in: mentorIds } }).lean()
        : []

    const mentorMap = new Map(mentors.map((m: any) => [m._id.toString(), m]))

    const enrichedBookings = bookings.map((booking: any) => {
      const mentor = booking.mentorId
        ? mentorMap.get(booking.mentorId.toString())
        : null

      return {
        id: booking._id,
        mentorName: booking.mentorName || mentor?.name || 'Mentor',
        mentorTitle: mentor?.title || 'Senior Engineer',
        mentorCompany: mentor?.company || 'Company',
        mentorImage: mentor?.image || '/assets/mentors/image.png',
        date: booking.dateString,
        time: `${booking.timeSlot}`,
        start: booking.timeSlot,
        meetingLink: booking.meetingLink || '#',
        status: 'upcoming',
        sessionType: booking.sessionType,
        paymentStatus: booking.paymentStatus,
      }
    })

    return NextResponse.json(enrichedBookings)
  } catch (error) {
    return handleApiError(error)
  }
}
