import { NextResponse } from 'next/server'
import Submission from '@/models/Submission'
import Problem from '@/models/Problem'
import User from '@/models/User'
import { handleApiError } from '@/lib/api-utils'

import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'

export async function GET() {
  try {
    const session = await auth()
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // 1. Get total users for conversion calculation
    const totalUsers = await User.countDocuments()

    // 2. Get unique users who have submitted at least one problem
    const activeUsers = await Submission.distinct('userId')
    const activeUserCount = activeUsers.length

    // 3. Difficulty Funnel - Count unique users with ACCEPTED submissions per difficulty
    const difficultyStats = await Submission.aggregate([
      { $match: { status: 'ACCEPTED' } },
      {
        $lookup: {
          from: 'problems',
          localField: 'problemId',
          foreignField: '_id',
          as: 'problem',
        },
      },
      { $unwind: '$problem' },
      {
        $group: {
          _id: '$problem.difficulty',
          uniqueUsers: { $addToSet: '$userId' },
          totalSubmissions: { $sum: 1 },
        },
      },
      {
        $project: {
          difficulty: '$_id',
          userCount: { $size: '$uniqueUsers' },
          submissions: '$totalSubmissions',
        },
      },
    ])

    // Map to expected order
    const difficultyOrder = ['Easy', 'Medium', 'Hard']
    const difficultyFunnel = difficultyOrder.map((d) => {
      const stat = difficultyStats.find((s: any) => s.difficulty === d)
      return {
        name: d,
        users: stat?.userCount || 0,
        submissions: stat?.submissions || 0,
      }
    })

    // 4. Category breakdown - Problems solved per category
    const categoryStats = await Submission.aggregate([
      { $match: { status: 'ACCEPTED' } },
      {
        $lookup: {
          from: 'problems',
          localField: 'problemId',
          foreignField: '_id',
          as: 'problem',
        },
      },
      { $unwind: '$problem' },
      {
        $group: {
          _id: '$problem.category',
          uniqueUsers: { $addToSet: '$userId' },
          problemsSolved: { $addToSet: '$problemId' },
        },
      },
      {
        $project: {
          category: '$_id',
          userCount: { $size: '$uniqueUsers' },
          problemCount: { $size: '$problemsSolved' },
        },
      },
      { $sort: { userCount: -1 } },
      { $limit: 10 },
    ])

    // 5. Recent activity trend (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const activityTrend = await Submission.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          submissions: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' },
        },
      },
      {
        $project: {
          date: '$_id',
          submissions: 1,
          activeUsers: { $size: '$uniqueUsers' },
        },
      },
      { $sort: { date: 1 } },
    ])

    // 6. Completion Rate Stats
    const totalProblems = await Problem.countDocuments()
    const acceptedSubmissions = await Submission.countDocuments({
      status: 'ACCEPTED',
    })
    const totalSubmissions = await Submission.countDocuments()

    return NextResponse.json({
      overview: {
        totalUsers,
        activeUsers: activeUserCount,
        conversionRate:
          totalUsers > 0
            ? Number(((activeUserCount / totalUsers) * 100).toFixed(1))
            : 0,
        totalProblems,
        acceptedSubmissions,
        totalSubmissions,
        successRate:
          totalSubmissions > 0
            ? Number(
                ((acceptedSubmissions / totalSubmissions) * 100).toFixed(1)
              )
            : 0,
      },
      difficultyFunnel,
      categoryBreakdown: categoryStats,
      activityTrend,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
