import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import CommunityPost from '@/models/CommunityPost'
import Community from '@/models/Community'
import { auth } from '@/lib/auth'
import {
  validateObjectId,
  validateRequestBody,
  handleApiError,
  ApiResponse,
  setPublicCache,
} from '@/lib/api-utils'
import { z } from 'zod'

// Zod schema for creating posts
const CreatePostSchema = z.object({
  communitySlug: z.string().optional(),
  communityId: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  type: z.enum(['standard', 'question', 'discussion']).optional(),
})

export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')
    const communityId = searchParams.get('communityId')

    const filter: any = {}

    if (slug) {
      const community = await Community.findOne({ slug })
      if (community) {
        filter.communityId = community._id
      } else {
        return NextResponse.json(
          { error: 'Community not found' },
          { status: 404 }
        )
      }
    } else if (communityId) {
      // Validate ObjectId
      const idError = validateObjectId(communityId, 'Community ID')
      if (idError) return idError

      filter.communityId = communityId
    }

    // Only return PUBLISHED posts
    filter.status = 'PUBLISHED'

    // Fetch posts with author info
    const posts = await CommunityPost.find(filter)
      .sort({ isPinned: -1, createdAt: -1 }) // Show pinned first
      .populate('communityId', 'name icon themeColor')
      .populate('authorId', 'name image username')

    const headers = new Headers()
    setPublicCache(headers)

    return ApiResponse(posts, 200, headers)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // Zod validation
    const validation = await validateRequestBody(req, CreatePostSchema)
    if ('error' in validation) return validation.error
    const body = validation.data

    let communityId = body.communityId

    // If slug is provided instead of communityId, look it up
    if (body.communitySlug && !communityId) {
      const community = await Community.findOne({ slug: body.communitySlug })
      if (!community) {
        return NextResponse.json(
          { error: 'Invalid community slug' },
          { status: 400 }
        )
      }
      communityId = community._id.toString()
    }

    if (!communityId) {
      return NextResponse.json(
        { error: 'Community ID is required' },
        { status: 400 }
      )
    }

    // Validate community ObjectId
    const idError = validateObjectId(communityId, 'Community ID')
    if (idError) return idError

    // SECURITY: Set authorId from session, NOT from request body
    const post = await CommunityPost.create({
      communityId,
      authorId: session.user.id,
      title: body.title,
      content: body.content,
      type: body.type || 'standard',
      likes: [], // Initialize empty likes
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
