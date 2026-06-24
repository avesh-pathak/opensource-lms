import { auth } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server'

import { ObjectId } from 'mongodb'

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(req.url)
  const username = url.searchParams.get('username')?.toLowerCase().trim()

  if (!username) {
    return NextResponse.json({ error: 'Username required' }, { status: 400 })
  }

  // Validate format
  if (!/^[a-z0-9_]{3,20}$/.test(username)) {
    return NextResponse.json({
      available: false,
      error:
        'Username must be 3-20 characters, lowercase letters, numbers, and underscores only',
    })
  }

  try {
    const client = await clientPromise
    const db = client.db()

    const existing = await db.collection('users').findOne({
      username,
      _id: { $ne: new ObjectId(session.user.id) },
    })

    return NextResponse.json({
      available: !existing,
      username,
    })
  } catch (error) {
    console.error('Check username error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
