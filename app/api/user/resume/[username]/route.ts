import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params
  const normalizedUsername = username?.toLowerCase().trim()

  try {
    const client = await clientPromise
    const db = client.db()

    const user = await db
      .collection('users')
      .findOne(
        { username: normalizedUsername },
        { projection: { resume: 1, resumePublicId: 1, isResumePublic: 1 } }
      )

    if (
      !user ||
      !user.isResumePublic ||
      (!user.resume && !user.resumePublicId)
    ) {
      return new NextResponse('Resume not found or private', { status: 404 })
    }

    const publicId =
      user.resumePublicId || user.resume?.split('/').pop()?.split('.')[0]
    if (!publicId) {
      return new NextResponse('Invalid resume metadata', { status: 400 })
    }

    // Fetch the file from Cloudinary on the server side (Authenticated)
    // We use the authenticated URL to ensure we can fetch it even if public delivery is blocked
    const cloudinaryUrl = cloudinary.url(publicId, {
      resource_type: 'raw',
      secure: true,
      sign_url: true,
    })

    const response = await fetch(cloudinaryUrl)
    if (!response.ok) {
      console.error(
        `Cloudinary fetch failed: ${response.status} ${response.statusText}`
      )
      return new NextResponse('Failed to fetch resume from storage', {
        status: 500,
      })
    }

    const blob = await response.blob()
    const headers = new Headers()

    // Match the content type if possible, or default to PDF
    const contentType =
      response.headers.get('content-type') || 'application/pdf'
    headers.set('Content-Type', contentType)

    // Suggest a filename
    const fileName = `${username}_resume.${publicId.split('.').pop() || 'pdf'}`
    headers.set('Content-Disposition', `inline; filename="${fileName}"`)

    return new NextResponse(blob, {
      headers,
      status: 200,
    })
  } catch (error) {
    console.error('Resume proxy error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
