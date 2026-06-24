'use client'

import React from 'react'
import { useSlidingWindowStore } from '@/lib/store/sliding-window-visualizer-store'
import { cn } from '@/lib/utils'

export function SlidingWindowCanvas() {
  const { frames, currentFrame } = useSlidingWindowStore()
  const frame = frames[currentFrame]

  if (!frame)
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <p className="text-zinc-500 animate-pulse text-sm font-black uppercase tracking-[0.2em]">
          Initializing...
        </p>
      </div>
    )

  const {
    array,
    highlights,
    secondaryHighlights,
    pointers,
    ranges = [],
  } = frame

  const isString =
    Array.isArray(array) && array.length > 0 && typeof array[0] === 'string'
  const items = array as (number | string)[]

  return (
    <div className="relative w-full overflow-hidden flex flex-col gap-8 p-6">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
        {isString ? 'String (characters)' : 'Array'}
      </span>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {items.map((item, idx) => {
          const isHighlighted = highlights.includes(idx)
          const isSecondary = secondaryHighlights.includes(idx)
          const isLeft = pointers.left === idx
          const isRight = pointers.right === idx
          const inRange = ranges.some(
            (r) => idx >= r.start && idx <= r.end && r.type === 'active'
          )

          return (
            <div
              key={`${idx}-${item}`}
              className={cn(
                'flex flex-col items-center gap-1 transition-all duration-200',
                inRange && 'ring-2 ring-yellow-500/50 rounded-lg ring-offset-2'
              )}
            >
              <div
                className={cn(
                  'flex items-center justify-center min-w-[44px] h-12 rounded-xl border text-sm font-bold transition-all duration-200',
                  isHighlighted &&
                    'bg-yellow-500 text-white border-yellow-500 shadow-lg shadow-yellow-500/20',
                  isSecondary &&
                    !isHighlighted &&
                    'bg-yellow-500/30 border-yellow-500/50 text-yellow-900 dark:text-yellow-100',
                  !isHighlighted &&
                    !isSecondary &&
                    'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100'
                )}
              >
                {item}
              </div>
              {(isLeft || isRight) && (
                <span className="text-[9px] font-black uppercase text-yellow-600 dark:text-yellow-400">
                  {isLeft && 'L'}
                  {isLeft && isRight ? '/' : ''}
                  {isRight && 'R'}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
