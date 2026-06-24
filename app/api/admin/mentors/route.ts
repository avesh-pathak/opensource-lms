import { NextRequest } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Mentor from '@/models/Mentor'
import { validateDemoAccess } from '@/lib/guards/demo-guard'
import {
  handleApiError,
  validateRequestBody,
  ApiResponse,
} from '@/lib/api-utils'
import { mentorSchema } from '@/lib/validators'

import { requireAdmin } from '@/lib/guards/auth-guard'

// POST: Create new mentor (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin()

    const demoError = validateDemoAccess(session, 'POST')
    if (demoError) return demoError

    const validation = await validateRequestBody(req, mentorSchema)
    if ('error' in validation) return validation.error
    const body = validation.data

    await dbConnect()

    const mentor = await Mentor.create({
      ...body,
      // Ensure defaults/overrides if needed, though schema handles most
      isActive: true,
      availability: body.availability || [],
    })

    return ApiResponse(mentor, 201)
  } catch (error) {
    return handleApiError(error)
  }
}

// GET: Fetch all mentors for admin (including inactive)
export async function GET() {
  try {
    const _session = await requireAdmin()
    await dbConnect()
    const mentors = await Mentor.find().sort({ createdAt: -1 })
    return ApiResponse(mentors)
  } catch (error) {
    return handleApiError(error)
  }
}
