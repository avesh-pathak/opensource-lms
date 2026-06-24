import mongoose from 'mongoose'

const CustomSheetProblemSchema = new mongoose.Schema({
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
  patternId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomSheetPattern',
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium', // Fallback if parsing fails or not provided (though we validate)
  },
  link: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['TODO', 'DONE'],
    default: 'TODO',
  },
  notes: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
  tags: {
    type: [String],
    default: [],
  },
  solution: {
    type: String, // User's custom solution text
    required: false,
  },
  approach: {
    type: String, // User's approach notes
    required: false,
  },
  timeSpent: {
    type: Number,
    default: 0,
  },
  isEligibleForGlobalStats: {
    type: Boolean,
    default: false,
    index: true, // Efficient querying for aggregator
  },
})

// Ensure a user CAN have the same problem link twice if they want, but scoped to the sheet
CustomSheetProblemSchema.index({ sheetId: 1, link: 1 })
// Index for efficient querying of problems by pattern for a sheet
CustomSheetProblemSchema.index({ sheetId: 1, patternId: 1 })
// Index for finding all problems by user across all sheets
// CustomSheetProblemSchema.index({ userId: 1 }) - REMOVED: Redundant (defined in schema)

export default mongoose.models.CustomSheetProblem ||
  mongoose.model('CustomSheetProblem', CustomSheetProblemSchema)
