import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Comment from '@/models/Comment'
import CommunityPost from '@/models/CommunityPost'
import { auth } from '@/lib/auth'
import {
  validateObjectId,
  validateRequestBody,
  handleApiError,
} from '@/lib/api-utils'
import { z } from 'zod'

// Zod schema for creating comments
const CreateCommentSchema = z.object({
  postId: z.string().min(1, 'Post ID required'),
  content: z.string().min(1, 'Content required').max(1000, 'Content too long'),
})

// GET: Fetch comments for a post
export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(req.url)
    const postId = searchParams.get('postId')

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      )
    }

    // ObjectId validation
    const idError = validateObjectId(postId, 'Post ID')
    if (idError) return idError

    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 })
      .populate('authorId', 'username image')

    return NextResponse.json(comments)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST: Add a new comment
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - please login' },
        { status: 401 }
      )
    }

    await dbConnect()

    // Zod validation
    const validation = await validateRequestBody(req, CreateCommentSchema)
    if ('error' in validation) return validation.error
    const { postId, content } = validation.data

    // ObjectId validation for postId
    const idError = validateObjectId(postId, 'Post ID')
    if (idError) return idError

    // Use authorId from session, don't trust client
    const authorId = session.user.id

    // Verify post exists
    const post = await CommunityPost.findById(postId)
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const comment = await Comment.create({
      postId,
      content,
      authorId,
    })

    // Populate author details before returning
    await comment.populate('authorId', 'username image')

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE: Remove a comment (author only, or admin)
export async function DELETE(req: NextRequest) {
  try {
    // CRITICAL: Add authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const { searchParams } = new URL(req.url)
    const commentId = searchParams.get('id')

    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      )
    }

    // ObjectId validation
    const idError = validateObjectId(commentId, 'Comment ID')
    if (idError) return idError

    const comment = await Comment.findById(commentId)

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    // CRITICAL SECURITY FIX: Authorization check
    // Only the comment author or an admin can delete
    const isAuthor = comment.authorId.toString() === session.user.id
    const isAdmin = session.user.role === 'admin'

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        {
          error: 'Forbidden - You can only delete your own comments',
        },
        { status: 403 }
      )
    }

    await Comment.findByIdAndDelete(commentId)

    return NextResponse.json({ message: 'Comment deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}
