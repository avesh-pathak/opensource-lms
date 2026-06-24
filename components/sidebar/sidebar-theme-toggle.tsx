'use client'

import { ThemeToggle } from '@/components/layout/theme-toggle'
import { cn } from '@/lib/utils'

export interface SidebarThemeToggleProps {
  className?: string
  /** Scale down for tighter sidebar headers */
  scale?: 'default' | 'sm'
}

/**
 * Theme toggle placed in sidebar header. Reused in dashboard and visualizer sidebars.
 */
export function SidebarThemeToggle({
  className,
  scale = 'default',
}: SidebarThemeToggleProps) {
  return (
    <div className={cn(scale === 'sm' && 'scale-75 origin-right', className)}>
      <ThemeToggle />
    </div>
  )
}
