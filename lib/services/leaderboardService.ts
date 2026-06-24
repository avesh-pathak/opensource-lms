import clientPromise from '@/lib/mongodb'
import { getProblems } from '@/lib/problems'
import { logger } from '@/lib/logger'
import { getAggregatedCustomStats } from '@/lib/services/customAnalyticsAggregator'

export interface LeaderboardEntry {
  rank: number
  name: string
  username?: string
  avatar: string
  college: string
  points: number
  problemsSolved: number
  weeklyPoints: number
  weeklySolved: number
  streak: number
  tier: string
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const client = await clientPromise
    const db = client.db()
    const users = db.collection('users')

    // Fetch users sorted by points, limit to top 100
    const topUsers = await users
      .find(
        { points: { $exists: true } },
        {
          projection: {
            name: 1,
            username: 1,
            image: 1,
            college: 1,
            points: 1,
            problemsSolved: 1,
            gender: 1,
            currentStreak: 1,
          },
        }
      )
      .sort({ points: -1 })
      .limit(100)
      .toArray()

    // Fetch problems to map difficulty
    const allProblems = await getProblems()
    const difficultyMap = new Map<string, number>()
    allProblems.forEach((p) => {
      const points =
        p.difficulty === 'Hard' ? 100 : p.difficulty === 'Medium' ? 30 : 10
      if (p.id) difficultyMap.set(p.id, points)
      if (p._id) difficultyMap.set(p._id, points)
    })

    // Fetch user profiles for progress history
    const userIds = topUsers.map((u) => u._id.toString())
    const userProfiles = await db
      .collection('user_profiles')
      .find({
        userId: { $in: userIds },
      })
      .toArray()

    // [New] Fetch Aggregated Custom Stats
    const customStatsMap = await getAggregatedCustomStats(userIds)

    const profileMap = new Map()
    userProfiles.forEach((p) => profileMap.set(p.userId, p))

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    // Map database result to leaderboard format
    const leaderboard = topUsers.map((user, index) => {
      const profile = profileMap.get(user._id.toString())
      const customStats = customStatsMap.get(user._id.toString())

      let weeklyPoints = 0
      let weeklySolved = 0

      // Core Logic
      if (profile && profile.progress) {
        Object.values(profile.progress as Record<string, any>).forEach(
          (prob: any) => {
            if (prob.status === 'Completed' && prob.completedAt) {
              const date = new Date(prob.completedAt)
              if (date >= oneWeekAgo) {
                weeklySolved++
                const points = difficultyMap.get(prob._id) || 10
                weeklyPoints += points
              }
            }
          }
        )
      }

      // [Merge] Custom Sheet Stats
      let totalPoints = user.points || 0
      let totalSolved = user.problemsSolved || 0

      if (customStats) {
        totalPoints += customStats.totalPoints
        totalSolved += customStats.totalSolved
        weeklyPoints += customStats.weeklyPoints
        weeklySolved += customStats.weeklySolved
      }

      return {
        rank: index + 1,
        name: user.name || 'Anonymous',
        username: user.username,
        avatar: user.image || getRandomAvatar(user.gender),
        college: user.college || 'Unknown',
        points: totalPoints,
        problemsSolved: totalSolved,
        weeklyPoints,
        weeklySolved,
        streak: user.currentStreak || 0,
        tier: calculateTier(totalPoints),
      }
    })

    // Re-sort because custom points might change the order
    leaderboard.sort((a, b) => b.points - a.points)

    // Re-assign ranks
    leaderboard.forEach((entry, idx) => (entry.rank = idx + 1))

    logger.info('Leaderboard fetched', { count: leaderboard.length })
    return leaderboard
  } catch (error) {
    logger.error('Leaderboard fetch error', { error })
    throw error
  }
}

function calculateTier(points: number): string {
  if (points >= 2000) return 'Diamond'
  if (points >= 1000) return 'Platinum'
  if (points >= 500) return 'Gold'
  if (points >= 200) return 'Silver'
  return 'Bronze'
}

function getRandomAvatar(gender?: string): string {
  const maleAvatars = [
    '/assets/mentors/image.png',
    '/assets/mentors/image1.png',
  ]
  const femaleAvatars = [
    '/assets/mentors/image2.png',
    '/assets/mentors/image.png',
  ]
  const allAvatars = [
    '/assets/mentors/image.png',
    '/assets/mentors/image1.png',
    '/assets/mentors/image2.png',
  ]

  const g = gender?.toLowerCase()
  if (g === 'male' || g === 'm') {
    return maleAvatars[Math.floor(Math.random() * maleAvatars.length)]
  } else if (g === 'female' || g === 'f') {
    return femaleAvatars[Math.floor(Math.random() * femaleAvatars.length)]
  } else {
    return allAvatars[Math.floor(Math.random() * allAvatars.length)]
  }
}
