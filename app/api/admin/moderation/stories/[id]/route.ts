import { NextResponse } from 'next/server'
import Story from '@/models/Story'
import dbConnect from '@/lib/dbConnect'
import { auth } from '@/lib/auth'
import { validateDemoAccess } from '@/lib/guards/demo-guard'
import { handleApiError, validateObjectId } from '@/lib/api-utils'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const demoError = validateDemoAccess(session, 'PATCH')
    if (demoError) return demoError

    const idError = validateObjectId(id, 'Story ID')
    if (idError) return idError

    await dbConnect()
    const { status } = await req.json()

    if (!['VERIFIED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const story = await Story.findByIdAndUpdate(id, { status }, { new: true })

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }

    return NextResponse.json(story)
  } catch (error) {
    return handleApiError(error)
  }
}
