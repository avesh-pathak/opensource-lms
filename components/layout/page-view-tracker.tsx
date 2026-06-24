'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// Generate a unique session ID
function getSessionId(): string {
  if (typeof window === 'undefined') return ''

  let sessionId = sessionStorage.getItem('analytics_session_id')
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('analytics_session_id', sessionId)
  }
  return sessionId
}

// Check if this is a new session
function isNewSession(): boolean {
  if (typeof window === 'undefined') return false

  const lastVisit = localStorage.getItem('analytics_last_visit')
  const now = Date.now()

  // Consider it a new session if last visit was more than 30 minutes ago
  const isNew = !lastVisit || now - parseInt(lastVisit) > 30 * 60 * 1000
  localStorage.setItem('analytics_last_visit', now.toString())

  return isNew
}

export function PageViewTracker() {
  const pathname = usePathname()
  const lastPathRef = useRef<string>('')
  const sessionIdRef = useRef<string>('')

  useEffect(() => {
    // Only track if path changed (prevents double-tracking on hydration)
    if (pathname === lastPathRef.current) return
    lastPathRef.current = pathname

    // Get or create session ID
    if (!sessionIdRef.current) {
      sessionIdRef.current = getSessionId()
    }

    // Don't track admin or API routes
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return
    }

    // Send page view
    const trackPageView = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: pathname,
            referrer: document.referrer,
            sessionId: sessionIdRef.current,
            isNewSession: isNewSession(),
          }),
        })
      } catch (error) {
        // Silently fail - don't break the user experience
        console.debug('Analytics tracking failed:', error)
      }
    }

    // Delay slightly to not block page load
    const timeoutId = setTimeout(trackPageView, 100)
    return () => clearTimeout(timeoutId)
  }, [pathname])

  return null
}
