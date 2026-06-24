'use client'

import { useDPStore } from '@/lib/store/dp-visualizer-store'
import { cn } from '@/lib/utils'

export function DPCanvas() {
  const { frames, currentFrame } = useDPStore()
  const frame = frames[currentFrame]
  const array = (frame?.array as number[] | undefined) ?? []
  const highlights = frame?.highlights ?? []
  const secondary = frame?.secondaryHighlights ?? []

  if (array.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-zinc-500 text-sm font-black uppercase tracking-[0.2em]">
          Set n and click Generate to build the table
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8 w-full h-full">
      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        dp[0..n] — Fibonacci tabulation
      </span>
      <div className="flex flex-wrap justify-center gap-2">
        {array.map((val, idx) => {
          const isHighlight = highlights.includes(idx)
          const isSecondary = secondary.includes(idx)
          return (
            <div
              key={idx}
              className={cn(
                'w-14 h-14 rounded-xl border-2 flex flex-col items-center justify-center font-mono text-sm font-black transition-all',
                isHighlight &&
                  'border-violet-500 bg-violet-500 text-white ring-4 ring-violet-500/20',
                isSecondary &&
                  !isHighlight &&
                  'border-violet-300 bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-200',
                !isHighlight &&
                  !isSecondary &&
                  'border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200'
              )}
            >
              <span className="text-[10px] opacity-70">[{idx}]</span>
              {val}
            </div>
          )
        })}
      </div>
    </div>
  )
}
