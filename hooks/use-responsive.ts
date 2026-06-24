'use client'

import { useState, useEffect, useCallback } from 'react'

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export function useResponsive() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  const handleResize = useCallback(() => {
    if (typeof window === 'undefined') return

    const width = window.innerWidth
    const height = window.innerHeight

    setWindowSize({ width, height })

    // Set custom --vh property for mobile browser address bar fixes
    const vh = height * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }, [])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  const width = windowSize.width
  const height = windowSize.height

  const isMobile = width < 768
  const isTablet = width >= 768 && width < 1024
  const isDesktop = width >= 1024

  let breakpoint: Breakpoint = 'xs'
  if (width < 640) breakpoint = 'xs'
  else if (width < 768) breakpoint = 'sm'
  else if (width < 1024) breakpoint = 'md'
  else if (width < 1280) breakpoint = 'lg'
  else if (width < 1536) breakpoint = 'xl'
  else breakpoint = '2xl'

  return {
    isMobile,
    isTablet,
    isDesktop,
    breakpoint,
    width,
    height,
  }
}
