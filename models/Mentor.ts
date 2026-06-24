import mongoose, { Schema, Document } from 'mongoose'

// TimeSlot interface embedded in Mentor
export interface ITimeSlot {
  id: string
  day: string
  startTime: string
  endTime: string
  isBooked: boolean
}

export interface IMentor extends Document {
  name: string
  title: string
  company: string
  image: string
  bio: string
  expertise: string[]
  hourlyRate: number
  rating: number
  sessionsCompleted: number
  languages: string[]
  education: string
  experience: string[]
  linkedinUrl?: string
  availability: ITimeSlot[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const TimeSlotSchema = new Schema<ITimeSlot>(
  {
    id: { type: String, required: true },
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
  },
  { _id: false }
)

const MentorSchema = new Schema<IMentor>(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    image: { type: String, required: true },
    bio: { type: String, required: true },
    expertise: { type: [String], required: true },
    hourlyRate: { type: Number, required: true },
    rating: { type: Number, default: 5.0 },
    sessionsCompleted: { type: Number, default: 0 },
    languages: { type: [String], required: true },
    education: { type: String, required: true },
    experience: { type: [String], required: true },
    linkedinUrl: { type: String },
    availability: { type: [TimeSlotSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Indexes
MentorSchema.index({ expertise: 1 })
MentorSchema.index({ hourlyRate: 1 })
MentorSchema.index({ isActive: 1 })

export default mongoose.models.Mentor ||
  mongoose.model<IMentor>('Mentor', MentorSchema)
