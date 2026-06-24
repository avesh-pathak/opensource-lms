import { NextResponse } from 'next/server'
import Booking from '@/models/Booking'
import Story from '@/models/Story'
import Transaction from '@/models/Transaction'
import Squad from '@/models/Squad'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import { handleApiError } from '@/lib/api-utils'

// Admin auth check helper
const isAdmin = async () => {
  const session = await auth()
  return session?.user?.role === 'admin'
}

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    await dbConnect()

    // 1. Fetch Completed Bookings (Mentorship Earnings - positive)
    const completedBookings = await Booking.find({
      paymentStatus: 'completed',
    }).lean()

    // 2. Fetch Cancelled Bookings (Refunds - negative)
    const cancelledBookings = await Booking.find({
      paymentStatus: 'cancelled',
    }).lean()

    // 3. Fetch Verified Stories (Activity source)
    const stories = await Story.find({ status: { $ne: 'PENDING' } }).lean()

    // 4. Fetch Squad Subscription Transactions
    const squadTransactions = await Transaction.find({
      status: 'completed',
      type: { $in: ['squad_subscription', 'one_time'] },
    }).lean()

    // 5. Calculate totals
    const mentorshipEarnings = completedBookings.reduce(
      (sum: number, b: any) => sum + (b.price || 0),
      0
    )
    const squadEarnings = squadTransactions.reduce(
      (sum: number, t: any) => sum + (t.amount || 0),
      0
    )
    const totalRefunds = cancelledBookings.reduce(
      (sum: number, b: any) => sum + (b.price || 0),
      0
    )
    const grossEarnings = mentorshipEarnings + squadEarnings
    const netEarnings = grossEarnings - totalRefunds

    // 6. Generate Logs for completed bookings (+money)
    const completedLogs = completedBookings.map((b: any) => ({
      id: b._id.toString(),
      action: 'Mentorship Booked',
      details: `${b.sessionType} session with ${b.mentorName || 'Mentor'} on ${b.dateString} at ${b.timeSlot}`,
      points: b.price || 0,
      type: 'credit',
      source: 'mentorship',
      date: b.createdAt || b.date,
    }))

    // 7. Generate Logs for cancelled bookings (-money)
    const cancelledLogs = cancelledBookings.map((b: any) => ({
      id: b._id.toString(),
      action: 'Session Cancelled',
      details: `Refund for ${b.sessionType} session with ${b.mentorName || 'Mentor'} - ${b.dateString}`,
      points: -(b.price || 0),
      type: 'debit',
      source: 'mentorship',
      date: b.updatedAt || b.date,
    }))

    // 8. Generate Logs for squad subscriptions (Optimized)
    // Extract unique squad IDs from transactions
    const uniqueSquadIds = [
      ...new Set(squadTransactions.map((t: any) => t.squadId).filter(Boolean)),
    ]

    // Fetch valid squads in one go
    const squadsMap = new Map<string, string>()
    if (uniqueSquadIds.length > 0) {
      const foundSquads = await Squad.find({ _id: { $in: uniqueSquadIds } })
        .select('name')
        .lean()
      foundSquads.forEach((s: any) => {
        squadsMap.set(s._id.toString(), s.name)
      })
    }

    const squadLogs = squadTransactions.map((t: any) => {
      const squadName = t.squadId
        ? squadsMap.get(t.squadId.toString()) || 'Squad'
        : 'Squad'
      return {
        id: t._id.toString(),
        action: 'Squad Subscription',
        details: `${squadName} membership - ${t.currency} ${t.amount}`,
        points: t.amount || 0,
        type: 'credit',
        source: 'squad',
        date: t.createdAt,
      }
    })

    const storyLogs = stories.map((s: any) => ({
      id: s._id.toString(),
      action: `Story Review: ${s.status}`,
      details: `Reviewed story for user ${s.userId}`,
      points: 10,
      type: 'credit',
      source: 'story',
      date: s.updatedAt || s.createdAt,
    }))

    const allLogs = [
      ...completedLogs,
      ...cancelledLogs,
      ...squadLogs,
      ...storyLogs,
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // 9. Monthly Aggregation for Charts (combining mentorship + squads)
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

    const monthlyMentorship = await Booking.aggregate([
      { $match: { paymentStatus: 'completed', date: { $gte: oneYearAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
          earnings: { $sum: '$price' },
          sessions: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    const monthlySquads = await Transaction.aggregate([
      {
        $match: {
          status: 'completed',
          type: { $in: ['squad_subscription', 'one_time'] },
          createdAt: { $gte: oneYearAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          earnings: { $sum: '$amount' },
          subscriptions: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    // Merge monthly stats
    const monthlyMap = new Map()
    monthlyMentorship.forEach((m: any) => {
      monthlyMap.set(m._id, { ...m, squadEarnings: 0, subscriptions: 0 })
    })
    monthlySquads.forEach((s: any) => {
      if (monthlyMap.has(s._id)) {
        const existing = monthlyMap.get(s._id)
        existing.earnings += s.earnings
        existing.squadEarnings = s.earnings
        existing.subscriptions = s.subscriptions
      } else {
        monthlyMap.set(s._id, {
          _id: s._id,
          earnings: s.earnings,
          sessions: 0,
          squadEarnings: s.earnings,
          subscriptions: s.subscriptions,
        })
      }
    })
    const monthlyStats = Array.from(monthlyMap.values()).sort((a, b) =>
      a._id.localeCompare(b._id)
    )

    return NextResponse.json({
      totalEarnings: netEarnings,
      grossEarnings,
      mentorshipEarnings,
      squadEarnings,
      totalRefunds,
      totalMeetings: completedBookings.length,
      totalSquadSubscriptions: squadTransactions.length,
      totalCancellations: cancelledBookings.length,
      logs: allLogs,
      monthlyStats,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
