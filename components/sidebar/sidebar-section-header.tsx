'use client'

import { cn } from '@/lib/utils'

export interface SidebarSectionHeaderProps {
  children: React.ReactNode
  className?: string
}

/**
 * Reusable section label for sidebar (e.g. "NAVIGATION", "Visualizers", "Engineering Paths").
 * Uppercase, small, muted; consistent across dashboard and visualizer sidebars.
 */
export function SidebarSectionHeader({
  children,
  className,
}: SidebarSectionHeaderProps) {
  return (
    <div
      className={cn(
        'text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-70 px-2',
        className
      )}
    >
      {children}
    </div>
  )
}
