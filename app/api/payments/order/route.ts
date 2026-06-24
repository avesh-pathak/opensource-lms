import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { auth } from '@/lib/auth'
import { handleApiError } from '@/lib/api-utils'

export async function POST(request: Request) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })

    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { amount, currency = 'INR' } = await request.json()

    const options = {
      amount: Math.round(amount * 100), // Razorpay accepts amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json(order)
  } catch (error) {
    return handleApiError(error)
  }
}
