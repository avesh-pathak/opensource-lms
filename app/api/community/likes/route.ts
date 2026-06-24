import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import CommunityPost from '@/models/CommunityPost'
import { auth } from '@/lib/auth'

// POST: Toggle like on a post
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
    const body = await req.json()

    const { postId } = body

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      )
    }

    // Use userId from session, don't trust client
    const userId = session.user.id

    const post = await CommunityPost.findById(postId)

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Check if user already liked the post
    const userIdStr = userId.toString()
    const likeIndex = post.likes.findIndex(
      (id: any) => id.toString() === userIdStr
    )

    if (likeIndex > -1) {
      // Unlike: Remove user from likes array
      post.likes.splice(likeIndex, 1)
    } else {
      // Like: Add user to likes array
      post.likes.push(userId)
    }

    await post.save()

    return NextResponse.json({
      liked: likeIndex === -1,
      likesCount: post.likes.length,
    })
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    )
  }
}
