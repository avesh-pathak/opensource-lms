import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import Announcement from '@/models/Announcement'
import Notification from '@/models/Notification'
import AnnouncementRead from '@/models/AnnouncementRead'

export async function GET() {
  try {
    const session = await auth()

    await dbConnect()

    // Fetch all PUBLISHED announcements
    const announcements = await Announcement.find({ status: 'PUBLISHED' })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean()

    // Get user's read announcements if authenticated
    let readAnnouncementIds: Set<string> = new Set()
    const isValidObjectId =
      session?.user?.id && /^[0-9a-fA-F]{24}$/.test(session.user.id)

    if (isValidObjectId) {
      const userReads = await AnnouncementRead.find({
        userId: session.user.id,
      }).lean()

      readAnnouncementIds = new Set(
        userReads.map((r: any) => r.announcementId.toString())
      )
    }

    // Transform announcements with correct isRead status
    // FILTER: Admins should not see student announcements in their bell (per user request)
    const isAdmin = session?.user?.role === 'admin'

    const announcementNotifications = isAdmin
      ? []
      : announcements.map((a: any) => ({
          _id: a._id.toString(),
          type: 'announcement',
          title: a.title,
          message: a.content,
          createdAt: a.createdAt,
          isRead: readAnnouncementIds.has(a._id.toString()),
          priority: a.priority || 'NORMAL',
        }))

    // Fetch personal notifications if authenticated
    let personalNotifications: any[] = []
    if (isValidObjectId) {
      try {
        personalNotifications = await Notification.find({
          userId: session.user.id,
        })
          .sort({ createdAt: -1 })
          .limit(20)
          .lean()
      } catch (e) {
        console.error('Error fetching personal notifications:', e)
      }
    }

    // Combine and sort by date
    const allNotifications = [
      ...announcementNotifications,
      ...personalNotifications.map((n) => ({
        ...n,
        _id: n._id.toString(),
        type: 'personal',
        isRead: n.isRead ?? false,
      })),
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    // Calculate unread count
    const unreadCount = allNotifications.filter((n) => !n.isRead).length

    return NextResponse.json({
      notifications: allNotifications,
      unreadCount,
    })
  } catch (error: any) {
    console.error('Notifications API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// Mark personal notifications as read (legacy support)
export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const body = await req.json()
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(session.user.id)

    if (!isValidObjectId) {
      return NextResponse.json({ success: true, unreadCount: 0 })
    }

    if (body.all) {
      // Mark all personal notifications as read
      await Notification.updateMany(
        { userId: session.user.id },
        { isRead: true }
      )
    } else if (body.id) {
      // Mark single personal notification as read
      await Notification.findOneAndUpdate(
        { _id: body.id, userId: session.user.id },
        { isRead: true }
      )
    }

    // Get updated unread count
    const unreadPersonal = await Notification.countDocuments({
      userId: session.user.id,
      isRead: { $ne: true },
    })

    // Get unread announcements count
    // This is less efficient in Mongoose without aggregations but cleaner
    const announcements = await Announcement.find({
      status: 'PUBLISHED',
    }).select('_id')
    const userReads = await AnnouncementRead.find({
      userId: session.user.id,
    }).lean()

    const readIds = new Set(
      userReads.map((r: any) => r.announcementId.toString())
    )
    const unreadAnnouncements = announcements.filter(
      (a) => !readIds.has(a._id.toString())
    ).length

    return NextResponse.json({
      success: true,
      unreadCount: unreadPersonal + unreadAnnouncements,
    })
  } catch (error: any) {
    console.error('PATCH notifications error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// DELETE - Clear all notifications for the user
export async function DELETE(_req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(session.user.id)
    if (!isValidObjectId) {
      return NextResponse.json({ success: true })
    }

    await dbConnect()

    // Clear personal notifications
    await Notification.deleteMany({ userId: session.user.id })

    return NextResponse.json({
      success: true,
      message: 'Notifications cleared',
    })
  } catch (error: any) {
    console.error('DELETE notifications error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
