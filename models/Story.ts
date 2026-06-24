import mongoose, { Schema } from 'mongoose'

export interface AchievementStory {
  userId: mongoose.Types.ObjectId
  title: string
  builder: string
  avatar: string
  content: string
  category: string
  company?: string
  proofUrl: string
  status: 'PENDING' | 'VERIFIED' | 'REJECTED'
  createdAt: Date
  updatedAt: Date
}

const StorySchema = new Schema<AchievementStory>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: true },
    builder: { type: String, required: true },
    avatar: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    company: { type: String },
    proofUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
)

export default mongoose.models.Story ||
  mongoose.model<AchievementStory>('Story', StorySchema)
