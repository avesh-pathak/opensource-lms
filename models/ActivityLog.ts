import mongoose from 'mongoose'

const ActivityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // e.g. "SOLVED_PROBLEM", "POSTED_STORY", "UPDATED_PROFILE"
  metadata: { type: mongoose.Schema.Types.Mixed }, // Arbitrary data like problemId, storyId
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.ActivityLog ||
  mongoose.model('ActivityLog', ActivityLogSchema)
