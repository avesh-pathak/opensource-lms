'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface SidebarBackLinkProps {
  href?: string
  label?: string
  className?: string
}

/**
 * "Back to Dashboard" (or custom href/label) link for sidebar footer.
 * Reused in visualizer sidebar and any hub that needs a back CTA.
 */
export function SidebarBackLink({
  href = '/dashboard',
  label = 'Back to Dashboard',
  className,
}: SidebarBackLinkProps) {
  return (
    <Link href={href} className={cn('block', className)}>
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4 shrink-0" />
        {label}
      </Button>
    </Link>
  )
}
