import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'
import { handleApiError } from '@/lib/api-utils'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const folder = body.type === 'avatar' ? 'user_profiles' : 'registry_resumes'
    const timestamp = Math.round(new Date().getTime() / 1000)

    // Generate signature for specific folder
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: folder,
        type: 'upload',
        access_mode: 'public',
      },
      process.env.CLOUDINARY_API_SECRET!
    )

    return NextResponse.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder: folder,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
