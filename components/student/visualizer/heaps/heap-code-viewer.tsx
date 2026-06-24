'use client'

import { useHeapStore } from '@/lib/store/heap-visualizer-store'
import { cn } from '@/lib/utils'

const CODE_LINES = [
  'function heapifyUp(heap, i) {',
  '  while (i > 0) {',
  '    const parent = (i - 1) >> 1;',
  '    if (heap[i] >= heap[parent]) break;',
  '    swap(heap, i, parent);',
  '    i = parent;',
  '  }',
  '}',
]

export function HeapCodeViewer() {
  const { frames, currentFrame } = useHeapStore()
  const frame = frames[currentFrame]
  const activeLine = frame?.activeLine ?? 0

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/50 overflow-hidden">
      <div className="px-3 py-2 border-b border-zinc-200 dark:border-white/10 flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          Heapify Up (Min-Heap)
        </span>
      </div>
      <pre className="p-4 text-xs font-mono overflow-x-auto">
        {CODE_LINES.map((line, i) => (
          <div
            key={i}
            className={cn(
              'py-0.5 px-2 -mx-2 rounded',
              activeLine === i + 1 &&
                'bg-amber-500/20 text-amber-800 dark:text-amber-200'
            )}
          >
            <span className="text-zinc-400 w-6 inline-block select-none">
              {i + 1}
            </span>
            {line}
          </div>
        ))}
      </pre>
    </div>
  )
}
