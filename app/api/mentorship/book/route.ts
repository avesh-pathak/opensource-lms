import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import Booking from '@/models/Booking'
import Mentor from '@/models/Mentor'
import MentorAvailability from '@/models/MentorAvailability' // Added import
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import { bookingSchema } from '@/lib/validators'
import crypto from 'crypto'
import { notifyAdmins } from '@/lib/firebase/push'
import { validateObjectId, handleApiError } from '@/lib/api-utils'

export async function POST(request: Request) {
  try {
    await dbConnect()
    // const client = await clientPromise // Not needed with Mongoose model
    // const db = client.db()
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bodyRaw = await request.json()
    const validationResult = bookingSchema.safeParse(bodyRaw)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation Error', details: validationResult.error.format() },
        { status: 400 }
      )
    }

    const body = validationResult.data
    const {
      mentorId,
      sessionType,
      price,
      razorpayOrderId,
      razorpayPaymentId,
      date,
      dateString,
      startTime,
    } = body

    if (!mentorId) {
      return NextResponse.json(
        { error: 'Mentor ID is required' },
        { status: 400 }
      )
    }

    // ObjectId validation for mentorId
    const idError = validateObjectId(mentorId, 'Mentor ID')
    if (idError) return idError

    // Get mentor info first to check rate
    const mentor = await Mentor.findById(mentorId)
    if (!mentor) {
      return NextResponse.json({ error: 'Mentor not found' }, { status: 404 })
    }

    // Verify Payment if IDs are provided
    let isPaymentVerified = false
    if (razorpayOrderId && razorpayPaymentId) {
      const transaction = await mongoose.models.Transaction.findOne({
        'metadata.orderId': razorpayOrderId,
        'metadata.paymentId': razorpayPaymentId,
        status: 'completed',
      })
      if (transaction) {
        // Verify Amount Integrity
        if (transaction.amount < mentor.hourlyRate) {
          return NextResponse.json(
            { error: 'Payment amount mismatch. Potential fraud detected.' },
            { status: 400 }
          )
        }
        isPaymentVerified = true
      } else {
        return NextResponse.json(
          { error: 'Invalid or unverified payment details' },
          { status: 400 }
        )
      }
    }

    const userId = new mongoose.Types.ObjectId(session.user.id)
    const userEmail = session.user.email
    const userName = session.user.name

    // Use MongoDB transaction to prevent double-booking race condition
    const mongoSession = await mongoose.startSession()
    mongoSession.startTransaction()

    try {
      // Mark the slot as booked in availability collection (atomic check-and-set)
      const availabilityUpdate = await MentorAvailability.updateOne(
        {
          dateString: dateString,
          startTime: startTime,
          isBooked: false,
        },
        { $set: { isBooked: true, bookedBy: userId } }
      ).session(mongoSession)

      if (availabilityUpdate.modifiedCount === 0) {
        await mongoSession.abortTransaction()
        return NextResponse.json(
          { error: 'Slot not available or already booked' },
          { status: 400 }
        )
      }

      // Generate meeting link
      const meetingToken = crypto.randomBytes(16).toString('hex')
      const meetingLink = `https://meet.google.com/${meetingToken.substring(0, 12)}`

      // Create booking record
      const booking = await Booking.create(
        [
          {
            studentId: userId,
            studentEmail: userEmail,
            studentName: userName,
            mentorId: new mongoose.Types.ObjectId(mentorId),
            mentorName: mentor.name,
            date: date ? new Date(date) : new Date(),
            dateString: dateString || new Date().toISOString().split('T')[0],
            timeSlot: startTime || '10:00 AM',
            sessionType,
            price,
            paymentStatus: isPaymentVerified ? 'completed' : 'pending',
            razorpayOrderId,
            razorpayPaymentId,
            meetingLink,
          },
        ],
        { session: mongoSession }
      )

      await mongoSession.commitTransaction()

      // Notify admins about new mentorship booking (best-effort, outside transaction)
      notifyAdmins(
        'booking',
        'New Mentorship Booking',
        `${userName} booked a session with ${mentor.name} (${dateString}, ${startTime})`,
        '/admin/bookings',
        {
          studentId: session.user.id,
          studentName: userName || 'Unknown',
          studentEmail: userEmail || 'unknown@email.com',
        }
      ).catch((err) => console.error('Admin notify failed:', err))

      return NextResponse.json({
        success: true,
        booking: {
          id: booking[0]._id,
          meetingLink: booking[0].meetingLink,
          date: booking[0].dateString,
          time: booking[0].timeSlot,
        },
      })
    } catch (txError) {
      await mongoSession.abortTransaction()
      throw txError
    } finally {
      mongoSession.endSession()
    }
  } catch (error) {
    return handleApiError(error)
  }
}
