import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import Mentor from '@/models/Mentor'
import dbConnect from '@/lib/dbConnect'
import { validateDemoAccess } from '@/lib/guards/demo-guard'
import { handleApiError, validateObjectId, ApiResponse } from '@/lib/api-utils'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const { id } = await params

    const idError = validateObjectId(id, 'Mentor ID')
    if (idError) return idError

    const mentor = await Mentor.findById(id).select('availability')

    if (!mentor) {
      return NextResponse.json({ error: 'Mentor not found' }, { status: 404 })
    }

    return ApiResponse(mentor.availability || [])
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const demoError = validateDemoAccess(session, 'PUT')
    if (demoError) return demoError

    const body = await req.json()
    await dbConnect()

    const { id } = await params

    const idError = validateObjectId(id, 'Mentor ID')
    if (idError) return idError

    const mentor = await Mentor.findByIdAndUpdate(
      id,
      { availability: body },
      { new: true }
    )

    if (!mentor) {
      return NextResponse.json({ error: 'Mentor not found' }, { status: 404 })
    }

    return ApiResponse(mentor.availability)
  } catch (error) {
    return handleApiError(error)
  }
}
