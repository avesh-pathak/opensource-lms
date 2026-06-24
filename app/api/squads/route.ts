import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Squad from '@/models/Squad'
import Enrollment from '@/models/Enrollment'
import { auth } from '@/lib/auth'
import { handleApiError } from '@/lib/api-utils'

export async function GET(_req: NextRequest) {
  try {
    await dbConnect()
    const session = await auth()

    const squads = await Squad.find({ status: { $ne: 'inactive' } }).sort({
      createdAt: -1,
    })

    const enrolledSquadIds = new Set()
    if (session?.user?.id) {
      const enrollments = await Enrollment.find({
        studentId: session.user.id,
        status: 'active',
      }).select('squadId')
      enrollments.forEach((e) => enrolledSquadIds.add(e.squadId.toString()))
    }

    const squadsWithStatus = squads.map((squad) => ({
      ...squad.toObject(),
      isJoined: enrolledSquadIds.has(squad._id.toString()),
    }))

    return NextResponse.json(squadsWithStatus)
  } catch (error) {
    return handleApiError(error)
  }
}
