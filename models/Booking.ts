import mongoose, { Schema, Document } from 'mongoose'

export interface IBooking extends Document {
  studentId: mongoose.Types.ObjectId
  studentEmail: string
  studentName: string
  mentorId: mongoose.Types.ObjectId
  mentorName: string
  date: Date
  dateString: string
  timeSlot: string
  sessionType: 'sos' | 'roast' | 'consult' | '1-1'
  price: number
  paymentStatus: 'pending' | 'completed' | 'failed'
  razorpayOrderId?: string
  razorpayPaymentId?: string
  meetingLink?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const BookingSchema = new Schema<IBooking>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    studentEmail: { type: String, required: true },
    studentName: { type: String, required: true },
    mentorId: { type: Schema.Types.ObjectId, ref: 'Mentor', required: true },
    mentorName: { type: String, required: true },
    date: { type: Date, required: true },
    dateString: { type: String, required: true },
    timeSlot: { type: String, required: true },
    sessionType: {
      type: String,
      enum: ['sos', 'roast', 'consult', '1-1'],
      default: '1-1',
    },
    price: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    meetingLink: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
)

// Index for efficient queries
BookingSchema.index({ mentorId: 1, date: 1 })
BookingSchema.index({ studentId: 1 })
BookingSchema.index({ paymentStatus: 1 })

export default mongoose.models.Booking ||
  mongoose.model<IBooking>('Booking', BookingSchema)
