import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import Announcement from '@/models/Announcement'
import AnnouncementRead from '@/models/AnnouncementRead'
import Notification from '@/models/Notification'
import { markReadSchema, markAllReadSchema } from '@/lib/validators'

// POST - Mark announcement(s) as read
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(session.user.id)
    if (!isValidObjectId) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }

    await dbConnect()

    const body = await req.json()
    const userId = session.user.id

    // Check if marking all or single announcement
    const allResult = markAllReadSchema.safeParse(body)
    const singleResult = markReadSchema.safeParse(body)

    if (allResult.success && body.type === 'all') {
      // Mark ALL announcements as read for this user
      const announcements = await Announcement.find({
        status: 'PUBLISHED',
      }).select('_id')

      if (announcements.length > 0) {
        // Prepare read operations
        const operations = announcements.map((a) => ({
          updateOne: {
            filter: { userId, announcementId: a._id },
            update: {
              $setOnInsert: {
                userId,
                announcementId: a._id,
                readAt: new Date(),
              },
            },
            upsert: true,
          },
        }))

        if (operations.length > 0) {
          await AnnouncementRead.bulkWrite(operations)
        }
      }

      return NextResponse.json({
        success: true,
        message: 'All announcements marked as read',
        unreadCount: 0,
      })
    } else if (singleResult.success) {
      // Mark single announcement as read
      // Verify announcement exists
      const announcement = await Announcement.findById(body.announcementId)
      if (!announcement) {
        return NextResponse.json(
          { error: 'Announcement not found' },
          { status: 404 }
        )
      }

      // Upsert read record (idempotent - won't duplicate if already read)
      await AnnouncementRead.findOneAndUpdate(
        { userId, announcementId: body.announcementId },
        {
          $setOnInsert: {
            userId,
            announcementId: body.announcementId,
            readAt: new Date(),
          },
        },
        { upsert: true, new: true }
      )

      // Get updated unread count
      const totalAnnouncements = await Announcement.countDocuments({
        status: 'PUBLISHED',
      })
      const readCount = await AnnouncementRead.countDocuments({ userId })
      const unreadAnnouncements = Math.max(0, totalAnnouncements - readCount)

      // Add personal notification unread count
      const unreadPersonal = await Notification.countDocuments({
        userId,
        isRead: { $ne: true },
      })

      return NextResponse.json({
        success: true,
        unreadCount: unreadAnnouncements + unreadPersonal,
      })
    } else {
      return NextResponse.json(
        {
          error:
            "Invalid request body. Provide either { announcementId: string } or { type: 'all' }",
        },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Mark-read error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
