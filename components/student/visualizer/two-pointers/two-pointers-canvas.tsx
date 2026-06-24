'use client'

import React from 'react'
import { useTwoPointersStore } from '@/lib/store/two-pointers-visualizer-store'
import { cn } from '@/lib/utils'

export function TwoPointersCanvas() {
  const { frames, currentFrame } = useTwoPointersStore()
  const frame = frames[currentFrame]

  if (!frame)
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <p className="text-zinc-500 animate-pulse text-sm font-black uppercase tracking-[0.2em]">
          Initializing...
        </p>
      </div>
    )

  const { array, highlights, secondaryHighlights, pointers } = frame

  const isString =
    Array.isArray(array) && array.length > 0 && typeof array[0] === 'string'
  const items = array as (number | string)[]

  return (
    <div className="relative w-full overflow-hidden flex flex-col gap-8 p-6">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
        {isString ? 'String' : 'Array'}
      </span>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {items.map((item, idx) => {
          const isHighlighted = highlights.includes(idx)
          const isSecondary = secondaryHighlights.includes(idx)
          const isLeft = pointers.left === idx
          const isRight = pointers.right === idx
          const isMid = pointers.mid === idx
          const isLow = pointers.low === idx
          const isHigh = pointers.high === idx

          return (
            <div
              key={`${idx}-${item}`}
              className="flex flex-col items-center gap-1 transition-all duration-200"
            >
              <div
                className={cn(
                  'flex items-center justify-center min-w-[44px] h-12 rounded-xl border text-sm font-bold transition-all duration-200',
                  isHighlighted &&
                    'bg-zinc-600 text-white border-zinc-600 shadow-lg shadow-zinc-500/20',
                  isSecondary &&
                    !isHighlighted &&
                    'bg-zinc-500/30 border-zinc-500/50 text-zinc-900 dark:text-zinc-100',
                  !isHighlighted &&
                    !isSecondary &&
                    'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100'
                )}
              >
                {item}
              </div>
              <span className="text-[9px] font-black uppercase text-zinc-500 min-h-[14px]">
                {isLeft && 'L'}
                {isRight && 'R'}
                {isMid && 'M'}
                {isLow && 'lo'}
                {isHigh && 'hi'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
