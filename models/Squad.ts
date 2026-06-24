import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ISquad extends Document {
  name: string
  slug: string
  mentorId: string
  mentorName: string
  mentorImage: string
  mentorTitle: string
  mentorCompany: string
  category: 'System Design' | 'DSA' | 'Frontend' | 'Backend' | 'AI/ML'
  description: string
  manifesto: string[]
  monthlyPrice: number
  memberCount: number
  maxMembers: number
  weeklySchedule: string[]
  nextSession: string
  status: 'active' | 'starting-soon' | 'full'
  members: string[] // User IDs
  createdAt: Date
  updatedAt: Date
}

const SquadSchema = new Schema<ISquad>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    mentorId: { type: String, required: true },
    mentorName: { type: String, required: true },
    mentorImage: { type: String, default: '/assets/mentors/image.png' },
    mentorTitle: { type: String, required: true },
    mentorCompany: { type: String, required: true },
    category: {
      type: String,
      enum: ['System Design', 'DSA', 'Frontend', 'Backend', 'AI/ML'],
      required: true,
    },
    description: { type: String, required: true },
    manifesto: [{ type: String }],
    monthlyPrice: { type: Number, required: true },
    memberCount: { type: Number, default: 0 },
    maxMembers: { type: Number, default: 20 },
    weeklySchedule: [{ type: String }],
    nextSession: { type: String },
    status: {
      type: String,
      enum: ['active', 'starting-soon', 'full', 'inactive'],
      default: 'active',
    },
    members: [{ type: String }],
  },
  { timestamps: true }
)

const Squad: Model<ISquad> =
  mongoose.models.Squad || mongoose.model<ISquad>('Squad', SquadSchema)

export default Squad
