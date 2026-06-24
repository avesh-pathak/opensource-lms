import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import Squad from '@/models/Squad'
import {
  handleApiError,
  validateObjectId,
  validateAdminRole,
} from '@/lib/api-utils'

// GET single squad - Public or Protected? Assuming Public read for details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const idError = validateObjectId(id, 'Squad ID')
    if (idError) return idError

    await dbConnect()
    const squad = await Squad.findById(id)
    if (!squad) {
      return NextResponse.json({ error: 'Squad not found' }, { status: 404 })
    }
    return NextResponse.json(squad)
  } catch (error) {
    return handleApiError(error)
  }
}

// PATCH update squad - Protected (Admin Only for now, or Mentor ownership)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const idError = validateObjectId(id, 'Squad ID')
    if (idError) return idError

    await dbConnect()

    // Authorization: Admin or Mentor of this squad
    const currentSquad = await Squad.findById(id)
    if (!currentSquad)
      return NextResponse.json({ error: 'Squad not found' }, { status: 404 })

    const isMentor =
      session.user.role === 'mentor' &&
      currentSquad.mentorId === session.user.id
    const isAdmin = session.user.role === 'admin'

    if (!isAdmin && !isMentor) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()

    // Prevent mass assignment by whitelisting fields
    // Exclude protected fields like memberCount, members, mentorId, etc.
    const allowedFields = [
      'name',
      'description',
      'image',
      'visibility',
      'tags',
      'discordLink',
      'maxMembers',
    ]
    const updateData: any = {}

    Object.keys(body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updateData[key] = body[key]
      }
    })

    const squad = await Squad.findByIdAndUpdate(id, updateData, { new: true })

    return NextResponse.json(squad)
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE squad - Protected (Admin Only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const idError = validateObjectId(id, 'Squad ID')
    if (idError) return idError

    // Verification: Check Admin Role
    const roleError = validateAdminRole(session)
    if (roleError) return roleError

    await dbConnect()
    const squad = await Squad.findByIdAndDelete(id)
    if (!squad) {
      return NextResponse.json({ error: 'Squad not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
