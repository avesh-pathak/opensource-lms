import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IDeviceToken extends Document {
  userId: mongoose.Types.ObjectId
  token: string
  platform: 'web' | 'android' | 'ios'
  userAgent?: string
  lastActive: Date
  createdAt: Date
}

const DeviceTokenSchema = new Schema<IDeviceToken>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  platform: {
    type: String,
    enum: ['web', 'android', 'ios'],
    default: 'web',
  },
  userAgent: {
    type: String,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Compound index for efficient lookups
DeviceTokenSchema.index({ userId: 1, token: 1 })

const DeviceToken: Model<IDeviceToken> =
  mongoose.models.DeviceToken ||
  mongoose.model<IDeviceToken>('DeviceToken', DeviceTokenSchema)

export default DeviceToken
