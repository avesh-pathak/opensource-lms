import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { auth } from '@/lib/auth'
import { ObjectId } from 'mongodb'
import { handleApiError } from '@/lib/api-utils'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db()
    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const hackathon = await db
      .collection('hackathons')
      .findOne({ _id: new ObjectId(id) })
    if (!hackathon) {
      return NextResponse.json(
        { error: 'Hackathon not found' },
        { status: 404 }
      )
    }

    // Add user ID to waitlist if not already there
    // Assuming we store user ID from session.user.id if available, or just use email for now if ID missing?
    // auth() usually returns user with id. Let's assume session.user.id exists.
    // If not, we might need to fetch the user by email from the users collection first.

    let userId = session.user.id
    if (!userId) {
      const user = await db
        .collection('users')
        .findOne({ email: session.user.email })
      if (user) userId = user._id.toString()
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    const result = await db
      .collection('hackathons')
      .updateOne({ _id: new ObjectId(id) }, { $addToSet: { waitlist: userId } })

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Hackathon not found' },
        { status: 404 }
      )
    }

    if (result.modifiedCount === 0) {
      return NextResponse.json({
        success: true,
        message: 'Already on waitlist',
      })
    }

    return NextResponse.json({ success: true, message: 'Added to waitlist' })
  } catch (error) {
    return handleApiError(error)
  }
}
