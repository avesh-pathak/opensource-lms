'use client'

import { useBacktrackingStore } from '@/lib/store/backtracking-visualizer-store'
import { cn } from '@/lib/utils'

export function BacktrackingCanvas() {
  const { frames, currentFrame } = useBacktrackingStore()
  const frame = frames[currentFrame]

  if (!frame) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-zinc-500 text-sm font-black uppercase tracking-[0.2em]">
          Generate to see subsets
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8 w-full h-full overflow-auto">
      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        Current path: [{frame.current.join(', ')}]
      </span>
      <div className="flex flex-wrap justify-center gap-3">
        {frame.subsets.map((subset, i) => (
          <div
            key={i}
            className={cn(
              'px-4 py-2 rounded-xl border-2 font-mono text-sm font-black',
              'border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/30 text-red-800 dark:text-red-200'
            )}
          >
            [{subset.join(', ')}]
          </div>
        ))}
      </div>
    </div>
  )
}
