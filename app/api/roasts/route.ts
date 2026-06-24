import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { auth } from '@/lib/auth'
import { handleApiError } from '@/lib/api-utils'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { mentorId, resumeUrl, notes, type } = body

    if (!resumeUrl) {
      return NextResponse.json(
        { error: 'Resume URL is required' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db()

    // This 'roasts' collection is what the Admin Moderation queue reads from
    const roast = {
      userId: session.user.id, // Ensure user ID is stored for fetching
      userName: session.user.name,
      userImage: session.user.image,
      mentorId,
      resumeUrl,
      notes,
      status: 'Pending', // Needs admin verification
      createdAt: new Date(),
      type: type || 'ROAST',
    }

    const result = await db.collection('roasts').insertOne(roast)

    // Notify Admins
    const admins = await db
      .collection('users')
      .find({ role: 'admin' })
      .toArray()

    if (admins.length > 0) {
      try {
        const { createNotification } = await import('@/lib/notifications')
        const results = await Promise.allSettled(
          admins.map((admin) =>
            createNotification(
              admin._id,
              'SUBMISSION',
              'New Roast Request',
              `${session.user.name} submitted a resume for roasting.`,
              '/admin/moderation'
            )
          )
        )

        // Log failed notifications
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            console.error(
              `Failed to notify admin ${admins[index]._id}:`,
              result.reason
            )
          }
        })
      } catch (notifyError) {
        // Swallow notification errors so the primary action (roast creation) isn't affected
        console.error('Failed to send admin notifications:', notifyError)
      }
    }

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    return handleApiError(error)
  }
}
