'use client'

import { useRecursionStore } from '@/lib/store/recursion-visualizer-store'
import { MessageSquare, Info, Bird } from 'lucide-react'
import { cn } from '@/lib/utils'

export function RecursionExplanationPanel() {
  const { frames, currentFrame, isRubberDuckMode } = useRecursionStore()
  const frame = frames[currentFrame]

  if (!frame) return null

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">
        {isRubberDuckMode ? (
          <>
            <Bird className="h-4 w-4 text-amber-500" />
            <span className="text-amber-600 dark:text-amber-400">
              Rubber Duck Helper
            </span>
          </>
        ) : (
          <>
            <MessageSquare className="h-4 w-4 text-rose-500" />
            <span>Recursive Strategy</span>
          </>
        )}
      </div>

      <div
        className={cn(
          'relative overflow-hidden rounded-3xl border backdrop-blur-xl shadow-2xl p-6 h-full min-h-[160px] transition-colors duration-500',
          isRubberDuckMode
            ? 'border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10'
            : 'border-white/40 dark:border-white/10 bg-white/60 dark:bg-black/40'
        )}
      >
        <div key={currentFrame} className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                'mt-1 p-2 rounded-xl transition-colors duration-300 shrink-0',
                isRubberDuckMode
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                  : 'bg-rose-500/10 text-rose-500'
              )}
            >
              {isRubberDuckMode ? (
                <Bird className="h-5 w-5" />
              ) : (
                <Info className="h-4 w-4" />
              )}
            </div>
            <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
              {isRubberDuckMode && (
                <span className="font-bold text-amber-600 dark:text-amber-400 mr-2">
                  Quack! 🦆
                </span>
              )}
              {frame.explanation}
            </p>
          </div>

          {/* Variables Display */}
          {Object.keys(frame.variables).length > 0 && (
            <div
              className={cn(
                'mt-4 pt-4 border-t grid grid-cols-2 gap-4 transition-colors',
                isRubberDuckMode
                  ? 'border-amber-500/20'
                  : 'border-zinc-200 dark:border-white/10'
              )}
            >
              {Object.entries(frame.variables).map(([key, value]) => (
                <div key={key} className="flex flex-col gap-1 overflow-hidden">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-500">
                    {key}
                  </span>
                  <span
                    className={cn(
                      'text-sm font-mono font-bold truncate',
                      isRubberDuckMode
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-rose-600 dark:text-rose-400'
                    )}
                  >
                    {typeof value === 'object' ? JSON.stringify(value) : value}
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
