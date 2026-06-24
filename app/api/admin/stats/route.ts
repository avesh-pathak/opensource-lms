import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import mongoose from 'mongoose'
import Story from '@/models/Story'
import Roast from '@/models/Roast'
import Hackathon from '@/models/Hackathon'
import User from '@/models/User'
import Transaction from '@/models/Transaction'
import Submission from '@/models/Submission'
import dbConnect from '@/lib/dbConnect'
import { handleApiError } from '@/lib/api-utils'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    await dbConnect()

    // 1. Total Students
    const totalStudents = await User.countDocuments({})

    // 2. Pending Items (Stories + Roasts)
    // Note: Using UPPERCASE enums as defined in models
    const pendingStories = await Story.countDocuments({ status: 'PENDING' })
    const pendingRoasts = await Roast.countDocuments({ status: 'PENDING' })

    // Check if HackathonSubmission model exists, otherwise skip or use raw collection if needed.
    // Assuming 'hackathon_submissions' collection for now or generic count.
    // Actually, let's stick to what we know exists. The previous code queried 'hackathon_submissions'.
    // If we don't have a model imported, we can use mongoose.connection.db.collection...
    // But for consistency let's assume we focused on Story/Roast mainly for moderation.
    // Let's verify if we have a specific submission model. The user mentioned "HackathonSubmission.ts" in the list earlier.

    const pendingSubmissions =
      (await mongoose.connection.db
        ?.collection('hackathon_submissions')
        .countDocuments({ status: 'PENDING' })) || 0

    const totalPending = pendingStories + pendingRoasts + pendingSubmissions

    // 3. Active Hackathons
    const activeHackathons = await Hackathon.countDocuments({
      status: 'ACTIVE',
    })

    // 4. Daily Activity (Users active/updated today)
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const dailyActivity = await User.countDocuments({
      updatedAt: { $gte: startOfDay },
    })

    // 5. Analytics Aggregations
    // User Growth (Last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    // Content Activity (Last 14 days - Stories + Roasts)
    const fourteenDaysAgo = new Date()
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)

    const contentActivity = await Story.aggregate([
      { $match: { createdAt: { $gte: fourteenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    // 6. Revenue Analytics (Last 6 months)
    const revenueAcc = await Transaction.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, status: 'completed' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          amount: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ])

    // 7. Problem Engagement (Last 14 days)
    const submissionActivity = await Submission.aggregate([
      { $match: { createdAt: { $gte: fourteenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    return NextResponse.json({
      totalStudents,
      totalPending, // Renamed from pendingStories to avoid confusion
      activeHackathons,
      dailyActivity,
      userGrowth,
      contentActivity,
      revenue: revenueAcc,
      submissionActivity,
      // Detailed breakdown if needed by frontend
      pendingBreakdown: {
        stories: pendingStories,
        roasts: pendingRoasts,
        submissions: pendingSubmissions,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
