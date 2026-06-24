import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import Notification from '@/models/Notification'
import { sendPushToAllUsers } from '@/lib/firebase/push'

export type NotificationType =
  | 'HACKATHON_NEW'
  | 'SQUAD_NEW'
  | 'COMMUNITY_NEW'
  | 'SYSTEM'

interface NotificationPayload {
  title: string
  message: string
  link: string
  type: NotificationType
  metadata?: Record<string, any>
}

/**
 * Notify all students about new content.
 * 1. Creates DB Record for each student (Source of Truth)
 * 2. Sends FCM Push (Best Effort)
 */
export async function notifyAllStudents(payload: NotificationPayload) {
  try {
    await dbConnect()

    // 1. Get all students (exclude admins)
    const students = await User.find({ role: 'user' }).select('_id')

    if (students.length === 0) return { sent: 0, failed: 0 }

    // 2. Prepare Bulk Insert
    const notifications = students.map((student) => ({
      userId: student._id,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      link: payload.link,
      metadata: payload.metadata || {},
      isRead: false,
    }))

    // 3. Bulk Write to DB (The Guarantee)
    if (notifications.length > 0) {
      await Notification.insertMany(notifications)
    }

    // 4. Send Push (The Bonus)
    // Note: sendPushToAllUsers already filters out Admins internally
    const pushResult = await sendPushToAllUsers({
      title: payload.title,
      body: payload.message,
      link: payload.link,
      data: {
        type: payload.type,
        ...payload.metadata,
      },
    })

    return pushResult
  } catch (error) {
    console.error('[NotifyAllStudents] Failed:', error)
    // Return dummy success so API doesn't crash
    return { success: false, sent: 0, failed: 0 }
  }
}
