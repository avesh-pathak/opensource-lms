import { NextResponse } from 'next/server'
import Squad from '@/models/Squad'
import Transaction from '@/models/Transaction'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import { notifyAdmins } from '@/lib/firebase/push'
import {
  validateObjectId,
  validateRequestBody,
  handleApiError,
} from '@/lib/api-utils'
import { z } from 'zod'

// Zod schema for squad join
const JoinSquadSchema = z.object({
  razorpayOrderId: z.string().min(1, 'Order ID required'),
  razorpayPaymentId: z.string().min(1, 'Payment ID required'),
})

// POST - Join a squad after payment
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const { id } = await params

    // ObjectId validation
    const idError = validateObjectId(id, 'Squad ID')
    if (idError) return idError

    // Zod validation
    const validation = await validateRequestBody(request, JoinSquadSchema)
    if ('error' in validation) return validation.error
    const { razorpayOrderId, razorpayPaymentId } = validation.data

    const userId = session.user.id
    const userName = session.user.name || 'Unknown User'
    const userEmail = session.user.email || 'unknown@email.com'

    const squad = await Squad.findById(id)
    if (!squad) {
      return NextResponse.json({ error: 'Squad not found' }, { status: 404 })
    }

    // Check if squad is full
    if (squad.memberCount >= squad.maxMembers) {
      return NextResponse.json({ error: 'Squad is full' }, { status: 400 })
    }

    // Check if user is already a member
    if (squad.members.includes(userId)) {
      return NextResponse.json({ error: 'Already a member' }, { status: 400 })
    }

    // Create Transaction for squad subscription (for Financial Hub tracking)
    await Transaction.create({
      userId,
      amount: squad.monthlyPrice,
      currency: 'INR',
      status: 'completed',
      type: 'squad_subscription',
      squadId: squad._id,
      metadata: {
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        squadName: squad.name,
      },
    })

    // Add user to squad
    squad.members.push(userId)
    squad.memberCount = squad.members.length

    // Update status if full
    if (squad.memberCount >= squad.maxMembers) {
      squad.status = 'full'
    }

    await squad.save()

    // Notify admins about new squad join (best-effort)
    if (userId) {
      notifyAdmins(
        'squad_join',
        'New Squad Join',
        `${userName} joined squad "${squad.name}"`,
        '/admin/squads',
        {
          studentId: userId,
          studentName: userName,
          studentEmail: userEmail,
        }
      ).catch((err) => console.error('Admin notify failed:', err))
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully joined the squad!',
      squad,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
