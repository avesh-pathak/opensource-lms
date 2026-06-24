import mongoose, { Schema, Document } from 'mongoose'

export interface ICommunity extends Document {
  name: string
  slug: string
  description: string
  icon: string
  status: 'active' | 'inactive'
  themeColor: string
  createdBy?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const CommunitySchema = new Schema<ICommunity>(
  {
    name: { type: String, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    themeColor: { type: String, default: 'text-blue-500 bg-blue-500/10' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

export default mongoose.models.Community ||
  mongoose.model<ICommunity>('Community', CommunitySchema)
