import mongoose, { Schema } from 'mongoose'

export interface IProject {
  title: string
  description: string
  userId: mongoose.Schema.Types.ObjectId
  isOfficial: boolean
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'
  requirements?: string[]
  githubUrl?: string
  liveUrl?: string
  tags: string[]
  status: 'In Progress' | 'Completed' | 'Research' | 'Published' // Published for Official
  progress: number
  milestones: { title: string; completed: boolean }[]
  lastActivityDate: Date
  lastActivity: string
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' }, // Optional for now to support legacy
    isOfficial: { type: Boolean, default: false },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
    requirements: [{ type: String }],
    githubUrl: { type: String },
    liveUrl: { type: String },
    tags: [{ type: String }],
    status: {
      type: String,
      enum: ['In Progress', 'Completed', 'Research', 'Published'],
      default: 'In Progress',
    },
    progress: { type: Number, default: 0 },
    milestones: [
      {
        title: { type: String },
        completed: { type: Boolean, default: false },
      },
    ],
    lastActivityDate: { type: Date, default: Date.now },
    lastActivity: { type: String, default: 'Just now' },
  },
  { timestamps: true }
)

// Index for sorting
ProjectSchema.index({ lastActivityDate: -1 })
ProjectSchema.index({ isOfficial: 1 })
ProjectSchema.index({ userId: 1 })

export default mongoose.models.Project ||
  mongoose.model<IProject>('Project', ProjectSchema)
