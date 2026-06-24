/// <reference types="node" />
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { authLimiter, paymentLimiter, apiLimiter } from '@/lib/rate-limit'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error(
    'FATAL: JWT_SECRET is not defined. Add it to your .env file. See .env.example for reference.'
  )
}

const secretKey = JWT_SECRET
const key = new TextEncoder().encode(secretKey)

async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    })
    return payload
  } catch {
    return null
  }
}

// Helper to get IP
// Security Note: On Vercel, x-forwarded-for is trusted and the first IP is the client IP.
// On non-Vercel environments (e.g. self-hosting), ensuring a trusted proxy chain is critical.
// We prefer x-real-ip if set (common in nginx), otherwise fallback to the first x-forwarded-for.
function getIp(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')

  // In Vercel, forwardedFor includes client IP first.
  // In some nginx setups, realIp is set to the direct client.
  // We prioritize realIp if available as it's often explicitly set by the edge.
  if (realIp) return realIp.trim()

  // Fallback to standard forwarded-for
  return forwardedFor?.split(',')[0]?.trim() || '127.0.0.1'
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = getIp(request)

  // ------------------------------------------------------------
  // 1. API Rate Limiting
  // ------------------------------------------------------------
  if (pathname.startsWith('/api')) {
    // Strict: Auth & Token Registration
    if (
      pathname.startsWith('/api/auth') ||
      pathname.startsWith('/api/notifications/register-token')
    ) {
      const isAllowed = await authLimiter.check(10, ip) // 10 req / 10s
      if (!isAllowed)
        return response429('Too many requests. Please try again later.')
    }
    // Strict: Payments
    else if (pathname.startsWith('/api/payments')) {
      const isAllowed = await paymentLimiter.check(20, ip) // 20 req / 1m
      if (!isAllowed) return response429('Payment limit exceeded.')
    }
    // General API
    else {
      const isAllowed = await apiLimiter.check(200, ip) // 200 req / 1m
      if (!isAllowed) return response429('Rate limit exceeded.')
    }
  }

  // ------------------------------------------------------------
  // 2. Admin Authentication
  // ------------------------------------------------------------
  if (pathname.startsWith('/admin')) {
    const sessionToken = request.cookies.get('session')?.value

    if (sessionToken) {
      const payload = await decrypt(sessionToken)
      // Verify if the user is an admin (Master or Demo)
      if (payload?.user?.role === 'admin') {
        return NextResponse.next()
      }
    }

    // No valid admin session found - redirect to admin login
    console.warn(
      `[Middleware] Unauthorized access attempt to ${pathname} - Redirecting...`
    )
    return NextResponse.redirect(new URL('/auth/admin-login', request.url))
  }

  return NextResponse.next()
}

function response429(message: string) {
  return new NextResponse(JSON.stringify({ error: message }), {
    status: 429,
    headers: {
      'Content-Type': 'application/json',
      'Retry-After': '10',
    },
  })
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
}
