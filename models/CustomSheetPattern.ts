import mongoose from 'mongoose'

const CustomSheetPatternSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  sheetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomSheet',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  // We can add descriptions or other metadata here if needed later
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Compound index to ensure a user can't have duplicate pattern names within the same sheet
CustomSheetPatternSchema.index({ sheetId: 1, name: 1 }, { unique: true })
// Compound index for uniqueness of slugs per sheet
CustomSheetPatternSchema.index({ sheetId: 1, slug: 1 }, { unique: true })
// Index for finding patterns by user (for listing all patterns across sheets if needed, though usually by sheet)
// CustomSheetPatternSchema.index({ userId: 1 }) - REMOVED: Redundant (defined in schema)

export default mongoose.models.CustomSheetPattern ||
  mongoose.model('CustomSheetPattern', CustomSheetPatternSchema)
