import { getAdminMessaging } from './admin'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

interface PushPayload {
  title: string
  body: string
  link?: string
  data?: Record<string, string>
}

interface StudentInfo {
  studentName: string
  studentEmail: string
  studentId: string
}

/**
 * Send push notification to all admin users
 * Best-effort: failures are logged but don't throw
 */
export async function sendPushToAdmins(
  payload: PushPayload,
  studentInfo?: StudentInfo
): Promise<{ success: boolean; sent: number; failed: number }> {
  try {
    const messaging = getAdminMessaging()
    if (!messaging) {
      console.warn('Firebase Admin Messaging not initialized')
      return { success: false, sent: 0, failed: 0 }
    }

    const client = await clientPromise
    const db = client.db()

    // Get admin user IDs
    const admins = await db
      .collection('users')
      .find({ role: 'admin' })
      .project({ _id: 1 })
      .toArray()

    const adminIds = admins.map((a) => a._id)

    // Get device tokens for admins
    const tokens = await db
      .collection('deviceTokens')
      .find({ userId: { $in: adminIds } })
      .toArray()

    if (tokens.length === 0) {
      return { success: true, sent: 0, failed: 0 }
    }

    // Prepare message
    const message = {
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: {
        type: 'admin_notification',
        link: payload.link || '/admin',
        ...(studentInfo && {
          studentName: studentInfo.studentName,
          studentEmail: studentInfo.studentEmail,
          studentId: studentInfo.studentId,
        }),
        ...payload.data,
      },
      tokens: tokens.map((t) => t.token),
    }

    // Send multicast (max 500 tokens per call)
    const result = await messaging.sendEachForMulticast(message)

    // Clean up invalid tokens
    if (result.failureCount > 0) {
      const invalidTokens: string[] = []
      result.responses.forEach((resp, idx) => {
        if (
          !resp.success &&
          resp.error?.code === 'messaging/registration-token-not-registered'
        ) {
          invalidTokens.push(tokens[idx].token)
        }
      })

      if (invalidTokens.length > 0) {
        await db.collection('deviceTokens').deleteMany({
          token: { $in: invalidTokens },
        })
        console.log(`Cleaned ${invalidTokens.length} invalid FCM tokens`)
      }
    }

    return {
      success: true,
      sent: result.successCount,
      failed: result.failureCount,
    }
  } catch (error) {
    console.error('Push to admins failed:', error)
    return { success: false, sent: 0, failed: 0 }
  }
}

/**
 * Send push notification to all users (for announcements)
 * Best-effort: failures are logged but don't throw
 */
export async function sendPushToAllUsers(
  payload: PushPayload
): Promise<{ success: boolean; sent: number; failed: number }> {
  try {
    const messaging = getAdminMessaging()
    if (!messaging) {
      console.warn('Firebase Admin Messaging not initialized')
      return { success: false, sent: 0, failed: 0 }
    }

    const client = await clientPromise
    const db = client.db()

    // Get admin user IDs to exclude them from the broadcast
    const admins = await db
      .collection('users')
      .find({ role: 'admin' })
      .project({ _id: 1 })
      .toArray()
    const adminIds = new Set(admins.map((a) => a._id.toString()))

    // Get device tokens, excluding admins
    const allTokens = await db.collection('deviceTokens').find({}).toArray()
    const tokens = allTokens.filter((t) => !adminIds.has(t.userId?.toString()))

    if (tokens.length === 0) {
      return { success: true, sent: 0, failed: 0 }
    }

    let totalSent = 0
    let totalFailed = 0
    const invalidTokens: string[] = []

    // Chunk tokens (max 500 per multicast)
    const chunkSize = 500
    for (let i = 0; i < tokens.length; i += chunkSize) {
      const chunk = tokens.slice(i, i + chunkSize)

      const message = {
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: {
          type: 'announcement',
          link: payload.link || '/dashboard/announcements',
          ...payload.data,
        },
        tokens: chunk.map((t) => t.token),
      }

      const result = await messaging.sendEachForMulticast(message)
      totalSent += result.successCount
      totalFailed += result.failureCount

      // Collect invalid tokens
      result.responses.forEach((resp, idx) => {
        if (
          !resp.success &&
          resp.error?.code === 'messaging/registration-token-not-registered'
        ) {
          invalidTokens.push(chunk[idx].token)
        }
      })
    }

    // Clean up invalid tokens
    if (invalidTokens.length > 0) {
      await db.collection('deviceTokens').deleteMany({
        token: { $in: invalidTokens },
      })
      console.log(`Cleaned ${invalidTokens.length} invalid FCM tokens`)
    }

    return { success: true, sent: totalSent, failed: totalFailed }
  } catch (error) {
    console.error('Push to users failed:', error)
    return { success: false, sent: 0, failed: 0 }
  }
}

/**
 * Create admin notification in DB + send push
 */
export async function notifyAdmins(
  type: string,
  title: string,
  message: string,
  link: string,
  studentInfo: StudentInfo
): Promise<void> {
  try {
    const client = await clientPromise
    const db = client.db()

    // Save to AdminNotification collection (source of truth)
    await db.collection('adminNotifications').insertOne({
      type,
      title,
      message,
      link,
      studentId: new ObjectId(studentInfo.studentId),
      studentName: studentInfo.studentName,
      studentEmail: studentInfo.studentEmail,
      isRead: false,
      createdAt: new Date(),
    })

    // Send push (best-effort)
    await sendPushToAdmins({ title, body: message, link }, studentInfo)
  } catch (error) {
    // Log but don't throw - DB save is critical, push is best-effort
    console.error('notifyAdmins error:', error)
  }
}
