import { auth } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const {
      name,
      gender,
      username,
      college,
      image,
      linkedIn,
      leetCode,
      bio,
      isProfilePublic,
      isResumePublic,
    } = body

    // Validate URLs if provided
    if (
      linkedIn &&
      !/^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/.test(linkedIn)
    ) {
      return NextResponse.json(
        { error: 'Invalid LinkedIn URL format' },
        { status: 400 }
      )
    }
    if (
      leetCode &&
      !/^https?:\/\/(www\.)?leetcode\.com\/(u\/)?[\w-]+\/?$/.test(leetCode)
    ) {
      return NextResponse.json(
        { error: 'Invalid LeetCode URL format' },
        { status: 400 }
      )
    }
    if (bio && bio.length > 200) {
      return NextResponse.json(
        { error: 'Bio must be 200 characters or less' },
        { status: 400 }
      )
    }

    let userId: ObjectId
    try {
      userId = new ObjectId(session.user.id)
    } catch (_err) {
      console.error('Invalid ID Format:', session.user.id)
      return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()
    const users = db.collection('users')

    const existingUser = await users.findOne({ _id: userId })

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Username uniqueness check
    if (username && username !== existingUser.username) {
      const trimmedUsername = username.trim().toLowerCase()
      if (trimmedUsername.length < 3) {
        return NextResponse.json(
          { error: 'Username too short' },
          { status: 400 }
        )
      }

      const duplicate = await users.findOne({
        username: trimmedUsername,
        _id: { $ne: userId },
      })

      if (duplicate) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 400 }
        )
      }
    }

    const updateData: any = {
      name: name || existingUser.name || '',
      gender: gender || existingUser.gender || '',
      username: username
        ? username.trim().toLowerCase()
        : existingUser.username || '',
      college: college || existingUser.college || '',
      image: image || existingUser.image || '',
      // Public Profile fields - ensure no undefined
      linkedIn: linkedIn !== undefined ? linkedIn : existingUser.linkedIn || '',
      leetCode: leetCode !== undefined ? leetCode : existingUser.leetCode || '',
      bio: bio !== undefined ? bio : existingUser.bio || '',
      isProfilePublic:
        isProfilePublic !== undefined
          ? isProfilePublic
          : existingUser.isProfilePublic || false,
      isResumePublic:
        isResumePublic !== undefined
          ? isResumePublic
          : existingUser.isResumePublic || false,
      updatedAt: new Date(),
    }

    // Remove any remaining undefined keys just in case
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    )

    const _result = await users.updateOne({ _id: userId }, { $set: updateData })

    // Session update (Non-blocking)
    try {
      const { encrypt } = await import('@/lib/jwt')
      const { cookies } = await import('next/headers')

      const sessionData = {
        user: {
          id: session.user.id,
          email: session.user.email,
          name: updateData.name,
          image: updateData.image,
          username: updateData.username,
          college: updateData.college,
          bio: updateData.bio || '',
          linkedIn: updateData.linkedIn || '',
          leetCode: updateData.leetCode || '',
          isProfilePublic: !!updateData.isProfilePublic,
          isResumePublic: !!updateData.isResumePublic,
        },
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }

      const token = await encrypt(sessionData)
      const cookieStore = await cookies()

      cookieStore.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: sessionData.expiresAt,
        path: '/',
      })
    } catch (cookieError) {
      console.error('Session Cookie Update Failed:', cookieError)
      // Swallow error, data is already saved
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Critical Profile Update Error:', error)
    return NextResponse.json(
      {
        error: `Update failed: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 }
    )
  }
}
