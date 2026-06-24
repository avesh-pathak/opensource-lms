import mongoose, { Schema, Document } from 'mongoose'

export interface ICommunityPost extends Document {
  title: string
  content: string
  category: string // Kept for backward compatibility or sub-tags
  author: string // Display name (legacy or override)
  authorId?: mongoose.Types.ObjectId // Link to real user
  communityId: mongoose.Types.ObjectId
  type: 'standard' | 'resume'
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  isPinned?: boolean
  isLocked?: boolean
  resumeUrl?: string
  resumePublicId?: string // Cloudinary public_id for deletion/management
  fileName?: string // Original filename for display
  likes: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const CommunityPostSchema = new Schema<ICommunityPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, default: 'General' },
    author: { type: String, default: 'Babua Team' },
    authorId: { type: Schema.Types.ObjectId, ref: 'User' },
    communityId: {
      type: Schema.Types.ObjectId,
      ref: 'Community',
      required: true,
    },
    type: { type: String, enum: ['standard', 'resume'], default: 'standard' },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      default: 'PUBLISHED', // Default to published for now to maintain backward compat, or DRAFT if strict
    },
    isPinned: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
    resumeUrl: { type: String },
    resumePublicId: { type: String }, // Cloudinary public_id
    fileName: { type: String }, // Original filename
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
)

// Virtual for likes count
CommunityPostSchema.virtual('likesCount').get(function (this: ICommunityPost) {
  return this.likes.length || 0
})

// Ensure virtuals are included in JSON
CommunityPostSchema.set('toJSON', { virtuals: true })
CommunityPostSchema.set('toObject', { virtuals: true })

export default mongoose.models.CommunityPost ||
  mongoose.model<ICommunityPost>('CommunityPost', CommunityPostSchema)
