'use client'

import { useResponsive } from '@/hooks/use-responsive'
import React from 'react'

export function ResponsiveScaleProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // This hook automatically sets the --vh CSS variable on resize
  useResponsive()

  return <>{children}</>
}
