'use client'

import { useState, useEffect } from 'react'

/**
 * Detects if the user has enabled prefers-reduced-motion.
 * GSAP animations bypass CSS prefers-reduced-motion, so this hook
 * must be checked in all GSAP-using components.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mediaQuery.matches)

    const handleChange = () => setReduced(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return reduced
}
