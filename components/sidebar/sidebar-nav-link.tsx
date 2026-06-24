'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface SidebarNavLinkProps {
  href: string
  icon: React.ElementType
  active?: boolean
  onClick?: () => void
  isCollapsed?: boolean
  children: React.ReactNode
  className?: string
}

/**
 * Reusable nav link: icon + label, active state, optional collapse (icon-only).
 * Used in dashboard sidebar for Overview, Analytics, Visualizers, etc.
 */
export function SidebarNavLink({
  href,
  icon: Icon,
  active = false,
  onClick,
  isCollapsed = false,
  children,
  className,
}: SidebarNavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      title={isCollapsed && typeof children === 'string' ? children : undefined}
      className={cn(
        'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-[background-color,color,box-shadow] duration-200',
        active
          ? 'bg-primary/10 text-primary font-black shadow-sm'
          : 'text-foreground/80 hover:bg-muted hover:text-foreground font-bold',
        isCollapsed && 'justify-center px-0 h-12 w-12 mx-auto',
        className
      )}
    >
      <Icon
        className={cn(
          'h-4 w-4 shrink-0',
          active ? 'text-primary' : 'text-foreground/60'
        )}
        aria-hidden="true"
      />
      {!isCollapsed && children}
    </Link>
  )
}
