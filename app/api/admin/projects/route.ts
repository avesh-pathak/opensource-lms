import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Project from '@/models/Project'
import { auth } from '@/lib/auth'
import {
  handleApiError,
  validateRequestBody,
  validateObjectId,
} from '@/lib/api-utils'
import { z } from 'zod'

const adminProjectSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  requirements: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  status: z
    .enum(['In Progress', 'Completed', 'Research', 'Published'])
    .optional(),
})

async function isAdmin() {
  const session = await auth()
  return session?.user?.role === 'admin'
}

export async function GET(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const query: any = { isOfficial: true }
    if (status) query.status = status
    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      query.$or = [
        { title: { $regex: escapedSearch, $options: 'i' } },
        { description: { $regex: escapedSearch, $options: 'i' } },
      ]
    }

    const projects = await Project.find(query).sort({ createdAt: -1 }).lean()

    return NextResponse.json(projects)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const validation = await validateRequestBody(request, adminProjectSchema)
    if ('error' in validation) return validation.error

    await dbConnect()
    const session = await auth()

    const body = validation.data
    const project = await Project.create({
      ...body,
      isOfficial: true,
      userId: session?.user?.id, // Optional, but good to know who created it
      status: body.status || 'Published',
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const finalBody = await request.json()
    const { id, ...updateData } = finalBody

    const idError = validateObjectId(id, 'Project ID')
    if (idError) return idError

    const project = await Project.findOneAndUpdate(
      { _id: id, isOfficial: true },
      updateData,
      { new: true }
    )

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, project })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const idError = validateObjectId(id, 'Project ID')
    if (idError) return idError

    await dbConnect()
    const deleted = await Project.findByIdAndDelete(id)

    if (!deleted) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
