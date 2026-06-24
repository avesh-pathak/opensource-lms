'use client'

import { useTwoPointersStore } from '@/lib/store/two-pointers-visualizer-store'
import { MessageSquare, Info } from 'lucide-react'

export function TwoPointersExplanationPanel() {
  const { frames, currentFrame } = useTwoPointersStore()
  const frame = frames[currentFrame]

  if (!frame) return null

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">
        <MessageSquare className="h-4 w-4 text-zinc-500" />
        <span>Step</span>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl shadow-2xl p-6 min-h-[120px]">
        <div key={currentFrame} className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="mt-1 p-2 rounded-xl bg-zinc-500/10 text-zinc-600 dark:text-zinc-400">
              <Info className="h-4 w-4" />
            </div>
            <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
              {frame.explanation}
            </p>
          </div>

          {Object.keys(frame.variables).length > 0 && (
            <div className="mt-2 pt-4 border-t border-zinc-200 dark:border-white/10 grid grid-cols-2 gap-3">
              {Object.entries(frame.variables).map(([key, value]) => (
                <div key={key} className="flex flex-col gap-1 overflow-hidden">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    {key}
                  </span>
                  <span className="text-sm font-mono font-bold text-zinc-600 dark:text-zinc-400 truncate">
                    {typeof value === 'object' && value !== null
                      ? JSON.stringify(value)
                      : String(value)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
