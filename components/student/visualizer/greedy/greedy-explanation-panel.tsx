'use client'

import { useGreedyStore } from '@/lib/store/greedy-visualizer-store'
import { Activity } from 'lucide-react'

export function GreedyExplanationPanel() {
  const { frames, currentFrame } = useGreedyStore()
  const frame = frames[currentFrame]

  if (!frame) {
    return (
      <div className="p-5 rounded-3xl border border-white/40 dark:border-white/20 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl">
        <p className="text-sm text-zinc-500">Generate to see greedy steps.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 p-5 rounded-3xl border border-white/40 dark:border-white/20 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border bg-teal-500/20 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800">
          <Activity className="h-5 w-5" />
        </div>
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 flex-1">
          {frame.explanation}
        </p>
      </div>
    </div>
  )
}
