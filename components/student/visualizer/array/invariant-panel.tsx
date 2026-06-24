'use client'

import { useVisualizerStore } from '@/lib/store/array-visualizer-store'
import { Calculator } from 'lucide-react'

export function InvariantPanel() {
  const { frames, currentFrame, algorithm } = useVisualizerStore()
  const frame = frames[currentFrame]

  if (!frame || algorithm !== 'BINARY_SEARCH') return null

  const left = frame.pointers.left
  const right = frame.pointers.right
  const target = frame.variables?.target

  // Only show if we have valid binary search pointers
  if (left === undefined || right === undefined) return null

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-amber-50/50 p-0 shadow-sm backdrop-blur-sm dark:border-amber-900/30 dark:bg-amber-950/20">
      <div className="border-b border-amber-100 bg-amber-100/50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-500">
        <div className="flex items-center gap-2">
          <Calculator className="h-3 w-3" />
          <span>Theorem: Loop Invariant</span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4 p-6">
        <div className="text-center font-serif text-lg italic text-foreground">
          &quot;The target{' '}
          <span className="font-bold text-blue-600 dark:text-blue-400">
            {target}
          </span>{' '}
          must exist within...&quot;
        </div>

        <div className="flex items-center rounded-lg border border-amber-200 bg-white/50 px-6 py-3 font-mono text-xl shadow-inner dark:border-amber-900/50 dark:bg-black/20">
          <span className="text-amber-700 dark:text-amber-500">Range = [</span>

          <span key={left} className="mx-2 font-bold text-foreground">
            {left}
          </span>

          <span className="text-amber-700 dark:text-amber-500">,</span>

          <span key={right} className="mx-2 font-bold text-foreground">
            {right}
          </span>

          <span className="text-amber-700 dark:text-amber-500">]</span>
        </div>

        <p className="text-center text-[10px] text-muted-foreground/50">
          If L &le; R and A[mid] &ne; T, search space reduces to [L, R]
        </p>
      </div>
    </div>
  )
}
