import { NextResponse } from 'next/server'
import { encrypt } from '@/lib/jwt'
import clientPromise from '@/lib/mongodb'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const origin = new URL(request.url).origin
  const redirectUri = `${origin}/api/auth/callback/github`

  if (!code) {
    // Redirect to GitHub OAuth
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`
    return NextResponse.redirect(githubAuthUrl)
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          code,
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          redirect_uri: redirectUri,
        }),
      }
    )

    const tokenData = await tokenResponse.json()
    if (tokenData.error)
      throw new Error(tokenData.error_description || 'Failed to get tokens')

    const accessToken = tokenData.access_token

    // Get user info from GitHub
    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `token ${accessToken}` },
    })
    const githubUser = await userRes.json()

    // Get email (GitHub might not return it in the first request if private)
    let email = githubUser.email
    if (!email) {
      const emailRes = await fetch('https://api.github.com/user/emails', {
        headers: { Authorization: `token ${accessToken}` },
      })
      const emails = await emailRes.json()
      const primaryEmail = emails.find((e: any) => e.primary && e.verified)
      email = primaryEmail?.email || emails[0]?.email
    }

    if (!email) throw new Error('Could not retrieve email from GitHub')

    // Sync with MongoDB
    const client = await clientPromise
    const db = client.db()
    const users = db.collection('users')

    let user = await users.findOne({ email: email })

    if (!user) {
      // Use centralized username generator
      const { generateUniqueUsername } =
        await import('@/lib/utils/username-utils')
      const username = await generateUniqueUsername(
        githubUser.login || githubUser.name || 'user'
      )

      const result = await users.insertOne({
        name: githubUser.name || githubUser.login,
        email: email,
        image: githubUser.avatar_url,
        githubId: githubUser.id,
        username: username,
        createdAt: new Date(),
      })
      user = {
        _id: result.insertedId,
        name: githubUser.name || githubUser.login,
        email: email,
        image: githubUser.avatar_url,
        username: username,
      }
    } else if (!user.githubId) {
      // Link GitHub to existing account
      await users.updateOne(
        { _id: user._id },
        {
          $set: {
            githubId: githubUser.id,
            image: user.image || githubUser.avatar_url,
          },
        }
      )
    }

    if (!user) throw new Error('User sync failed')

    // Create session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const sessionData = {
      user: {
        id: (user as any)._id.toString(),
        email: (user as any).email,
        name: (user as any).name,
        image: (user as any).image,
        username: (user as any).username,
        college: (user as any).college,
        bio: (user as any).bio,
        linkedIn: (user as any).linkedIn,
        leetCode: (user as any).leetCode,
        isProfilePublic: (user as any).isProfilePublic,
        isResumePublic: (user as any).isResumePublic,
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
    console.error('GitHub Auth error:', error)
    return NextResponse.redirect(
      new URL('/?error=github_auth_failed', request.url)
    )
  }
}
