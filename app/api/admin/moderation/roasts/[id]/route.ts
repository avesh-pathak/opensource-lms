import { NextResponse } from 'next/server'
import Roast from '@/models/Roast'
import dbConnect from '@/lib/dbConnect'
import { auth } from '@/lib/auth'
import { validateDemoAccess } from '@/lib/guards/demo-guard'
import { handleApiError, validateObjectId } from '@/lib/api-utils'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const demoError = validateDemoAccess(session, 'PATCH')
    if (demoError) return demoError

    const idError = validateObjectId(id, 'Roast ID')
    if (idError) return idError

    await dbConnect()
    const { status } = await req.json()

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const roast = await Roast.findByIdAndUpdate(id, { status }, { new: true })

    if (!roast) {
      return NextResponse.json({ error: 'Roast not found' }, { status: 404 })
    }

    return NextResponse.json(roast)
  } catch (error) {
    return handleApiError(error)
  }
}
