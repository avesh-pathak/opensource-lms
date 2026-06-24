'use client'

import { useBacktrackingStore } from '@/lib/store/backtracking-visualizer-store'
import { Activity } from 'lucide-react'

export function BacktrackingExplanationPanel() {
  const { frames, currentFrame } = useBacktrackingStore()
  const frame = frames[currentFrame]

  if (!frame) {
    return (
      <div className="p-5 rounded-3xl border border-white/40 dark:border-white/20 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl">
        <p className="text-sm text-zinc-500">
          Generate to see step-by-step backtracking.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 p-5 rounded-3xl border border-white/40 dark:border-white/20 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border bg-red-500/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800">
          <Activity className="h-5 w-5" />
        </div>
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 flex-1">
          {frame.explanation}
        </p>
      </div>
    </div>
  )
}
