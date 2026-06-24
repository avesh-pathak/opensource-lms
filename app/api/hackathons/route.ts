import dbConnect from '@/lib/dbConnect'
import Hackathon from '@/models/Hackathon'
import { handleApiError, ApiResponse, setPublicCache } from '@/lib/api-utils'

export async function GET() {
  try {
    await dbConnect()

    // Public endpoint: Fetch PUBLISHED hackathons
    const hackathons = await Hackathon.find({ status: 'PUBLISHED' })
      .sort({ createdAt: -1 })
      .lean()

    const headers = new Headers()
    setPublicCache(headers)

    return ApiResponse(hackathons, 200, headers)
  } catch (error) {
    return handleApiError(error)
  }
}
