import { NextResponse } from 'next/server'

import { encrypt } from '@/lib/jwt'
import bcrypt from 'bcryptjs'

// Admin credentials from environment (NO FALLBACK - must be set)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

// Demo Admin credentials (Optional for test exploration)
const DEMO_ADMIN_EMAIL = process.env.DEMO_ADMIN_EMAIL
const DEMO_ADMIN_PASSWORD = process.env.DEMO_ADMIN_PASSWORD

export async function POST(request: Request) {
  try {
    // Ensure admin credentials are configured
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error(
        '[Admin Auth] Admin credentials not configured in environment'
      )
      return NextResponse.json(
        { success: false, error: 'Admin not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { email, password } = body

    // 1. Check for Master Admin
    const isMasterEmail = email === ADMIN_EMAIL
    let isMasterPassword = false

    if (isMasterEmail) {
      // ADMIN_PASSWORD is already a bcrypt hash, compare plaintext password against it
      try {
        isMasterPassword = await bcrypt.compare(password, ADMIN_PASSWORD!)
      } catch (_e) {
        // Ignore bcrypt errors (e.g. invalid hash in .env during dev)
      }

      // FALLBACK (Dev Only): Allow plain text password if bcrypt fails
      // This allows using un-hashed passwords in .env during local development
      if (!isMasterPassword && process.env.NODE_ENV === 'development') {
        isMasterPassword = password === ADMIN_PASSWORD
      }
    }

    // 2. Check for Demo Admin
    const isDemoEmail = email === DEMO_ADMIN_EMAIL
    const isDemoPassword = isDemoEmail && password === DEMO_ADMIN_PASSWORD

    if (isMasterPassword || isDemoPassword) {
      const isDemo = isDemoPassword

      // Create Middleware Token (for legacy frontend checks)
      const adminToken = Buffer.from(`${email}:${Date.now()}`).toString(
        'base64'
      )

      // Create API JWT Token
      const sessionData = {
        user: {
          id: isDemo ? 'demo-admin-id' : 'admin-static-id',
          email: email,
          name: isDemo ? 'Demo Admin' : 'Master Admin',
          role: 'admin', // Both pass the middleware
          isDemo: isDemo, // Distinguishes them in guards
          image: isDemo ? '/avatars/demo.png' : '/avatars/admin.png',
        },
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
      }
      const jwtToken = await encrypt(sessionData)

      const response = NextResponse.json({
        success: true,
        message: 'Login successful',
      })

      // Session for Middleware
      response.cookies.set('admin_session', adminToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
        path: '/',
      })

      // Session for Auth Context
      response.cookies.set('session', jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: sessionData.expiresAt,
        path: '/',
      })

      return response
    }

    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error: any) {
    console.error('[Admin Auth] Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

// Logout
export async function DELETE() {
  try {
    const response = NextResponse.json({ success: true, message: 'Logged out' })

    response.cookies.set('admin_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })

    response.cookies.set('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })

    return response
  } catch (error: any) {
    console.error('[Admin Auth] Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    )
  }
}
