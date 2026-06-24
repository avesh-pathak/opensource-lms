import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Mentor from '@/models/Mentor'
import { auth } from '@/lib/auth'
import { validateDemoAccess } from '@/lib/guards/demo-guard'
import { handleApiError, validateObjectId, ApiResponse } from '@/lib/api-utils'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET: Fetch single mentor by ID (admin view)
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    await dbConnect()
    const { id } = await params

    const idError = validateObjectId(id, 'Mentor ID')
    if (idError) return idError

    const mentor = await Mentor.findById(id)
    if (!mentor) {
      return NextResponse.json({ error: 'Mentor not found' }, { status: 404 })
    }

    return ApiResponse(mentor)
  } catch (error) {
    return handleApiError(error)
  }
}

// PATCH: Update mentor details including availability
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const demoError = validateDemoAccess(session, 'PATCH')
    if (demoError) return demoError

    await dbConnect()
    const { id } = await params
    const body = await req.json()

    const idError = validateObjectId(id, 'Mentor ID')
    if (idError) return idError

    // Remove _id from body if present to prevent overwrite issues
    delete body._id

    const mentor = await Mentor.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    )

    if (!mentor) {
      return NextResponse.json({ error: 'Mentor not found' }, { status: 404 })
    }

    return ApiResponse(mentor)
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE: Soft delete mentor (set isActive: false)
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const demoError = validateDemoAccess(session, 'DELETE')
    if (demoError) return demoError

    await dbConnect()
    const { id } = await params

    const idError = validateObjectId(id, 'Mentor ID')
    if (idError) return idError

    // Soft delete - just set isActive to false
    const mentor = await Mentor.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    )

    if (!mentor) {
      return NextResponse.json({ error: 'Mentor not found' }, { status: 404 })
    }

    return ApiResponse({
      message: 'Mentor deactivated successfully',
      mentor,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
