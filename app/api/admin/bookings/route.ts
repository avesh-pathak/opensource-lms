import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Booking from '@/models/Booking'
import mongoose from 'mongoose'
import { auth } from '@/lib/auth'
import { handleApiError } from '@/lib/api-utils'

// Admin auth check helper
const isAdmin = async () => {
  const session = await auth()
  return session?.user?.role === 'admin'
}

// GET: Fetch all bookings with optional filters (ADMIN ONLY)
export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    await dbConnect()
    const { searchParams } = new URL(req.url)

    // Build query from filters
    const query: any = {}

    // Filter by mentor
    const mentorId = searchParams.get('mentorId')
    if (mentorId && mongoose.Types.ObjectId.isValid(mentorId)) {
      query.mentorId = new mongoose.Types.ObjectId(mentorId)
    }

    // Filter by date range
    const startDateStr = searchParams.get('startDate')
    const endDateStr = searchParams.get('endDate')

    if (startDateStr || endDateStr) {
      query.date = {}

      if (startDateStr) {
        const parsedStart = new Date(startDateStr)
        if (isNaN(parsedStart.getTime())) {
          return NextResponse.json(
            { error: 'Invalid startDate format' },
            { status: 400 }
          )
        }
        query.date.$gte = parsedStart
      }

      if (endDateStr) {
        const parsedEnd = new Date(endDateStr)
        if (isNaN(parsedEnd.getTime())) {
          return NextResponse.json(
            { error: 'Invalid endDate format' },
            { status: 400 }
          )
        }
        query.date.$lte = parsedEnd
      }
    }

    // Filter by session type
    const sessionType = searchParams.get('sessionType')
    if (
      sessionType &&
      ['sos', 'roast', 'consult', '1-1'].includes(sessionType)
    ) {
      query.sessionType = sessionType
    }

    // Filter by payment status
    const paymentStatus = searchParams.get('paymentStatus')
    if (
      paymentStatus &&
      ['pending', 'completed', 'failed'].includes(paymentStatus)
    ) {
      query.paymentStatus = paymentStatus
    }

    const bookings = await Booking.find(query)
      .sort({ date: -1, createdAt: -1 })
      .lean()

    // Calculate summary stats
    const totalBookings = bookings.length
    const completedPayments = bookings.filter(
      (b: any) => b.paymentStatus === 'completed'
    ).length
    const totalRevenue = bookings
      .filter((b: any) => b.paymentStatus === 'completed')
      .reduce((sum: number, b: any) => sum + (b.price || 0), 0)

    return NextResponse.json({
      bookings,
      stats: {
        totalBookings,
        completedPayments,
        totalRevenue,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
