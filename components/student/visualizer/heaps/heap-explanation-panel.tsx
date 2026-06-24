'use client'

import { useHeapStore } from '@/lib/store/heap-visualizer-store'
import { Activity, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function HeapExplanationPanel() {
  const { frames, currentFrame } = useHeapStore()
  const frame = frames[currentFrame]

  if (!frame) {
    return (
      <div className="p-5 rounded-3xl border border-white/40 dark:border-white/20 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl">
        <p className="text-sm text-zinc-500">
          Run an operation to see step-by-step explanation.
        </p>
      </div>
    )
  }

  const phase = frame.phase ?? 'search'
  const explanation = frame.explanation || 'Processing...'

  return (
    <div className="flex flex-col gap-3 p-5 rounded-3xl border border-white/40 dark:border-white/20 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-xl border',
            phase === 'found'
              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
              : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
          )}
        >
          {phase === 'found' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <Activity className="h-5 w-5" />
          )}
        </div>
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 flex-1">
          {explanation}
        </p>
      </div>
    </div>
  )
}
