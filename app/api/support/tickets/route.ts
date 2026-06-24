import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { auth } from '@/lib/auth'
import { ObjectId } from 'mongodb'
import { sendPushToAdmins } from '@/lib/firebase/push'
import { validateRequestBody, handleApiError } from '@/lib/api-utils'
import { z } from 'zod'

// Zod schema for support ticket creation
const CreateTicketSchema = z.object({
  type: z.enum(['bug', 'feature', 'question', 'other']).default('bug'),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(2000, 'Description too long'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  screenshot: z.string().url().optional().nullable(),
})

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Zod validation
    const validation = await validateRequestBody(req, CreateTicketSchema)
    if ('error' in validation) return validation.error
    const { type, title, description, priority, screenshot } = validation.data

    const client = await clientPromise
    const db = client.db()

    const ticket = {
      userId: new ObjectId(session.user.id),
      userName: session.user.name,
      userEmail: session.user.email,
      type,
      title,
      description,
      priority,
      screenshot: screenshot || null,
      status: 'OPEN',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection('tickets').insertOne(ticket)

    // Create admin notifications in DB +send FCM push
    const admins = await db
      .collection('users')
      .find({ role: 'admin' })
      .toArray()
    for (const admin of admins) {
      const { createNotification } = await import('@/lib/notifications')
      await createNotification(
        admin._id,
        'INFO',
        'New Support Ticket',
        `New ${type} report from ${session.user.name}: ${title}`,
        '/admin/support'
      )
    }

    // Send FCM push to admins (best-effort)
    sendPushToAdmins(
      {
        title: `🐛 New ${type || 'Bug'} Report`,
        body: `${session.user.name}: ${title}`,
        link: '/admin/support',
      },
      {
        studentId: session.user.id,
        studentName: session.user.name || 'Unknown',
        studentEmail: session.user.email || 'unknown@email.com',
      }
    ).catch((err) => console.error('FCM push failed:', err))

    return NextResponse.json({ success: true, ticketId: result.insertedId })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function GET(_req: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db()

    const tickets = await db
      .collection('tickets')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(tickets)
  } catch (error) {
    return handleApiError(error)
  }
}
