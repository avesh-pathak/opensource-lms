import { NextRequest, NextResponse } from 'next/server'
import PageView from '@/models/PageView'
import dbConnect from '@/lib/dbConnect'

// Parse user agent to extract device type
function getDeviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' {
  const ua = userAgent.toLowerCase()
  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) {
    return 'mobile'
  }
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    return 'tablet'
  }
  return 'desktop'
}

// Parse browser from user agent
function getBrowser(userAgent: string): string {
  const ua = userAgent.toLowerCase()
  if (ua.includes('firefox')) return 'Firefox'
  if (ua.includes('edg')) return 'Edge'
  if (ua.includes('chrome')) return 'Chrome'
  if (ua.includes('safari')) return 'Safari'
  if (ua.includes('opera') || ua.includes('opr')) return 'Opera'
  return 'Other'
}

// Parse OS from user agent
function getOS(userAgent: string): string {
  const ua = userAgent.toLowerCase()
  if (ua.includes('windows')) return 'Windows'
  if (ua.includes('mac')) return 'macOS'
  if (ua.includes('linux')) return 'Linux'
  if (ua.includes('android')) return 'Android'
  if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad'))
    return 'iOS'
  return 'Other'
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    // Guard against empty body
    const text = await request.text()
    if (!text || text.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Empty body' },
        { status: 200 }
      )
    }

    const body = JSON.parse(text)
    const { path, referrer, sessionId, userId, isNewSession } = body

    // Get user agent from headers
    const userAgent = request.headers.get('user-agent') || ''

    // Create page view record
    await PageView.create({
      path,
      referrer: referrer || '',
      sessionId,
      userId: userId || null,
      userAgent,
      device: getDeviceType(userAgent),
      browser: getBrowser(userAgent),
      os: getOS(userAgent),
      isNewSession: isNewSession || false,
      timestamp: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Analytics track error:', error)
    // Don't fail the request - analytics should be non-blocking
    return NextResponse.json({ success: false }, { status: 200 })
  }
}
