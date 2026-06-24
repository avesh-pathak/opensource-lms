import { NextResponse } from 'next/server'
import { getLeaderboard } from '@/lib/services/leaderboardService'
import { errorResponse } from '@/lib/errors'
import { logger } from '@/lib/logger'

let cache: { data: any; timestamp: number } | null = null
const CACHE_TTL = 300 * 1000 // 5 minutes

export async function GET() {
  try {
    // Check in-memory cache
    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
      logger.debug('Leaderboard served from cache')
      return NextResponse.json(
        { leaderboard: cache.data },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          },
        }
      )
    }

    // Fetch from service
    const leaderboard = await getLeaderboard()

    // Update cache
    cache = {
      data: leaderboard,
      timestamp: Date.now(),
    }

    return NextResponse.json(
      { leaderboard },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    )
  } catch (error) {
    logger.error('Leaderboard route error', { error })
    return errorResponse(error)
  }
}
