import mongoose, { Schema, Document } from 'mongoose'

export interface IAnnouncementRead extends Document {
  userId: mongoose.Types.ObjectId
  announcementId: mongoose.Types.ObjectId
  readAt: Date
}

const AnnouncementReadSchema = new Schema<IAnnouncementRead>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    announcementId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    readAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
)

// Compound index for fast lookup: "has this user read this announcement?"
AnnouncementReadSchema.index({ userId: 1, announcementId: 1 }, { unique: true })

// Index for fetching all reads by a user
AnnouncementReadSchema.index({ userId: 1 })

export default mongoose.models.AnnouncementRead ||
  mongoose.model<IAnnouncementRead>('AnnouncementRead', AnnouncementReadSchema)
