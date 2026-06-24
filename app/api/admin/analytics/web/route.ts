import PageView from '@/models/PageView'
import { requireAdmin } from '@/lib/guards/auth-guard'
import dbConnect from '@/lib/dbConnect'
import { handleApiError, ApiResponse } from '@/lib/api-utils'

export async function GET(request: Request) {
  try {
    const _session = await requireAdmin()

    await dbConnect()

    // Get date range from query params (default: last 30 days)
    const { searchParams } = new URL(request.url)
    const rawDays = searchParams.get('days')
    let days = parseInt(rawDays || '30')

    // Validate days to ensure it's a positive number and within reasonable bounds
    if (isNaN(days) || days <= 0) {
      days = 30
    } else if (days > 365) {
      days = 365
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Execute all queries in parallel for performance
    const [
      totalPageViews,
      uniqueVisitors,
      newSessions,
      sessionCounts,
      dailyTraffic,
      topPages,
      deviceStats,
      browserStats,
      hourlyStats,
      liveVisitors,
    ] = await Promise.all([
      // 1. Total Page Views
      PageView.countDocuments({ timestamp: { $gte: startDate } }),

      // 2. Unique Visitors
      PageView.distinct('sessionId', { timestamp: { $gte: startDate } }),

      // 3. New Sessions
      PageView.countDocuments({
        timestamp: { $gte: startDate },
        isNewSession: true,
      }),

      // 4. Bounce Rate Data
      PageView.aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        { $group: { _id: '$sessionId', pageCount: { $sum: 1 } } },
      ]),

      // 5. Daily Traffic
      PageView.aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            views: { $sum: 1 },
            visitors: { $addToSet: '$sessionId' },
          },
        },
        {
          $project: {
            date: '$_id',
            views: 1,
            visitors: { $size: '$visitors' },
          },
        },
        { $sort: { date: 1 } },
      ]),

      // 6. Top Pages
      PageView.aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        {
          $group: {
            _id: '$path',
            views: { $sum: 1 },
            uniqueVisitors: { $addToSet: '$sessionId' },
          },
        },
        {
          $project: {
            path: '$_id',
            views: 1,
            visitors: { $size: '$uniqueVisitors' },
          },
        },
        { $sort: { views: -1 } },
        { $limit: 10 },
      ]),

      // 7. Device Stats
      PageView.aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        { $group: { _id: '$device', count: { $sum: 1 } } },
      ]),

      // 8. Browser Stats
      PageView.aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        { $group: { _id: '$browser', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),

      // 9. Hourly Stats
      PageView.aggregate([
        {
          $match: {
            timestamp: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
          },
        },
        { $group: { _id: { $hour: '$timestamp' }, views: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),

      // 10. Live Visitors
      PageView.distinct('sessionId', {
        timestamp: { $gte: new Date(Date.now() - 5 * 60 * 1000) },
      }),
    ])

    // Calculate bounce rate
    const bouncedSessions = sessionCounts.filter(
      (s) => s.pageCount === 1
    ).length
    const bounceRate =
      sessionCounts.length > 0
        ? ((bouncedSessions / sessionCounts.length) * 100).toFixed(1)
        : 0

    return ApiResponse({
      overview: {
        totalPageViews,
        uniqueVisitors: uniqueVisitors.length,
        newSessions,
        bounceRate,
        liveNow: liveVisitors.length,
      },
      dailyTraffic,
      topPages,
      deviceStats,
      browserStats,
      hourlyStats,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
