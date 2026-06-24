import mongoose, { Schema, Document } from 'mongoose'

export interface IMentorAvailability extends Document {
  mentorId?: mongoose.Types.ObjectId // Optional for now as per current logic (admin/global slots)
  date: Date
  dateString: string
  startTime: string
  endTime?: string
  isBooked: boolean
  bookedBy?: mongoose.Types.ObjectId
}

const MentorAvailabilitySchema = new Schema<IMentorAvailability>(
  {
    mentorId: { type: Schema.Types.ObjectId, ref: 'Mentor' }, // Can be null for generic slots
    date: { type: Date, required: true },
    dateString: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String },
    isBooked: { type: Boolean, default: false },
    bookedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { collection: 'mentorship_availability', timestamps: true }
)

// Indexes
MentorAvailabilitySchema.index({ date: 1, startTime: 1 })
MentorAvailabilitySchema.index({ mentorId: 1 })
MentorAvailabilitySchema.index(
  { dateString: 1, startTime: 1 },
  { unique: true }
) // Prevent duplicate slots

export default mongoose.models.MentorAvailability ||
  mongoose.model<IMentorAvailability>(
    'MentorAvailability',
    MentorAvailabilitySchema
  )
