import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { auth } from '@/lib/auth'
import { ObjectId } from 'mongodb'
import { handleApiError } from '@/lib/api-utils'

// GET Notes
export async function GET(_req: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db()
    const note = await db
      .collection('admin_notes')
      .findOne({ adminId: new ObjectId(session.user.id) })

    return NextResponse.json(note || { content: '' })
  } catch (error) {
    return handleApiError(error)
  }
}

// UPDATE Note
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const client = await clientPromise
    const db = client.db()

    await db.collection('admin_notes').updateOne(
      { adminId: new ObjectId(session.user.id) },
      {
        $set: { content: body.content, updatedAt: new Date() },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
