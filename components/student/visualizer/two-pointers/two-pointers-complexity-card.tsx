'use client'

import { useTwoPointersStore } from '@/lib/store/two-pointers-visualizer-store'
import { ALGORITHM_DATA } from '@/lib/algorithms/code-snippets'
import { Timer, Zap, Database } from 'lucide-react'

export function TwoPointersComplexityCard() {
  const { algorithm } = useTwoPointersStore()
  const data = ALGORITHM_DATA[algorithm as keyof typeof ALGORITHM_DATA]

  if (!data)
    return (
      <div className="p-6 bg-white/60 dark:bg-black/40 rounded-3xl border border-white/40 dark:border-white/10 backdrop-blur-xl text-center text-xs text-zinc-400">
        Complexity data unavailable
      </div>
    )

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 rounded-3xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          <Zap className="h-3 w-3 text-zinc-500" />
          Best Time
        </div>
        <span className="text-lg font-black italic text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">
          {data.complexity.best}
        </span>
      </div>

      <div className="p-4 rounded-3xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          <Timer className="h-3 w-3 text-zinc-500" />
          Worst Time
        </div>
        <span className="text-lg font-black italic text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">
          {data.complexity.worst}
        </span>
      </div>

      <div className="p-4 rounded-3xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          <Database className="h-3 w-3 text-zinc-500" />
          Space
        </div>
        <span className="text-lg font-black italic text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">
          {data.complexity.average}
        </span>
      </div>
    </div>
  )
}
