import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IEnrollment extends Document {
  squadId: string
  studentId: string // User ID
  studentName: string
  studentEmail: string
  paymentId: string
  status: 'active' | 'cancelled' | 'refunded'
  enrolledAt: Date
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    squadId: { type: String, required: true, ref: 'Squad' },
    studentId: { type: String, required: true, ref: 'User' },
    studentName: { type: String },
    studentEmail: { type: String },
    paymentId: { type: String, required: true },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'refunded'],
      default: 'active',
    },
    enrolledAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

// Prevent duplicate enrollment active
EnrollmentSchema.index(
  { squadId: 1, studentId: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: 'active' } }
)

const Enrollment: Model<IEnrollment> =
  mongoose.models.Enrollment ||
  mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema)

export default Enrollment
