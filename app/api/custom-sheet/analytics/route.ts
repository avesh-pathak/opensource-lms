import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import CustomSheetProblem from '@/models/CustomSheetProblem'
import CustomSheetPattern from '@/models/CustomSheetPattern'
import CustomSheet from '@/models/CustomSheet'
import { handleApiError } from '@/lib/api-utils'
import { subDays, format, eachDayOfInterval } from 'date-fns'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    await dbConnect()

    const { searchParams } = new URL(req.url)
    let sheetId = searchParams.get('sheetId')

    // If no sheetId, try to find default, but DO NOT CREATE
    if (!sheetId) {
      const defaultSheet = await CustomSheet.findOne({
        userId,
        isDefault: true,
      })
      if (defaultSheet) {
        sheetId = defaultSheet._id.toString()
      } else {
        // Fallback to first sheet if no default
        const firstSheet = await CustomSheet.findOne({ userId })
        if (firstSheet) sheetId = firstSheet._id.toString()
      }
    }

    // If still no sheetId, return empty or specific error?
    // Current UI handles empty states, so if no sheet, we return empty stats
    if (!sheetId) {
      return NextResponse.json({
        success: true,
        data: {
          stats: {
            total: 0,
            solved: 0,
            percent: 0,
            easy: { done: 0, total: 0 },
            medium: { done: 0, total: 0 },
            hard: { done: 0, total: 0 },
            totalXP: 0,
          },
          trendData: [],
          activityData: [],
          topicChartData: [],
          totalPatterns: 0,
          sheetId: null,
        },
      })
    }

    // 2. Fetch Aggregated Stats scoped to sheet
    // 2. Fetch Aggregated Stats scoped to sheet (Parallel Execution)
    // Promise.all is safe here as these are read-only independent queries
    const [
      totalProblems,
      solvedProblems,
      totalPatterns,
      problemsList,
      patternMastery,
    ] = await Promise.all([
      CustomSheetProblem.countDocuments({ userId, sheetId }),
      CustomSheetProblem.countDocuments({ userId, sheetId, status: 'DONE' }),
      CustomSheetPattern.countDocuments({ userId, sheetId }),
      CustomSheetProblem.find({ userId, sheetId })
        .select('difficulty status updatedAt title')
        .lean(),
      CustomSheetProblem.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            // SECURITY FIX: Scope aggregation to specific sheet
            sheetId: new mongoose.Types.ObjectId(sheetId as string),
          },
        },
        {
          $group: {
            _id: '$patternId',
            total: { $sum: 1 },
            solved: { $sum: { $cond: [{ $eq: ['$status', 'DONE'] }, 1, 0] } },
          },
        },
      ]),
    ])

    const percent =
      totalProblems > 0 ? (solvedProblems / totalProblems) * 100 : 0

    // 3. Breakdown by Difficulty & Trend Data
    const diffStats = {
      Easy: { done: 0, total: 0 },
      Medium: { done: 0, total: 0 },
      Hard: { done: 0, total: 0 },
    }

    let totalXP = 0
    const pointsMap: any = { Easy: 50, Medium: 100, Hard: 200 }
    const xpByDate = new Map<string, number>()
    const activityMap = new Map<string, number>()

    problemsList.forEach((p: any) => {
      // Normalize difficulty string
      let diff = 'Medium'
      const d = (p.difficulty || 'Medium').toLowerCase()
      if (d.includes('easy')) diff = 'Easy'
      else if (d.includes('hard')) diff = 'Hard'

      const key = diff as 'Easy' | 'Medium' | 'Hard'
      if (diffStats[key]) {
        diffStats[key].total++
        if (p.status === 'DONE') {
          diffStats[key].done++
          totalXP += pointsMap[key] || 0

          // Trend Data
          const dateStr = format(p.updatedAt, 'MMM d')
          xpByDate.set(
            dateStr,
            (xpByDate.get(dateStr) || 0) + (pointsMap[key] || 0)
          )

          const isoDate = format(p.updatedAt, 'yyyy-MM-dd')
          activityMap.set(isoDate, (activityMap.get(isoDate) || 0) + 1)
        }
      }
    })

    // 4. Generate 30-day Trend
    const last30Days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date(),
    })

    const trendData = last30Days.map((date) => ({
      date: format(date, 'MMM d'),
      xp: xpByDate.get(format(date, 'MMM d')) || 0,
    }))

    const activityData = last30Days.map((date) => ({
      date: format(date, 'PPP'),
      count: activityMap.get(format(date, 'yyyy-MM-dd')) || 0,
    }))

    // Enrich with Pattern Names
    const patterns = await CustomSheetPattern.find({
      userId,
      _id: { $in: patternMastery.map((p) => p._id) },
    })
    const patternNameMap = new Map(
      patterns.map((p) => [p._id.toString(), p.name])
    )

    const topicChartData = patternMastery
      .map((p) => ({
        name: patternNameMap.get(p._id.toString()) || 'Unknown',
        total: p.total,
        solved: p.solved,
        percent: p.total > 0 ? Math.round((p.solved / p.total) * 100) : 0,
      }))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 10)

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          total: totalProblems,
          solved: solvedProblems,
          percent,
          easy: diffStats.Easy,
          medium: diffStats.Medium,
          hard: diffStats.Hard,
          totalXP,
        },
        trendData,
        activityData,
        topicChartData,
        totalPatterns,
        sheetId, // Return resolved sheetId for UI sync
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
