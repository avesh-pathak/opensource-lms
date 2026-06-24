import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import Problem from '@/models/Problem'
import mongoose from 'mongoose'
import dbConnect from '@/lib/dbConnect'
import { validateDemoAccess } from '@/lib/guards/demo-guard'
import { handleApiError } from '@/lib/api-utils'

import { z } from 'zod'

// Input Validation Schema - CyberShield Security
const problemSchema = z.object({
  title: z.string().min(1, 'Title required'),
  slug: z.string().optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  category: z.string().optional(),
  patternId: z.string().optional(),
  order: z.number().int().nonnegative().optional(),
  videoId: z.string().optional(),
  description: z.string().optional(),
  starterCode: z.record(z.string()).optional(),
  testCases: z
    .array(
      z.object({
        input: z.string(),
        output: z.string(),
        isHidden: z.boolean().optional(),
      })
    )
    .optional(),
  // Additional fields for topic-based tracking
  problem_link: z.string().optional(),
  topic: z.string().optional(),
  status: z.enum(['Pending', 'In Progress', 'Completed']).optional(),
  starred: z.boolean().optional(),
})

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const demoError = validateDemoAccess(session, 'POST')
    if (demoError) return demoError

    await dbConnect()
    const body = await req.json()

    // 🛡️ CyberShield: Validate Input
    const result = problemSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation Failed', details: result.error.errors },
        { status: 400 }
      )
    }

    const validData = result.data

    // Slug generation if not provided
    if (!validData.slug && validData.title) {
      validData.slug = (validData.title as string)
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
    }

    const problem = await Problem.create(validData)

    return NextResponse.json(problem)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function GET(_req: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const { searchParams } = new URL(_req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    const [problems, total] = await Promise.all([
      Problem.find({})
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Problem.countDocuments({}),
    ])

    return NextResponse.json({ problems, total, page, limit })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const demoError = validateDemoAccess(session, 'PUT')
    if (demoError) return demoError

    await dbConnect()
    const body = await req.json()
    const { _id, ...updateData } = body

    if (!_id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
    }

    const { ObjectId } = mongoose.Types
    if (!ObjectId.isValid(_id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    // 🛡️ CyberShield: Partial Validation for Update
    const result = problemSchema.partial().safeParse(updateData)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation Failed', details: result.error.errors },
        { status: 400 }
      )
    }

    // Use MongoDB directly for more flexible updates (handles topic, problem_link, status, etc.)
    const db = mongoose.connection.db
    if (!db) {
      return NextResponse.json(
        { error: 'Database not connected' },
        { status: 500 }
      )
    }

    const problemsCollection = db.collection('problems')

    const updateResult = await problemsCollection.findOneAndUpdate(
      { _id: new ObjectId(_id) },
      { $set: { ...result.data, updatedAt: new Date() } },
      { returnDocument: 'after' }
    )

    if (!updateResult) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 })
    }

    return NextResponse.json(updateResult)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const demoError = validateDemoAccess(session, 'DELETE')
    if (demoError) return demoError

    await dbConnect()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
    }

    const deleted = await Problem.findByIdAndDelete(id)

    if (!deleted) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Problem deleted' })
  } catch (error) {
    return handleApiError(error)
  }
}
