import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import Roast from '@/models/Roast'
import dbConnect from '@/lib/dbConnect'

export async function GET(_req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // Fetch only the current user's roasts
    const roasts = await Roast.find({ userId: session.user.id }).sort({
      createdAt: -1,
    })

    // Transform _id to id for frontend compatibility
    const formattedRoasts = roasts.map((roast) => ({
      id: roast._id.toString(),
      userId: roast.userId,
      title: roast.title,
      builder: roast.builder,
      avatar: roast.avatar,
      resumeUrl: roast.resumeUrl,
      fileName: roast.fileName,
      burnCount: roast.burnCount,
      roastCount: roast.roastCount,
      status: roast.status,
      comments: roast.comments.map((c: any) => ({
        id: c._id ? c._id.toString() : c.id, // Handle subdocument _id
        userName: c.userName,
        avatar: c.avatar,
        content: c.content,
        burnLevel: c.burnLevel,
        createdAt: c.createdAt,
      })),
      createdAt: roast.createdAt,
    }))

    return NextResponse.json(formattedRoasts)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
