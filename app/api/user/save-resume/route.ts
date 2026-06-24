import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import User from '@/models/User'
import Community from '@/models/Community'
import CommunityPost from '@/models/CommunityPost'
import dbConnect from '@/lib/dbConnect'
import { handleApiError, validateRequestBody } from '@/lib/api-utils'
import { z } from 'zod'

const SaveResumeSchema = z.object({
  resumeUrl: z.string().url(),
  resumePublicId: z.string().min(1),
  fileName: z.string().min(1),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const validation = await validateRequestBody(req, SaveResumeSchema)
    if ('error' in validation) return validation.error
    const { resumeUrl, resumePublicId, fileName } = validation.data

    // Validate URL (Security Check)
    if (!resumeUrl.includes('cloudinary.com')) {
      return NextResponse.json({ error: 'Invalid resume URL' }, { status: 400 })
    }

    await dbConnect()

    // 1. Save to User Profile
    await User.findByIdAndUpdate(session.user.id, {
      resume: resumeUrl,
      resumePublicId: resumePublicId,
    })

    // 2. Find "The Roast" community
    // Use regex for case-insensitive match or exact match
    const community = await Community.findOne({ slug: 'the-roast' })

    if (!community) {
      console.warn(
        'The Roast community not found - Resume saved to profile but not posted'
      )
      return NextResponse.json({
        success: true,
        message: 'Resume saved to profile (Community post skipped)',
      })
    }

    // 3. Create Post
    const post = await CommunityPost.create({
      title: `Resume Review Request - ${fileName}`,
      content: `${session.user.name || 'A student'} submitted their resume for review and feedback.`,
      communityId: community._id,
      type: 'resume',
      resumeUrl: resumeUrl,
      resumePublicId: resumePublicId,
      fileName: fileName,
      author: session.user.name || 'Anonymous',
      authorId: session.user.id,
      category: 'Resume Review',
    })

    return NextResponse.json({
      success: true,
      message: 'Resume saved and post created',
      postId: post._id,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
