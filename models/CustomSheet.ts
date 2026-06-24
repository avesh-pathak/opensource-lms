import mongoose from 'mongoose'

const CustomSheetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Ensure a user can't have duplicate sheet names
CustomSheetSchema.index({ userId: 1, name: 1 }, { unique: true })

export default mongoose.models.CustomSheet ||
  mongoose.model('CustomSheet', CustomSheetSchema)
