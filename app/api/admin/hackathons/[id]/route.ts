import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Hackathon from '@/models/Hackathon'
import User from '@/models/User'
import { auth } from '@/lib/auth'
import { validateDemoAccess } from '@/lib/guards/demo-guard'
import { handleApiError, validateObjectId, ApiResponse } from '@/lib/api-utils'

export async function PATCH(
  request: Request,
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

    const idError = validateObjectId(id, 'Hackathon ID')
    if (idError) return idError

    const body = await request.json()
    await dbConnect()

    const { _id: __id, ...updateData } = body

    // Sanitize and convert types
    const sanitizedUpdate: any = { ...updateData }

    if (sanitizedUpdate.startDate) {
      sanitizedUpdate.startDate = new Date(sanitizedUpdate.startDate)
    }
    if (sanitizedUpdate.endDate) {
      sanitizedUpdate.endDate = new Date(sanitizedUpdate.endDate)
    }
    if (sanitizedUpdate.tags && !Array.isArray(sanitizedUpdate.tags)) {
      sanitizedUpdate.tags = []
    }
    if (sanitizedUpdate.rules && !Array.isArray(sanitizedUpdate.rules)) {
      sanitizedUpdate.rules = []
    }
    if (
      sanitizedUpdate.requirements &&
      !Array.isArray(sanitizedUpdate.requirements)
    ) {
      sanitizedUpdate.requirements = []
    }

    // Explicitly allow status updates
    if (
      updateData.status &&
      !['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(updateData.status)
    ) {
      delete sanitizedUpdate.status
    }
    if (
      updateData.eventStatus &&
      !['UPCOMING', 'ACTIVE', 'COMPLETED'].includes(updateData.eventStatus)
    ) {
      delete sanitizedUpdate.eventStatus
    }

    sanitizedUpdate.updatedAt = new Date()

    const result = await Hackathon.updateOne(
      { _id: id },
      { $set: sanitizedUpdate }
    )

    return ApiResponse({
      success: true,
      modifiedCount: result.modifiedCount,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const idError = validateObjectId(id, 'Hackathon ID')
    if (idError) return idError

    await dbConnect()

    const hackathon = await Hackathon.findById(id).lean()

    if (!hackathon) {
      return NextResponse.json(
        { error: 'Hackathon not found' },
        { status: 404 }
      )
    }

    // Fetch waitlist users if any
    let waitlistUsers: any[] = []
    if (hackathon.waitlist && hackathon.waitlist.length > 0) {
      // hackathon.waitlist is array of strings (User IDs) based on model definition
      waitlistUsers = await User.find({ _id: { $in: hackathon.waitlist } })
        .select('name email image')
        .lean()
    }

    return ApiResponse({ ...hackathon, waitlistUsers })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const demoError = validateDemoAccess(session, 'DELETE')
    if (demoError) return demoError

    const idError = validateObjectId(id, 'Hackathon ID')
    if (idError) return idError

    await dbConnect()

    await Hackathon.deleteOne({ _id: id })

    return ApiResponse({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
