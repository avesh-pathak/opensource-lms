import clientPromise from '@/lib/mongodb'
import { requireAdmin } from '@/lib/guards/auth-guard'
import { handleApiError, ApiResponse } from '@/lib/api-utils'

export async function GET(request: Request) {
  try {
    const _session = await requireAdmin()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit
    const query = searchParams.get('q')?.trim() || ''

    const client = await clientPromise
    const db = client.db()
    const collection = db.collection('users')

    // Build filter with optional search
    const filter: any = {}
    if (query) {
      // Limit query length to prevent excessive processing
      const safeQuery = query.slice(0, 100)

      // ReDoS mitigation: Escape regex sequences
      const escapedQuery = safeQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

      filter.$or = [
        { name: { $regex: escapedQuery, $options: 'i' } },
        { email: { $regex: escapedQuery, $options: 'i' } },
        { username: { $regex: escapedQuery, $options: 'i' } },
      ]
    }

    // Fetch paginated users with optional search filter
    const totalUsers = await collection.countDocuments(filter)
    const users = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      // Project only safe fields
      .project({
        _id: 1,
        name: 1,
        email: 1,
        username: 1,
        image: 1,
        role: 1,
        status: 1,
        createdAt: 1,
        lastLoginRef: 1,
        isBanned: 1,
        bannedAt: 1,
      })
      .toArray()

    return ApiResponse({
      users,
      pagination: {
        total: totalUsers,
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit),
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
