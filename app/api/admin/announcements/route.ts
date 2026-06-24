import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Announcement from '@/models/Announcement'
import { auth } from '@/lib/auth'
import { validateDemoAccess } from '@/lib/guards/demo-guard'
import { sendPushToAllUsers } from '@/lib/firebase/push'
import { handleApiError } from '@/lib/api-utils'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const announcements = await Announcement.find({})
      .sort({ createdAt: -1 })
      .lean()
    return NextResponse.json(announcements)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const demoError = validateDemoAccess(session, 'POST')
    if (demoError) return demoError

    const body = await req.json()
    await dbConnect()

    const announcement = await Announcement.create({
      title: body.title,
      content: body.content,
      priority: body.priority || 'NORMAL',
      createdBy: session.user.id,
      status: 'PUBLISHED', // Defaulting to PUBLISHED for now as per previous logic
    })

    logger.info(`[Announcement] Saved to DB: ${announcement._id}`)

    // Send FCM push to all users (best-effort, strictly non-blocking)
    try {
      logger.info('[Announcement] Initiating Push Notification...')
      sendPushToAllUsers({
        title: `📢 ${body.title}`,
        body:
          body.content?.substring(0, 100) +
          (body.content?.length > 100 ? '...' : ''),
        link: '/dashboard/announcements',
        data: {
          announcementId: announcement._id.toString(),
          priority: body.priority || 'NORMAL',
        },
      })
        .then((pushResult) => {
          logger.info(`[Announcement] Push Result:`, { pushResult })
        })
        .catch((err) => {
          logger.error('[Announcement] Push Promise Rejected:', { error: err })
        })
    } catch (pushSyncError) {
      logger.error('[Announcement] Push Sync Error (Ignored):', {
        error: pushSyncError,
      })
    }

    logger.info('[Announcement] Request Complete')
    return NextResponse.json({ success: true, id: announcement._id })
  } catch (error) {
    return handleApiError(error)
  }
}
