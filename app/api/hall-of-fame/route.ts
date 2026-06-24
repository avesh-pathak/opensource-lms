import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import HackathonSubmission from '@/models/HackathonSubmission'
import { handleApiError } from '@/lib/api-utils'

export async function GET() {
  try {
    await dbConnect()

    const winners = await HackathonSubmission.find({ status: 'Winner' })
      .sort({ score: -1, createdAt: -1 })
      .populate('hackathonId', 'title') // Populate hackathon title
      .limit(10)
      .lean()

    const formattedWinners = winners.map((winner: any) => ({
      id: winner._id.toString(),
      title: winner.title || 'Untitled Project',
      hackathonTitle: winner.hackathonId?.title || 'Unknown Hackathon',
      builder: winner.userName,
      description: winner.description,
      techStack: winner.techStack || [],
      githubUrl: winner.repoUrl,
      demoUrl: winner.deployedUrl,
      mentorJustification: winner.feedback || 'No feedback yet.',
    }))

    return NextResponse.json(formattedWinners)
  } catch (error) {
    return handleApiError(error)
  }
}
