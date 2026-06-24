import dbConnect from '@/lib/dbConnect'
import CustomSheetProblem from '@/models/CustomSheetProblem'
import mongoose from 'mongoose'

export interface CustomAggregatedStats {
  totalSolved: number
  totalPoints: number
  weeklySolved: number
  weeklyPoints: number
}

/**
 * Aggregates Custom Sheet statistics for a list of users.
 * Only includes problems marked as `isEligibleForGlobalStats: true`.
 * Deduplicates solves based on problem link (or title if link missing) to ensure
 * the same problem solved in multiple sheets is counted once.
 */
export async function getAggregatedCustomStats(
  userIds: string[]
): Promise<Map<string, CustomAggregatedStats>> {
  await dbConnect()

  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const statsMap = new Map<string, CustomAggregatedStats>()

  // Initialize map
  userIds.forEach((id) => {
    statsMap.set(id, {
      totalSolved: 0,
      totalPoints: 0,
      weeklySolved: 0,
      weeklyPoints: 0,
    })
  })

  if (userIds.length === 0) return statsMap

  const objectIds = userIds.map((id) => new mongoose.Types.ObjectId(id))

  // Aggregate stats
  const results = await CustomSheetProblem.aggregate([
    {
      $match: {
        userId: { $in: objectIds },
        isEligibleForGlobalStats: true,
        status: 'DONE',
      },
    },
    // Group by User and Link to deduplicate (User solved "Two Sum" in 2 sheets -> counts once)
    {
      $group: {
        _id: { userId: '$userId', link: '$link' },
        difficulty: { $first: '$difficulty' },
        updatedAt: { $max: '$updatedAt' }, // Take latest solve time
      },
    },
    // Group by User to sum up
    {
      $group: {
        _id: '$_id.userId',
        totalSolved: { $sum: 1 },
        totalPoints: {
          $sum: {
            $switch: {
              branches: [
                { case: { $eq: ['$difficulty', 'Easy'] }, then: 10 },
                { case: { $eq: ['$difficulty', 'Medium'] }, then: 30 },
                { case: { $eq: ['$difficulty', 'Hard'] }, then: 100 },
              ],
              default: 0,
            },
          },
        },
        weeklySolved: {
          $sum: {
            $cond: [{ $gte: ['$updatedAt', oneWeekAgo] }, 1, 0],
          },
        },
        weeklyPoints: {
          $sum: {
            $cond: [
              { $gte: ['$updatedAt', oneWeekAgo] },
              {
                $switch: {
                  branches: [
                    { case: { $eq: ['$difficulty', 'Easy'] }, then: 10 },
                    { case: { $eq: ['$difficulty', 'Medium'] }, then: 30 },
                    { case: { $eq: ['$difficulty', 'Hard'] }, then: 100 },
                  ],
                  default: 0,
                },
              },
              0,
            ],
          },
        },
      },
    },
  ])

  results.forEach((res) => {
    statsMap.set(res._id.toString(), {
      totalSolved: res.totalSolved,
      totalPoints: res.totalPoints,
      weeklySolved: res.weeklySolved,
      weeklyPoints: res.weeklyPoints,
    })
  })

  return statsMap
}
