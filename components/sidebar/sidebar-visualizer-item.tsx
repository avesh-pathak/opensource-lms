'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface SidebarVisualizerItemProps {
  href: string
  title: string
  subtitle: string
  icon: React.ReactElement
  textColor: string
  bgColor: string
  isActive?: boolean
  onClick?: () => void
  className?: string
}

/**
 * Reusable visualizer nav item: colored icon box + title + subtitle (problem types).
 * Used in visualizer sidebar for Arrays, Sorting, String, etc.
 */
export function SidebarVisualizerItem({
  href,
  title,
  subtitle,
  icon,
  textColor,
  bgColor,
  isActive = false,
  onClick,
  className,
}: SidebarVisualizerItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn('block group', className)}
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-xl p-3 border transition-[background-color,border-color,box-shadow,ring-color] duration-200',
          isActive
            ? cn(
                'border-transparent shadow-md shadow-black/5 dark:shadow-black/20',
                bgColor + '/15',
                'ring-1 ring-black/5 dark:ring-white/10'
              )
            : 'border-border/40 bg-transparent hover:bg-muted/50 hover:border-border'
        )}
      >
        {isActive && (
          <div
            className={cn(
              'absolute inset-0 opacity-[0.15] dark:opacity-20 pointer-events-none mix-blend-multiply dark:mix-blend-normal',
              bgColor
            )}
          />
        )}
        <div className="flex items-center gap-4 relative z-10">
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-[background-color,color,transform,box-shadow] duration-300',
              isActive
                ? cn(
                    bgColor,
                    'text-white shadow-lg shadow-current/20 scale-105'
                  )
                : cn(
                    'bg-opacity-10 dark:bg-opacity-20',
                    bgColor + '/10',
                    textColor
                  )
            )}
          >
            {React.cloneElement(
              icon as React.ReactElement<{ className?: string }>,
              {
                className: 'w-6 h-6',
              }
            )}
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
            <div className="flex items-center justify-between">
              <h3
                className={cn(
                  'font-black text-sm tracking-tighter uppercase truncate transition-colors duration-300',
                  isActive
                    ? cn('text-base', textColor)
                    : 'text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white'
                )}
              >
                {title}
              </h3>
              {isActive && (
                <div
                  className={cn(
                    'w-2 h-2 rounded-full animate-pulse shrink-0',
                    bgColor
                  )}
                />
              )}
            </div>
            <p
              className={cn(
                'text-[10px] font-bold uppercase tracking-wider truncate',
                isActive
                  ? cn('opacity-100', textColor)
                  : 'text-zinc-400 group-hover:text-zinc-500'
              )}
            >
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
