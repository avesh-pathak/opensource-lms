import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Squad from '@/models/Squad'
import { auth } from '@/lib/auth'
import { validateDemoAccess } from '@/lib/guards/demo-guard'
import { handleApiError, validateObjectId, ApiResponse } from '@/lib/api-utils'

interface Props {
  params: Promise<{ id: string }>
}

export async function PATCH(req: NextRequest, props: Props) {
  try {
    const params = await props.params
    const session = await auth()
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const demoError = validateDemoAccess(session, 'PATCH')
    if (demoError) return demoError

    const idError = validateObjectId(params.id, 'Squad ID')
    if (idError) return idError

    await dbConnect()
    const body = await req.json()

    // Allowed fields for update
    const allowedFields = [
      'name',
      'description',
      'banner',
      'price',
      'currency',
      'capacity',
      'status',
      'tags',
      'isPublic',
    ]
    const update: any = {}

    Object.keys(body).forEach((key) => {
      if (allowedFields.includes(key)) {
        update[key] = body[key]
      }
    })

    const squad = await Squad.findByIdAndUpdate(
      params.id,
      { $set: update },
      { new: true }
    )

    if (!squad) {
      return NextResponse.json({ error: 'Squad not found' }, { status: 404 })
    }

    // Notify students about update (if important fields like seats/price changed? For now, just notify generic update)
    // User requested: "Squad Updated: {name}"
    try {
      const { notifyAllStudents } = await import('@/lib/notification-service')
      await notifyAllStudents({
        title: `Squad Updated: ${squad.name}`,
        message: 'Check out the latest updates.',
        link: `/dashboard/groups/${squad._id}`,
        type: 'SQUAD_NEW', // Reusing type or should I add SQUAD_UPDATE? User didn't specify enum, just title.
      })
    } catch (e) {
      console.error('Failed to notify students about squad update:', e)
    }

    return ApiResponse(squad)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(req: NextRequest, props: Props) {
  try {
    const params = await props.params
    const session = await auth()
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const demoError = validateDemoAccess(session, 'DELETE')
    if (demoError) return demoError

    const idError = validateObjectId(params.id, 'Squad ID')
    if (idError) return idError

    await dbConnect()

    // Soft delete implementation (set status to inactive) is preferred,
    // but user asked for "Enable Delete Squad (soft delete preferred)"

    const squad = await Squad.findByIdAndUpdate(
      params.id,
      { status: 'inactive' },
      { new: true }
    )

    if (!squad) {
      return NextResponse.json({ error: 'Squad not found' }, { status: 404 })
    }

    return ApiResponse({ message: 'Squad deactivated' })
  } catch (error) {
    return handleApiError(error)
  }
}
