import mongoose, { Schema } from 'mongoose'

export interface Hackathon {
  _id?: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  eventStatus: 'UPCOMING' | 'ACTIVE' | 'COMPLETED'
  participants: number
  prize: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'LEGENDARY'
  image?: string
  registrationUrl?: string
  rules?: string[]
  requirements?: string[]
  tags?: string[]
  waitlist?: string[] // Array of User IDs
  createdAt: Date
  updatedAt: Date
  progress?: number
  pattern?: string
}

const HackathonSchema = new Schema<Hackathon>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      default: 'DRAFT',
    },
    eventStatus: {
      type: String,
      enum: ['UPCOMING', 'ACTIVE', 'COMPLETED'],
      default: 'UPCOMING',
    },
    participants: { type: Number, default: 0 },
    prize: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'LEGENDARY'],
      default: 'BEGINNER',
    },
    image: { type: String },
    registrationUrl: { type: String },
    rules: [{ type: String }],
    requirements: [{ type: String }],
    tags: [{ type: String }],
    waitlist: [{ type: String }],
    progress: { type: Number, default: 0 },
    pattern: { type: String, default: 'General' },
  },
  { timestamps: true }
)

export default mongoose.models.Hackathon ||
  mongoose.model<Hackathon>('Hackathon', HackathonSchema)
