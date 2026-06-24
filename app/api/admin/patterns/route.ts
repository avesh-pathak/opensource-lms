import { NextResponse } from 'next/server'
import Pattern from '@/models/Pattern'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import { validateDemoAccess } from '@/lib/guards/demo-guard'
import {
  handleApiError,
  validateRequestBody,
  validateObjectId,
} from '@/lib/api-utils'
import { z } from 'zod'

const PatternSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  subject: z.string().optional(),
  domain: z.string().optional(),
  description: z.string().optional(),
  // Add other fields as necessary from the model
})

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    const [patterns, total] = await Promise.all([
      Pattern.find({}).sort({ domain: 1, subject: 1 }).skip(skip).limit(limit),
      Pattern.countDocuments({}),
    ])
    return NextResponse.json({ patterns, total, page, limit })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const demoError = validateDemoAccess(session, 'POST')
    if (demoError) return demoError

    const validation = await validateRequestBody(request, PatternSchema)
    if ('error' in validation) return validation.error
    const body = validation.data

    await dbConnect()

    // Basic slug generation
    const slug = body.name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')

    const pattern = await Pattern.create({
      ...body,
      slug,
    })

    return NextResponse.json({ success: true, id: pattern._id, pattern })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const demoError = validateDemoAccess(session, 'PUT')
    if (demoError) return demoError

    const body = await request.json()
    const { _id, ...updateData } = body

    const idError = validateObjectId(_id, 'Pattern ID')
    if (idError) return idError

    // Zod validate updateData (partial)
    const validation = PatternSchema.partial().safeParse(updateData)
    if (!validation.success)
      return NextResponse.json(
        { error: 'Validation Failed', details: validation.error.format() },
        { status: 400 }
      )
    const _validUpdateData = validation.data

    await dbConnect()

    // Update slug if name changed
    if (updateData.name) {
      updateData.slug = updateData.name
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
    }

    const pattern = await Pattern.findByIdAndUpdate(_id, updateData, {
      new: true,
    })

    if (!pattern) {
      return NextResponse.json({ error: 'Pattern not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, pattern })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const demoError = validateDemoAccess(session, 'DELETE')
    if (demoError) return demoError

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const idError = validateObjectId(id, 'Pattern ID')
    if (idError) return idError

    await dbConnect()

    const pattern = await Pattern.findByIdAndDelete(id)

    if (!pattern) {
      return NextResponse.json({ error: 'Pattern not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
