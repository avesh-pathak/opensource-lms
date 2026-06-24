'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface VisualizerCardProps {
  title: string
  subtitle: string
  description: string
  icon: React.ReactNode
  textColor: string // e.g. "text-orange-600"
  bgColor: string // e.g. "bg-orange-600"
  href: string
  isLocked?: boolean
  className?: string
}

export function VisualizerCard({
  title,
  subtitle,
  description,
  icon,
  textColor,
  bgColor,
  href,
  isLocked = false,
  className,
}: VisualizerCardProps) {
  return (
    <Link href={href} className={cn('group relative flex h-full flex-col')}>
      <div
        className={cn(
          'relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md dark:bg-zinc-900 dark:border-zinc-800',
          className
        )}
      >
        {/* Large Watermark Icon */}
        <div
          className={cn(
            'absolute right-6 top-6 opacity-[0.15] transition-opacity group-hover:opacity-25 [&>svg]:h-24 [&>svg]:w-24 dark:opacity-35 dark:group-hover:opacity-50',
            textColor
          )}
        >
          {icon}
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-1 flex-col">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-2xl font-black uppercase tracking-tighter text-foreground dark:text-white">
              {title}
            </h3>
            <p
              className={cn(
                'text-xs font-semibold uppercase tracking-wider italic',
                textColor
              )}
            >
              {subtitle}
            </p>
          </div>

          {/* Description */}
          <p className="mb-8 flex-1 text-sm font-medium leading-relaxed text-zinc-800 dark:text-zinc-200">
            {description}
          </p>

          {/* Action Button */}
          <div
            className={cn(
              'mt-auto flex w-full items-center justify-center rounded-xl py-3 text-xs font-bold uppercase tracking-wider text-white transition-transform active:scale-95',
              bgColor,
              'shadow-sm group-hover:brightness-110'
            )}
          >
            {isLocked ? (
              <span className="flex items-center gap-2">Notify Me</span>
            ) : (
              <span className="flex items-center gap-2">Start Visualizing</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export const MemoizedVisualizerCard = React.memo(VisualizerCard)
