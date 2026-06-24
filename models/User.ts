import mongoose, { Schema } from 'mongoose'

export interface User {
  _id?: string
  name: string
  email: string
  username?: string
  image?: string
  emailVerified?: Date
  createdAt: Date
  updatedAt: Date
  // Progress tracking
  solvedProblems: mongoose.Types.ObjectId[]
  experiencePoints: number
  currentStreak: number
  lastActivityDate?: Date
  resume?: string
  // Public Profile fields
  isProfilePublic?: boolean
  isResumePublic?: boolean
  linkedIn?: string
  leetCode?: string
  bio?: string
  resumePublicId?: string
}

const UserSchema = new Schema<User>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    username: { type: String, unique: true, sparse: true },
    image: { type: String },
    emailVerified: { type: Date },
    // Progress tracking
    solvedProblems: [{ type: Schema.Types.ObjectId, ref: 'Problem' }],
    experiencePoints: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    lastActivityDate: { type: Date },
    resume: { type: String },
    resumePublicId: { type: String },
    // Public Profile fields
    isProfilePublic: { type: Boolean, default: false },
    isResumePublic: { type: Boolean, default: false },
    linkedIn: { type: String },
    leetCode: { type: String },
    bio: { type: String, maxlength: 200 },
  },
  { timestamps: true }
)

// Indexes for Leaderboard and Analytics
UserSchema.index({ experiencePoints: -1 })
UserSchema.index({ solvedProblems: 1 })

export default mongoose.models.User || mongoose.model<User>('User', UserSchema)
