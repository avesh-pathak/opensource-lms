'use client'

import { useGreedyStore } from '@/lib/store/greedy-visualizer-store'
import { cn } from '@/lib/utils'

export function GreedyCanvas() {
  const { frames, currentFrame } = useGreedyStore()
  const frame = frames[currentFrame]

  if (!frame) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-zinc-500 text-sm font-black uppercase tracking-[0.2em]">
          Generate to see activity selection
        </p>
      </div>
    )
  }

  const intervals =
    frame.array.length >= 2
      ? (frame.array as number[]).reduce(
          (acc: [number, number][], _, i, arr) => {
            if (i % 2 === 0 && arr[i + 1] != null)
              acc.push([arr[i]!, arr[i + 1]!])
            return acc
          },
          []
        )
      : []

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8 w-full h-full overflow-auto">
      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        Intervals (sorted by end) — green = picked
      </span>
      <div className="flex flex-wrap justify-center gap-4">
        {intervals.map(([s, e], i) => (
          <div
            key={i}
            className={cn(
              'px-4 py-2 rounded-xl border-2 font-mono text-sm font-black',
              frame.picked.includes(i)
                ? 'border-teal-500 bg-teal-500 text-white'
                : 'border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
            )}
          >
            [{s}, {e}]
          </div>
        ))}
      </div>
    </div>
  )
}
