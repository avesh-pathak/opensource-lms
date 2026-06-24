import dbConnect from '@/lib/dbConnect'
import Hackathon from '@/models/Hackathon'
import { requireAdmin } from '@/lib/guards/auth-guard'
import { validateDemoAccess } from '@/lib/guards/demo-guard'
import {
  handleApiError,
  validateRequestBody,
  ApiResponse,
} from '@/lib/api-utils'
import { hackathonSchema } from '@/lib/validators'

export async function GET() {
  try {
    const _session = await requireAdmin()

    await dbConnect()
    const hackathons = await Hackathon.find({}).sort({ createdAt: -1 }).lean()
    return ApiResponse(hackathons)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin()

    const demoError = validateDemoAccess(session, 'POST')
    if (demoError) return demoError

    const result = await validateRequestBody(request, hackathonSchema)
    if ('error' in result) return result.error
    const body = result.data

    await dbConnect()

    const hackathon = await Hackathon.create({
      ...body,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      createdBy: session.user.id,
    })

    return ApiResponse({ success: true, id: hackathon._id }, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
