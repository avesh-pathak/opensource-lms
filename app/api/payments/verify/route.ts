import { NextResponse } from 'next/server'
import crypto from 'crypto'
import Transaction from '@/models/Transaction'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import { notifyAdmins } from '@/lib/firebase/push'
import { handleApiError } from '@/lib/api-utils'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      currency,
      expectedAmount, // SECURITY: Frontend should send expected amount for verification
    } = body

    // SECURITY: Verify signature first
    const signatureBody = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(signatureBody.toString())
      .digest('hex')

    const isAuthentic = expectedSignature === razorpay_signature

    if (!isAuthentic) {
      console.error('[Payment Verify] Invalid signature')
      return NextResponse.json(
        { success: false, message: 'Invalid Signature' },
        { status: 400 }
      )
    }

    // SECURITY: Verify amount matches expected (prevents amount manipulation)
    if (expectedAmount && amount !== expectedAmount) {
      console.error(
        `[Payment Verify] Amount mismatch: received ${amount}, expected ${expectedAmount}`
      )
      return NextResponse.json(
        {
          success: false,
          message: 'Amount verification failed',
        },
        { status: 400 }
      )
    }

    await dbConnect()

    // Idempotency Check - prevent double processing
    const existingTx = await Transaction.findOne({
      'metadata.orderId': razorpay_order_id,
      status: 'completed',
    })

    if (existingTx) {
      return NextResponse.json({
        success: true,
        message: 'Payment already processed',
      })
    }

    // Use session userId
    const userId = session.user.id
    const userName = session?.user?.name || 'Unknown User'
    const userEmail = session?.user?.email || 'unknown@email.com'

    await Transaction.create({
      userId,
      amount,
      currency,
      status: 'completed',
      type: 'one_time',
      metadata: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      },
    })

    // Notify admins about new payment (best-effort)
    if (userId) {
      notifyAdmins(
        'payment',
        'New Payment Received',
        `${userName} paid ₹${amount / 100}`,
        '/admin/transactions',
        {
          studentId: userId,
          studentName: userName,
          studentEmail: userEmail,
        }
      ).catch((err) => console.error('Admin notify failed:', err))
    }

    return NextResponse.json({
      success: true,
      message: 'Payment Verified & Recorded',
    })
  } catch (error) {
    return handleApiError(error)
  }
}
