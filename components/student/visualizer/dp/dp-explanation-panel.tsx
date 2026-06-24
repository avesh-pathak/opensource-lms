'use client'

import { useDPStore } from '@/lib/store/dp-visualizer-store'
import { Activity } from 'lucide-react'

export function DPExplanationPanel() {
  const { frames, currentFrame } = useDPStore()
  const frame = frames[currentFrame]

  if (!frame) {
    return (
      <div className="p-5 rounded-3xl border border-white/40 dark:border-white/20 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl">
        <p className="text-sm text-zinc-500">
          Set n and click Generate to see step-by-step tabulation.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 p-5 rounded-3xl border border-white/40 dark:border-white/20 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border bg-violet-500/20 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800">
          <Activity className="h-5 w-5" />
        </div>
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 flex-1">
          {frame.explanation}
        </p>
      </div>
    </div>
  )
}
