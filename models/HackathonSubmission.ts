import mongoose, { Schema, Document } from 'mongoose'

export interface HackathonSubmission extends Document {
  hackathonId: mongoose.Schema.Types.ObjectId
  userId: mongoose.Schema.Types.ObjectId
  title: string
  userName: string
  userAvatar?: string
  repoUrl: string
  deployedUrl?: string
  videoUrl?: string
  description: string
  techStack?: string[]
  status: 'Pending' | 'Reviewed' | 'Winner' | 'Rejected'
  feedback?: string
  score?: number
  createdAt: Date
  updatedAt: Date
}

const HackathonSubmissionSchema = new Schema<HackathonSubmission>(
  {
    hackathonId: {
      type: Schema.Types.ObjectId,
      ref: 'Hackathon',
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true }, // Project Title
    userName: { type: String, required: true },
    userAvatar: { type: String },
    repoUrl: { type: String, required: true },
    deployedUrl: { type: String },
    videoUrl: { type: String },
    description: { type: String },
    techStack: [{ type: String }],
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Winner', 'Rejected'],
      default: 'Pending',
    },
    feedback: { type: String },
    score: { type: Number },
  },
  { timestamps: true }
)

// Indexes
HackathonSubmissionSchema.index({ hackathonId: 1, userId: 1 }, { unique: true })
HackathonSubmissionSchema.index({ userId: 1 })

export default mongoose.models.HackathonSubmission ||
  mongoose.model<HackathonSubmission>(
    'HackathonSubmission',
    HackathonSubmissionSchema
  )
