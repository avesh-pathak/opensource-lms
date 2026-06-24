import { NextResponse } from 'next/server'
import Story from '@/models/Story'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import { handleApiError } from '@/lib/api-utils'

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
    const stories = await Story.find({ status: 'PENDING' })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(stories)
  } catch (error) {
    return handleApiError(error)
  }
}
