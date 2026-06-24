import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAdminNotification extends Document {
  type: string
  title: string
  message: string
  link: string
  studentId: mongoose.Types.ObjectId
  studentName: string
  studentEmail: string
  isRead: boolean
  createdAt: Date
}

const AdminNotificationSchema = new Schema<IAdminNotification>({
  type: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  studentEmail: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
})

// Index for fetching unread notifications
AdminNotificationSchema.index({ isRead: 1, createdAt: -1 })

const AdminNotification: Model<IAdminNotification> =
  mongoose.models.AdminNotification ||
  mongoose.model<IAdminNotification>(
    'AdminNotification',
    AdminNotificationSchema
  )

export default AdminNotification
