'use client'

import { useEffect } from 'react'

/**
 * Lightweight smooth scroll using native CSS scroll-behavior.
 * Replaces the heavy Lenis + GSAP ScrollTrigger sync that caused
 * scroll lag on the landing page.
 */
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = ''
    }
  }, [])

  return <>{children}</>
}
