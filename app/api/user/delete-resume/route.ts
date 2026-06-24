import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import User from '@/models/User'
import dbConnect from '@/lib/dbConnect'
import { handleApiError } from '@/lib/api-utils'

export async function POST(_req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await dbConnect()

    const result = await User.findByIdAndUpdate(session.user.id, {
      $unset: { resume: 1 },
    })

    if (!result) {
      console.error('User not found during resume deletion:', session.user.id)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('Resume deleted for user:', session.user.id)

    return NextResponse.json({
      success: true,
      message: 'Resume removed from profile',
    })
  } catch (error) {
    return handleApiError(error)
  }
}
