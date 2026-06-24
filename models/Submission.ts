import mongoose from 'mongoose'

const SubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
  },
  status: {
    type: String,
    enum: ['ACCEPTED', 'REJECTED', 'RUNTIME_ERROR', 'TLE'],
    required: true,
  },
  language: { type: String, required: true },
  code: { type: String },
  runtime: { type: Number }, // ms
  memory: { type: Number }, // MB
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Submission ||
  mongoose.model('Submission', SubmissionSchema)
