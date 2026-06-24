import mongoose from 'mongoose'

const PageViewSchema = new mongoose.Schema({
  // Page info
  path: { type: String, required: true, index: true },
  referrer: { type: String, default: '' },

  // Visitor identification
  sessionId: { type: String, required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Device/Browser info
  userAgent: { type: String },
  device: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet'],
    default: 'desktop',
  },
  browser: { type: String },
  os: { type: String },

  // Location (optional, can be enriched later)
  country: { type: String },
  city: { type: String },

  // Session tracking
  isNewSession: { type: Boolean, default: false },
  sessionDuration: { type: Number, default: 0 }, // seconds

  // Timestamp
  timestamp: { type: Date, default: Date.now, index: true },
})

// Compound index for efficient queries
PageViewSchema.index({ path: 1, timestamp: -1 })
PageViewSchema.index({ sessionId: 1, timestamp: 1 })

export default mongoose.models.PageView ||
  mongoose.model('PageView', PageViewSchema)
