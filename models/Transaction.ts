import mongoose from 'mongoose'

const TransactionSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Can be ObjectId string or 'dev-user'
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'completed',
  },
  type: {
    type: String,
    enum: ['subscription', 'one_time', 'squad_subscription', 'mentorship'],
    default: 'one_time',
  },
  squadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Squad' }, // For squad subscriptions
  metadata: { type: mongoose.Schema.Types.Mixed }, // Store payment gateway details
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Transaction ||
  mongoose.model('Transaction', TransactionSchema)
