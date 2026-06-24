import { NextResponse } from 'next/server'
import Booking from '@/models/Booking'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import {
  validateObjectId,
  validateOwnership,
  handleApiError,
} from '@/lib/api-utils'
import { logger } from '@/lib/logger'

// DELETE: Cancel a booking
export async function DELETE(request: Request) {
  try {
    // 1. Auth check - no development bypasses
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // 2. Extract and validate booking ID
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('id')

    // 3. ObjectId validation (prevents crashes)
    const idError = validateObjectId(bookingId, 'Booking ID')
    if (idError) return idError

    // 4. Fetch booking
    const booking = await Booking.findById(bookingId)

    // 5. Ownership check (CRITICAL: prevent users deleting others' bookings)
    const ownershipError = validateOwnership(booking, session, 'Booking')
    if (ownershipError) return ownershipError

    // 6. Update booking status to cancelled
    booking.paymentStatus = 'cancelled'
    booking.status = 'cancelled'
    await booking.save()

    logger.info(
      `[Booking Cancelled] ID: ${bookingId}, User: ${session.user.id}`
    )

    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking,
    })
  } catch (error) {
    // 7. Centralized error handling (doesn't leak internals)
    return handleApiError(error)
  }
}
