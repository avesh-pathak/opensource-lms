'use client'

import { useHeapStore } from '@/lib/store/heap-visualizer-store'
import { cn } from '@/lib/utils'

const COMPLEXITY: Record<string, { time: string; space: string }> = {
  HEAP_INSERT: { time: 'O(log n)', space: 'O(1)' },
  HEAP_EXTRACT: { time: 'O(log n)', space: 'O(1)' },
  HEAP_HEAPIFY: { time: 'O(n)', space: 'O(1)' },
  HEAP_SORT: { time: 'O(n log n)', space: 'O(1)' },
  HEAP_BUILD: { time: 'O(n)', space: 'O(1)' },
}

export function HeapComplexityCard() {
  const { algorithm } = useHeapStore()
  const c = COMPLEXITY[algorithm] ?? { time: 'O(log n)', space: 'O(1)' }

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 p-4 shadow-sm">
      <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-3">
        Complexity
      </h4>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase">
            Time
          </span>
          <p
            className={cn(
              'font-mono font-black text-amber-600 dark:text-amber-400'
            )}
          >
            {c.time}
          </p>
        </div>
        <div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase">
            Space
          </span>
          <p className="font-mono font-black text-zinc-700 dark:text-zinc-300">
            {c.space}
          </p>
        </div>
      </div>
    </div>
  )
}
