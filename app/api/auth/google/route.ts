import { NextResponse } from 'next/server'
import { encrypt } from '@/lib/jwt'
import clientPromise from '@/lib/mongodb'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const origin = new URL(request.url).origin
  const redirectUri = `${origin}/api/auth/google`

  if (!code) {
    // Redirect to Google OAuth
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile`
    return NextResponse.redirect(googleAuthUrl)
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    const tokens = await tokenResponse.json()
    if (tokens.error)
      throw new Error(tokens.error_description || 'Failed to get tokens')

    // Get user info
    const userRes = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    )
    const googleUser = await userRes.json()

    // Sync with MongoDB
    const client = await clientPromise
    const db = client.db()
    const users = db.collection('users')

    let user = await users.findOne({ email: googleUser.email })

    if (!user) {
      // Use centralized username generator
      const { generateUniqueUsername } =
        await import('@/lib/utils/username-utils')
      const username = await generateUniqueUsername(
        googleUser.name || googleUser.email
      )

      const result = await users.insertOne({
        name: googleUser.name,
        email: googleUser.email,
        image: googleUser.picture,
        username: username,
        role: 'user', // Default role
        createdAt: new Date(),
      })
      user = {
        _id: result.insertedId,
        name: googleUser.name,
        email: googleUser.email,
        image: googleUser.picture,
        username: username,
      }
    }

    if (!user) throw new Error('User creation failed')

    // Create session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const sessionData = {
      user: {
        id: (user as any)._id.toString(),
        email: (user as any).email,
        name: (user as any).name,
        image: (user as any).image || googleUser.picture,
        username: (user as any).username,
        college: (user as any).college,
        bio: (user as any).bio,
        linkedIn: (user as any).linkedIn,
        leetCode: (user as any).leetCode,
        isProfilePublic: (user as any).isProfilePublic,
        isResumePublic: (user as any).isResumePublic,
        role: (user as any).role || 'user',
      },
      expiresAt,
    }

    const token = await encrypt(sessionData)

    // Set cookie
    ;(await cookies()).set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    })

    return NextResponse.redirect(new URL('/dashboard', request.url))
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url))
  }
}
