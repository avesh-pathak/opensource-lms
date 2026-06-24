import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import HackathonSubmission from '@/models/HackathonSubmission'
import { handleApiError } from '@/lib/api-utils'

import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // Fetch submissions joined with Hackathon details
    const submissions = await HackathonSubmission.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'hackathons',
          localField: 'hackathonId',
          foreignField: '_id',
          as: 'hackathon',
        },
      },
      { $unwind: { path: '$hackathon', preserveNullAndEmptyArrays: true } },
    ])

    return NextResponse.json(submissions)
  } catch (error) {
    return handleApiError(error)
  }
}
