import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { auth } from '@/lib/auth'
import { z } from 'zod'
import dbConnect from '@/lib/dbConnect'
import { validateDemoAccess } from '@/lib/guards/demo-guard'
import { handleApiError } from '@/lib/api-utils'

// Validation schemas
const renameTopicSchema = z.object({
  oldName: z.string().min(1, 'Old topic name is required'),
  newName: z.string().min(1, 'New topic name is required'),
})

const _deleteTopicSchema = z.object({
  topicName: z.string().min(1, 'Topic name is required'),
  reassignTo: z.string().optional(), // Optional: reassign problems to another topic
})

/**
 * PUT /api/admin/topics
 * Rename a topic (batch update all problems with that topic)
 */
export async function PUT(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const demoError = validateDemoAccess(session, 'PUT')
    if (demoError) return demoError

    const body = await request.json()
    const result = renameTopicSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation Failed', details: result.error.errors },
        { status: 400 }
      )
    }

    const { oldName, newName } = result.data

    await dbConnect()
    const db = mongoose.connection.db
    if (!db) {
      return NextResponse.json(
        { error: 'Database not connected' },
        { status: 500 }
      )
    }

    const problemsCollection = db.collection('problems')

    function escapeRegExp(string: string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }

    const escapedOldName = escapeRegExp(oldName.trim())

    // Batch update all problems with the old topic name
    const updateResult = await problemsCollection.updateMany(
      { topic: { $regex: new RegExp(`^${escapedOldName}$`, 'i') } }, // Case-insensitive match
      { $set: { topic: newName.trim(), updatedAt: new Date() } }
    )

    return NextResponse.json({
      success: true,
      message: `Renamed "${oldName}" to "${newName}"`,
      modifiedCount: updateResult.modifiedCount,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/admin/topics
 * Delete a topic by reassigning its problems to another topic
 */
export async function DELETE(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const demoError = validateDemoAccess(session, 'DELETE')
    if (demoError) return demoError

    const { searchParams } = new URL(request.url)
    const topicName = searchParams.get('topic')
    const reassignTo = searchParams.get('reassignTo')

    if (!topicName) {
      return NextResponse.json(
        { error: 'Topic name is required' },
        { status: 400 }
      )
    }

    await dbConnect()
    const db = mongoose.connection.db
    if (!db) {
      return NextResponse.json(
        { error: 'Database not connected' },
        { status: 500 }
      )
    }

    const problemsCollection = db.collection('problems')

    // Escape regex helper
    function escapeRegExp(string: string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }

    // Check how many problems have this topic
    const escapedTopicName = escapeRegExp(topicName.trim())
    const problemCount = await problemsCollection.countDocuments({
      topic: { $regex: new RegExp(`^${escapedTopicName}$`, 'i') },
    })

    if (problemCount > 0 && !reassignTo) {
      return NextResponse.json(
        {
          error: 'Cannot delete topic with problems',
          message: `This topic has ${problemCount} problems. Provide 'reassignTo' parameter to move them to another topic.`,
          problemCount,
        },
        { status: 400 }
      )
    }

    if (problemCount > 0 && reassignTo) {
      // Reassign problems to the new topic
      await problemsCollection.updateMany(
        { topic: { $regex: new RegExp(`^${escapedTopicName}$`, 'i') } },
        { $set: { topic: reassignTo.trim(), updatedAt: new Date() } }
      )
    }

    return NextResponse.json({
      success: true,
      message: reassignTo
        ? `Deleted "${topicName}" and moved ${problemCount} problems to "${reassignTo}"`
        : `Topic "${topicName}" has no problems and was removed from view`,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * GET /api/admin/topics
 * Get all topics with their problems (admin view with more details)
 */
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const db = mongoose.connection.db
    if (!db) {
      return NextResponse.json(
        { error: 'Database not connected' },
        { status: 500 }
      )
    }

    const problemsCollection = db.collection('problems')

    // Aggregate problems by topic
    const topicsAggregation = await problemsCollection
      .aggregate([
        {
          $match: {
            $and: [
              { topic: { $exists: true } },
              { topic: { $ne: null } },
              { topic: { $ne: '' } },
            ],
          },
        },
        {
          $group: {
            _id: { $trim: { input: '$topic' } },
            total: { $sum: 1 },
            solved: {
              $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] },
            },
            problems: {
              $push: {
                _id: { $toString: '$_id' },
                title: '$title',
                slug: '$slug',
                problem_link: '$problem_link',
                difficulty: '$difficulty',
                status: '$status',
                starred: '$starred',
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            name: '$_id',
            id: {
              $replaceAll: {
                input: { $toLower: '$_id' },
                find: ' ',
                replacement: '-',
              },
            },
            total: 1,
            solved: 1,
            problems: 1,
            domain: { $literal: 'DSA' },
          },
        },
        { $sort: { name: 1 } },
      ])
      .toArray()

    return NextResponse.json(topicsAggregation)
  } catch (error) {
    return handleApiError(error)
  }
}
