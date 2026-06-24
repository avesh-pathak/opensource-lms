import mongoose from 'mongoose'

const ProblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  difficulty: {
    type: String, // 'Easy', 'Medium', 'Hard'
    required: true,
  },
  category: {
    type: String,
    required: false,
  },
  topic: {
    type: String,
    required: false,
  },
  problem_link: {
    type: String,
    required: false,
  },
  patternId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pattern',
    required: false, // Optional for now to support legacy data
  },
  order: {
    type: Number,
    required: true,
  },
  videoId: {
    type: String, // YouTube ID for solution
    required: false,
  },
  // Content
  description: {
    type: String, // Markdown content
    required: true,
  },
  examples: [
    {
      id: String,
      inputText: String,
      outputText: String,
      explanation: String,
      image: String, // Optional image URL
    },
  ],
  constraints: [
    {
      type: String,
    },
  ],
  starterCode: {
    javascript: { type: String, default: '' },
    python: { type: String, default: '' },
    cpp: { type: String, default: '' }, // C++
    java: { type: String, default: '' },
  },
  // Metadata
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  // Hidden fields for testing
  testCases: [
    {
      input: String,
      output: String,
      isHidden: { type: Boolean, default: false },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Indexes for common queries
ProblemSchema.index({ order: 1 })
ProblemSchema.index({ difficulty: 1 })
ProblemSchema.index({ category: 1 })
ProblemSchema.index({ topic: 1 })
ProblemSchema.index({ patternId: 1 })

export default mongoose.models.Problem ||
  mongoose.model('Problem', ProblemSchema)
