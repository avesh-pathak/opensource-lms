import mongoose, { Schema, Document } from 'mongoose'

export interface IComment extends Document {
  content: string
  postId: mongoose.Types.ObjectId
  authorId: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const CommentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true },
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'CommunityPost',
      required: true,
      index: true,
    },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

export default mongoose.models.Comment ||
  mongoose.model<IComment>('Comment', CommentSchema)
