import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import CommunityPost from '@/models/CommunityPost'
import Community from '@/models/Community'
import { auth } from '@/lib/auth'
import { handleApiError, validateObjectId } from '@/lib/api-utils'

// Admin auth check helper
const isAdmin = async () => {
  const session = await auth()
  return session?.user?.role === 'admin'
}

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // Fetch all posts with populated community and author details
    const posts = await CommunityPost.find({})
      .sort({ createdAt: -1 })
      .populate('communityId', 'name slug icon themeColor')
      .populate('authorId', 'name image email')
      .lean()

    return NextResponse.json(posts)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const body = await request.json()

    // If communitySlug is provided, resolve to communityId
    if (body.communitySlug && !body.communityId) {
      const community = await Community.findOne({ slug: body.communitySlug })
      if (!community) {
        return NextResponse.json(
          { error: 'Invalid community slug' },
          { status: 400 }
        )
      }
      body.communityId = community._id
    }

    // Admin auth check helper call ensured role, but we need session for ID
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized: Session invalid' },
        { status: 401 }
      )
    }

    // Extract allowed fields to prevent mass assignment
    const {
      title,
      content,
      communityId,
      tags,
      type,
      isPinned,
      isLocked,
      status,
    } = body

    // Create post with allowed fields
    const post = await CommunityPost.create({
      title,
      content,
      communityId,
      tags: Array.isArray(tags) ? tags : [],
      authorId: session.user.id, // Enforce author as current admin with guaranteed ID
      isPinned: !!isPinned,
      isLocked: !!isLocked,
      status: status || 'PUBLISHED', // Default to PUBLISHED if not specified
      likes: [], // Initialize as empty array
      type: type || 'standard',
    })

    // Populate for response
    await post.populate('communityId', 'name slug icon themeColor')

    // Notify all students
    try {
      const { notifyAllStudents } = await import('@/lib/notification-service')
      await notifyAllStudents({
        title: 'New Community Post',
        message: body.title || 'Check out the latest discussion',
        link: `/dashboard/community/${post.communityId.slug}`,
        type: 'COMMUNITY_NEW',
      })
    } catch (e) {
      console.error('Failed to notify students about post:', e)
    }

    return NextResponse.json({ success: true, post })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const idError = validateObjectId(id, 'Post ID')
    if (idError) return idError

    const result = await CommunityPost.findByIdAndDelete(id)

    if (!result) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth()
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const finalBody = await request.json()
    const { id, ...updateData } = finalBody

    const idError = validateObjectId(id, 'Post ID')
    if (idError) return idError

    // Sanitize update data
    const _allowedUpdates = [
      'title',
      'content',
      'status',
      'isPinned',
      'isLocked',
      'tags',
      'type',
    ]
    const sanitizedUpdate: any = {}

    // Explicitly check for keys
    if (updateData.title) sanitizedUpdate.title = updateData.title
    if (updateData.content) sanitizedUpdate.content = updateData.content
    if (updateData.status) sanitizedUpdate.status = updateData.status
    if (typeof updateData.isPinned === 'boolean')
      sanitizedUpdate.isPinned = updateData.isPinned
    if (typeof updateData.isLocked === 'boolean')
      sanitizedUpdate.isLocked = updateData.isLocked

    const post = await CommunityPost.findByIdAndUpdate(id, sanitizedUpdate, {
      new: true,
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Populate for response
    await post.populate('communityId', 'name slug icon themeColor')

    return NextResponse.json({ success: true, post })
  } catch (error) {
    return handleApiError(error)
  }
}
