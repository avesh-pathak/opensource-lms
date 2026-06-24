'use client'

import { useHeapStore } from '@/lib/store/heap-visualizer-store'
import { cn } from '@/lib/utils'

export function HeapCanvas() {
  const { frames, currentFrame, heap: storeHeap } = useHeapStore()
  const frame = frames[currentFrame]
  const array = (frame?.array as number[] | undefined) ?? storeHeap
  const highlights = frame?.highlights ?? []
  const secondary = frame?.secondaryHighlights ?? []
  const visited = frame?.visited ?? []

  if (array.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-zinc-500 text-sm font-black uppercase tracking-[0.2em]">
          Add elements to the heap
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-12 p-8 w-full h-full">
      {/* Array representation */}
      <div className="flex flex-col gap-4 items-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          Array representation
        </span>
        <div className="flex flex-wrap justify-center gap-2">
          {array.map((val, idx) => {
            const isHighlight = highlights.includes(idx)
            const isSecondary = secondary.includes(idx)
            const isVisited = visited.includes(idx)
            return (
              <div
                key={idx}
                className={cn(
                  'w-12 h-12 rounded-xl border-2 flex items-center justify-center font-mono text-sm font-black transition-all',
                  isHighlight &&
                    'border-amber-500 bg-amber-500 text-white shadow-lg ring-4 ring-amber-500/20',
                  isSecondary &&
                    !isHighlight &&
                    'border-amber-300 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200',
                  !isHighlight &&
                    !isSecondary &&
                    isVisited &&
                    'border-zinc-200 dark:border-white/10 bg-zinc-100/50 dark:bg-zinc-800/50 text-zinc-500',
                  !isHighlight &&
                    !isSecondary &&
                    !isVisited &&
                    'border-zinc-300 dark:border-white/10 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100'
                )}
              >
                {val}
              </div>
            )
          })}
        </div>
      </div>

      {/* Tree representation (compact: same array, laid out by level) */}
      <div className="flex flex-col gap-4 items-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          Tree view
        </span>
        <div className="flex flex-col items-center gap-3">
          {(() => {
            const rows: number[][] = []
            let i = 0
            let rowLen = 1
            while (i < array.length) {
              rows.push(array.slice(i, i + rowLen))
              i += rowLen
              rowLen *= 2
            }
            return rows.map((row, rowIdx) => (
              <div
                key={rowIdx}
                className="flex gap-4 justify-center items-center"
              >
                {row.map((val, colIdx) => {
                  const idx = Math.pow(2, rowIdx) - 1 + colIdx
                  const isHighlight = highlights.includes(idx)
                  const isSecondary = secondary.includes(idx)
                  const isVisited = visited.includes(idx)
                  return (
                    <div
                      key={idx}
                      className={cn(
                        'w-14 h-14 rounded-2xl border-2 flex items-center justify-center font-mono font-black text-base transition-all',
                        isHighlight &&
                          'border-amber-500 bg-amber-500 text-white shadow-lg ring-4 ring-amber-500/20',
                        isSecondary &&
                          !isHighlight &&
                          'border-amber-300 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200',
                        !isHighlight &&
                          !isSecondary &&
                          isVisited &&
                          'border-zinc-200 dark:border-white/10 bg-zinc-100/50 dark:bg-zinc-800/50 text-zinc-500',
                        !isHighlight &&
                          !isSecondary &&
                          !isVisited &&
                          'border-zinc-300 dark:border-white/10 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100'
                      )}
                    >
                      {val}
                    </div>
                  )
                })}
              </div>
            ))
          })()}
        </div>
      </div>
    </div>
  )
}
