import ActivityLog from '@/models/ActivityLog'
import dbConnect from '@/lib/dbConnect'

export async function logActivity(
  userId: string,
  action: string,
  metadata: any = {}
) {
  try {
    await dbConnect()
    await ActivityLog.create({
      userId,
      action,
      metadata,
      createdAt: new Date(),
    })
  } catch (error) {
    console.error('Failed to log activity:', error)
    // Don't crash the main flow if logging fails
  }
}
