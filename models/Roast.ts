import mongoose, { Schema } from 'mongoose'

export interface RoastComment {
  id: string
  userName: string
  avatar: string
  content: string
  burnLevel: 'Mild' | 'Hot' | 'Supernova'
  createdAt: Date
}

export interface RoastSubmission {
  userId: mongoose.Types.ObjectId
  title: string
  builder: string
  avatar: string
  resumeUrl: string
  burnCount: number
  roastCount: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  fileName?: string
  comments: RoastComment[]
  createdAt: Date
  updatedAt: Date
}

const RoastSchema = new Schema<RoastSubmission>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: true },
    builder: { type: String, required: true },
    avatar: { type: String, required: true },
    resumeUrl: { type: String, required: true },
    burnCount: { type: Number, default: 0 },
    roastCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    fileName: { type: String },
    comments: [
      {
        id: String,
        userName: String,
        avatar: String,
        content: String,
        burnLevel: { type: String, enum: ['Mild', 'Hot', 'Supernova'] },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.models.Roast ||
  mongoose.model<RoastSubmission>('Roast', RoastSchema)
