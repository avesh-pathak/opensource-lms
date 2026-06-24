import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import dbConnect from '@/lib/dbConnect'
import Enrollment from '@/models/Enrollment'
import Transaction from '@/models/Transaction'
import Squad from '@/models/Squad'
import { auth } from '@/lib/auth'
import { handleApiError } from '@/lib/api-utils'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      squadId,
      amount,
    } = body

    // 1. Verify Signature
    const bodyStr = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(bodyStr.toString())
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    await dbConnect()

    // 2. Check Capacity
    const squad = await Squad.findById(squadId)
    if (!squad)
      return NextResponse.json({ error: 'Squad not found' }, { status: 404 })

    if (squad.memberCount >= squad.maxMembers) {
      return NextResponse.json({ error: 'Squad is full' }, { status: 400 })
    }

    // 3. Create Transaction
    const transaction = await Transaction.create({
      userId: session.user.id,
      amount: amount,
      currency: 'INR',
      status: 'completed',
      type: 'squad_subscription',
      squadId: squadId,
      metadata: {
        paymentGateway: 'Razorpay',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      },
    })

    // 4. Create Enrollment
    const enrollment = await Enrollment.create({
      squadId: squadId,
      studentId: session.user.id,
      studentName: session.user.name,
      studentEmail: session.user.email,
      paymentId: transaction._id,
      status: 'active',
    })

    // 5. Update Squad Member Count & Add Member
    await Squad.findByIdAndUpdate(squadId, {
      $inc: { memberCount: 1 },
      $push: { members: session.user.id },
    })

    return NextResponse.json({ success: true, enrollmentId: enrollment._id })
  } catch (error) {
    return handleApiError(error)
  }
}
