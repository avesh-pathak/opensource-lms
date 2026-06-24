import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { auth } from '@/lib/auth'
import { validateDemoAccess } from '@/lib/guards/demo-guard'
import { handleApiError, validateObjectId, ApiResponse } from '@/lib/api-utils'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const idError = validateObjectId(id, 'User ID')
    if (idError) return idError

    const client = await clientPromise
    const db = client.db()
    const userId = new ObjectId(id)

    // Fetch user first, then batch fetch all stats in parallel
    const user = await db.collection('users').findOne({ _id: userId })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const solvedIds = user.solvedProblems || []
    const [roastCount, storyCount, problems] = await Promise.all([
      db.collection('roasts').countDocuments({ userId }),
      db.collection('stories').countDocuments({ userId }),
      solvedIds.length > 0
        ? db
            .collection('problems')
            .find(
              { _id: { $in: solvedIds.map((id: any) => new ObjectId(id)) } },
              { projection: { difficulty: 1 } }
            )
            .toArray()
        : [],
    ])

    let easyCount = 0,
      mediumCount = 0,
      hardCount = 0
    problems.forEach((p: any) => {
      const diff = (p.difficulty || '').toLowerCase()
      if (diff === 'easy') easyCount++
      else if (diff === 'medium') mediumCount++
      else if (diff === 'hard') hardCount++
    })

    // Sanitize user object (remove sensitive data)
    const {
      password: _password,
      passwordHash: _passwordHash,
      tokens: _tokens,
      resetToken: _resetToken,
      ...safeUser
    } = user

    return ApiResponse({
      user: safeUser,
      stats: { roastCount, storyCount, easyCount, mediumCount, hardCount },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const demoError = validateDemoAccess(session, 'PATCH')
    if (demoError) return demoError

    const { id } = await params

    const idError = validateObjectId(id, 'User ID')
    if (idError) return idError

    const body = await request.json()
    const client = await clientPromise
    const db = client.db()

    // Handle specific actions like 'ban', 'unban', or general updates
    // Prevent mass assignment and validate
    const _allowedFields = [
      'displayName',
      'image',
      'bio',
      'isBanned',
      'role',
      'preferences',
      'socialLinks',
    ]

    interface UserUpdate {
      displayName?: string
      image?: string
      bio?: string
      isBanned?: boolean
      role?: string
      preferences?: any
      socialLinks?: any
      bannedAt?: Date | null
    }

    const updateData: UserUpdate = {}

    // Helper to validate and assign
    if (body.displayName && typeof body.displayName === 'string')
      updateData.displayName = body.displayName.trim()
    if (body.image && typeof body.image === 'string')
      updateData.image = body.image.trim()
    if (body.bio && typeof body.bio === 'string')
      updateData.bio = body.bio.trim().substring(0, 500) // Limit bio length

    if (body.role && ['user', 'admin', 'mentor'].includes(body.role)) {
      updateData.role = body.role
    }

    if (typeof body.isBanned === 'boolean') {
      updateData.isBanned = body.isBanned
      if (body.isBanned) {
        updateData.bannedAt = new Date()
      } else {
        updateData.bannedAt = null
      }
    }

    // Basic object checks for complex fields (optional: add Zod for stricter schema)
    if (
      body.preferences &&
      typeof body.preferences === 'object' &&
      !Array.isArray(body.preferences)
    ) {
      updateData.preferences = body.preferences
    }
    if (
      body.socialLinks &&
      typeof body.socialLinks === 'object' &&
      !Array.isArray(body.socialLinks)
    ) {
      updateData.socialLinks = body.socialLinks
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields provided for update' },
        { status: 400 }
      )
    }

    const result = await db
      .collection('users')
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return ApiResponse({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
