import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { auth } from '@/lib/auth'
import { ObjectId } from 'mongodb'
import { validateDemoAccess } from '@/lib/guards/demo-guard'
import { handleApiError, validateObjectId } from '@/lib/api-utils'

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const demoError = validateDemoAccess(session, 'DELETE')
    if (demoError) return demoError

    const { id } = await params

    const idError = validateObjectId(id, 'Announcement ID')
    if (idError) return idError

    const client = await clientPromise
    const db = client.db()

    const result = await db.collection('announcements').deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
