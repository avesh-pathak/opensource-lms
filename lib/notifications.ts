import dbConnect from '@/lib/dbConnect'
import Notification from '@/models/Notification'
import { ObjectId } from 'mongodb'

export async function createNotification(
  userId: string | ObjectId,
  type:
    | 'INFO'
    | 'SUCCESS'
    | 'WARNING'
    | 'ERROR'
    | 'ANNOUNCEMENT'
    | 'MEETING'
    | 'SUBMISSION',
  title: string,
  message: string,
  link?: string
) {
  try {
    await dbConnect()

    await Notification.create({
      userId,
      type,
      title,
      message,
      link,
      isRead: false,
    })
  } catch (error) {
    console.error('Failed to create notification:', error)
  }
}
