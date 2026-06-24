import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'
import User from '@/models/User'
import Community from '@/models/Community'
import CommunityPost from '@/models/CommunityPost'
import dbConnect from '@/lib/dbConnect'
import { notifyAdmins } from '@/lib/firebase/push'
import { handleApiError } from '@/lib/api-utils'
import { logger } from '@/lib/logger'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // 1. Size Limit Check (5MB)
    const MAX_SIZE = 5 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      )
    }

    // 2. File Type Validation
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    const validExtensions = ['pdf', 'doc', 'docx']

    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    if (
      !validTypes.includes(file.type) ||
      !validExtensions.includes(fileExtension || '')
    ) {
      return NextResponse.json(
        { error: 'Only PDF, DOC, and DOCX files are allowed' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const result = (await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'registry_resumes',
            public_id: `resume_${session.user.id}_${Date.now()}`,
            resource_type: 'raw', // For PDF/DOC files
            overwrite: true,
            access_mode: 'public',
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        .end(buffer)
    })) as any

    // Validate Cloudinary URL
    if (!result.secure_url || !result.secure_url.includes('cloudinary.com')) {
      throw new Error('Invalid upload - not from Cloudinary')
    }

    // Connect to DB
    await dbConnect()

    // Save URL and Public ID to User Profile
    await User.findByIdAndUpdate(session.user.id, {
      resume: result.secure_url,
      resumePublicId: result.public_id,
    })

    // Find "The Roast" community
    const community = await Community.findOne({ slug: 'the-roast' })

    if (!community) {
      throw new Error('The Roast community not found')
    }

    // Create Post in "The Roast" community
    const post = await CommunityPost.create({
      title: `Resume Review Request - ${file.name}`,
      content: `${session.user.name || 'A student'} submitted their resume for review and feedback.`,
      communityId: community._id,
      type: 'resume',
      resumeUrl: result.secure_url,
      resumePublicId: result.public_id,
      fileName: file.name,
      author: session.user.name || 'Anonymous',
      authorId: session.user.id,
      category: 'Resume Review',
    })

    logger.info(`Resume uploaded and post created: ${post._id}`)

    // Notify admins about new resume upload (best-effort)
    notifyAdmins(
      'upload',
      'New Resume Upload',
      `${session.user.name || 'A student'} uploaded a resume (${fileExtension?.toUpperCase()})`,
      `/admin/users/${session.user.id}`,
      {
        studentId: session.user.id,
        studentName: session.user.name || 'Unknown',
        studentEmail: session.user.email || 'unknown@email.com',
      }
    ).catch((err) => logger.error('Admin notify failed:', { error: err }))

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      fileName: file.name,
      postId: post._id,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
