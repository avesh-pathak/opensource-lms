import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import Squad from '@/models/Squad'
import Enrollment from '@/models/Enrollment'
import { handleApiError, validateObjectId, ApiResponse } from '@/lib/api-utils'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const idError = validateObjectId(id, 'Squad ID')
    if (idError) return idError

    await dbConnect()

    const squad = await Squad.findById(id)
    if (!squad) {
      return NextResponse.json({ error: 'Squad not found' }, { status: 404 })
    }

    // Authorization: Admin or the Mentor of the squad
    const _isAuthorized =
      session.user.role === 'admin' ||
      (session.user.role === 'mentor' && squad.mentorId === session.user.id) ||
      // Also allow the mentor if their ID matches what's stored (handling string vs objectId)
      (session.user.role === 'mentor' && squad.mentorId === session.user.email) // Legacy check if needed

    // Actually, just check role and ID match
    const isMentor =
      session.user.role === 'mentor' && squad.mentorId === session.user.id

    if (session.user.role !== 'admin' && !isMentor) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Fetch enrollments
    const enrollments = await Enrollment.find({
      squadId: id,
      status: 'active',
    }).select('studentName studentEmail enrolledAt')

    return ApiResponse(enrollments)
  } catch (error) {
    return handleApiError(error)
  }
}
