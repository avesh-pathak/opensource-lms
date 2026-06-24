import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Squad from '@/models/Squad'
import { validateDemoAccess } from '@/lib/guards/demo-guard'
import {
  handleApiError,
  validateRequestBody,
  ApiResponse,
} from '@/lib/api-utils'
import { squadSchema } from '@/lib/validators'

import { requireAdmin } from '@/lib/guards/auth-guard'

// GET: Fetch all squads (admin only)
export async function GET(_req: NextRequest) {
  try {
    const _session = await requireAdmin()

    await dbConnect()
    const squads = await Squad.find({}).sort({ createdAt: -1 })
    return ApiResponse(squads)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST: Create a new squad
export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin()

    const demoError = validateDemoAccess(session, 'POST')
    if (demoError) return demoError

    const validation = await validateRequestBody(req, squadSchema)
    if ('error' in validation) return validation.error
    const body = validation.data

    await dbConnect()

    const existingSquad = await Squad.findOne({ slug: body.slug })
    if (existingSquad) {
      return NextResponse.json(
        { error: 'Squad with this slug already exists' },
        { status: 400 }
      )
    }

    const squad = await Squad.create({
      ...body,
      memberCount: 0,
      members: [],
    })

    // Notify all students
    try {
      const { notifyAllStudents } = await import('@/lib/notification-service')
      await notifyAllStudents({
        title: `New Squad: ${body.name}`,
        message: 'Seats limited. Join now.',
        link: `/dashboard/groups/${squad._id}`,
        type: 'SQUAD_NEW',
      })
    } catch (e) {
      console.error('Failed to notify students about squad:', e)
    }

    return ApiResponse(squad, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
