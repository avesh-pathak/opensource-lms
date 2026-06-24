'use client'

import { useLinkedListStore } from '@/lib/store/linked-list-visualizer-store'
import { Check, XCircle, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LinkedListExplanationPanel() {
  const { frames, currentFrame, algorithm: _algorithm } = useLinkedListStore()
  const frame = frames[currentFrame]

  if (!frame) return null

  const phase = frame.phase || 'search'
  const explanation = frame.explanation || 'Ready to start'
  const comparisons = frame.comparisons || 0

  return (
    <div className="flex flex-col gap-3 p-5 rounded-3xl border border-white/40 dark:border-white/20 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl transition-all hover:bg-white/70 dark:hover:bg-zinc-900/90 w-full max-w-3xl mx-auto">
      {/* Header / Status Icon */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            key={phase}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-xl shadow-lg border border-white/10',
              phase === 'found'
                ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                : phase === 'not-found'
                  ? 'bg-red-500/20 text-red-600 dark:text-red-400'
                  : 'bg-purple-500/20 text-purple-600 dark:text-purple-400'
            )}
          >
            {phase === 'found' ? (
              <Check className="h-5 w-5" />
            ) : phase === 'not-found' ? (
              <XCircle className="h-5 w-5" />
            ) : (
              <Activity className="h-5 w-5" />
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">
              Current Status
            </span>
            <span
              className={cn(
                'text-sm font-bold',
                phase === 'found'
                  ? 'text-green-600 dark:text-green-400'
                  : phase === 'not-found'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-zinc-800 dark:text-zinc-100'
              )}
            >
              {phase === 'found'
                ? 'Target Found'
                : phase === 'not-found'
                  ? 'Not Found'
                  : 'Searching...'}
            </span>
          </div>
        </div>

        {/* Counter */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">
            Comparisons
          </span>
          <span className="font-mono text-xl font-bold text-zinc-800 dark:text-white tracking-widest">
            {comparisons.toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Content Divider */}
      <div className="h-px w-full bg-zinc-200 dark:bg-white/10 my-1" />

      {/* Explanation Text */}
      <div className="relative min-h-[3rem]">
        <p
          key={explanation}
          className="text-sm font-medium leading-relaxed text-zinc-600 dark:text-zinc-300"
        >
          {explanation}
        </p>
      </div>
    </div>
  )
}
