import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Project from '@/models/Project'
import User from '@/models/User'
import { auth } from '@/lib/auth'
import {
  handleApiError,
  validateRequestBody,
  ApiResponse,
  setPublicCache,
} from '@/lib/api-utils'
import { projectSchema } from '@/lib/validators'
import { createNotification } from '@/lib/notifications'
import { z } from 'zod'

export async function GET(request: Request) {
  try {
    const session = await auth()
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') // 'official', 'mine', 'all'

    await dbConnect()

    const query: any = {}

    if (filter === 'official') {
      query.isOfficial = true
      query.status = 'Published'
    } else if (filter === 'mine') {
      if (!session?.user?.id) return NextResponse.json([], { status: 401 })
      query.userId = session.user.id
    } else {
      if (session?.user?.id) {
        query.$or = [
          { userId: session.user.id },
          { isOfficial: true, status: 'Published' },
        ]
      } else {
        query.isOfficial = true
        query.status = 'Published'
      }
    }

    const projects = await Project.find(query)
      .sort({ isOfficial: -1, lastActivityDate: -1 })
      .lean()

    const headers = new Headers()
    if (filter === 'official') {
      setPublicCache(headers)
    }

    return ApiResponse(projects, 200, headers)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const validation = await validateRequestBody(request, projectSchema)
    if ('error' in validation) return validation.error

    const body = validation.data
    await dbConnect()

    const project = await Project.create({
      ...body,
      userId: session.user.id,
      isOfficial: false,
      lastActivityDate: new Date(),
      lastActivity: 'Just now',
    })

    // Notify Admins Parallelly
    const admins = await User.find({ role: 'admin' }).select('_id').lean()

    await Promise.all(
      admins.map((admin: { _id: string }) =>
        createNotification(
          admin._id.toString(),
          'SUBMISSION',
          'New Project',
          `New project submitted: ${project.title}`,
          '/admin/hackathons/submissions'
        ).catch((err) =>
          console.error(`Failed to notify admin ${admin._id}:`, err)
        )
      )
    )

    return ApiResponse(project, 201)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const validation = await validateRequestBody(
      request,
      projectSchema.partial().extend({ id: z.string() })
    )
    if ('error' in validation) return validation.error

    const { id, ...updates } = validation.data

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    await dbConnect()

    const project = await Project.findOneAndUpdate(
      { _id: id, userId: session.user.id }, // Ownership check
      {
        $set: {
          ...updates,
          lastActivityDate: new Date(),
          lastActivity: 'Just now',
        },
      },
      { new: true }
    )

    if (!project)
      return NextResponse.json(
        { error: 'Project not found or unauthorized' },
        { status: 404 }
      )

    return ApiResponse({ success: true, project })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    await dbConnect()
    const deleted = await Project.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    }) // Ownership check

    if (!deleted)
      return NextResponse.json(
        { error: 'Project not found or unauthorized' },
        { status: 404 }
      )

    return ApiResponse({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
