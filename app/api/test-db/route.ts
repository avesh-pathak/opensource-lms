import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { auth } from '@/lib/auth'

/**
 * Dev/admin-only DB connectivity check. Returns minimal safe response.
 * Do not expose user data. In production, consider removing or disabling.
 */
export async function GET() {
  try {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Not available' }, { status: 404 })
    }

    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db('lms_db')
    const count = await db.collection('user_profiles').countDocuments({})
    return NextResponse.json({ ok: true, collectionsChecked: 1, count })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
