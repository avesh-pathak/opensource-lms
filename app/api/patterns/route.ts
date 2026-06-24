import { NextResponse } from 'next/server'
import Pattern from '@/models/Pattern' // Ensure this model exists
import Problem from '@/models/Problem'
import dbConnect from '@/lib/dbConnect'
import { handleApiError } from '@/lib/api-utils'

export async function GET() {
  try {
    await dbConnect()

    // Fetch all patterns
    const patterns = await Pattern.find({})
      .sort({ domain: 1, subject: 1 })
      .lean()

    // Enrich with problem counts
    // Optimization: Use aggregation if performance issue (lookup)
    // For now, parallel Promise.all map is fine for <100 patterns
    const patternsWithCounts = await Promise.all(
      patterns.map(async (p: any) => {
        const total = await Problem.countDocuments({ patternId: p._id })
        const solved = 0 // TODO: Get user's solved count from User model context if needed
        return {
          ...p,
          total,
          solved,
        }
      })
    )

    return NextResponse.json(patternsWithCounts, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
