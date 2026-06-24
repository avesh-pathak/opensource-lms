'use client'

import { useHashingStore } from '@/lib/store/hashing-visualizer-store'
import { MessageSquare, Info } from 'lucide-react'

export function HashingExplanationPanel() {
  const { frames, currentFrame } = useHashingStore()
  const frame = frames[currentFrame]

  if (!frame) return null

  const renderAsciiBreakdown = () => {
    const { key, buckets, hashValue } = frame.variables
    if (!key || typeof key !== 'string' || !buckets) return null

    const chars = key.split('')
    const asciiValues = chars.map((c) => c.charCodeAt(0))
    const totalSum = asciiValues.reduce((a, b) => a + b, 0)

    return (
      <div className="mt-6 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-white/5 space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          ASCII Hash Function
        </div>

        {/* Character Breakdown */}
        <div className="flex flex-wrap gap-2 justify-center">
          {chars.map((char, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-black border border-zinc-200 dark:border-zinc-700 font-bold font-mono text-zinc-700 dark:text-zinc-300 shadow-sm">
                {char}
              </div>
              <div className="text-[10px] font-mono text-zinc-400">
                {asciiValues[idx]}
              </div>
            </div>
          ))}
        </div>

        {/* Math */}
        <div className="flex flex-col gap-2 font-mono text-xs md:text-sm text-center border-t border-zinc-200 dark:border-white/5 pt-4">
          <div className="text-zinc-500">
            ∑ ASCII ={' '}
            <span className="text-zinc-900 dark:text-zinc-100 font-bold">
              {totalSum}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-zinc-900 dark:text-zinc-100 font-bold">
              {totalSum}
            </span>
            <span className="text-amber-500">%</span>
            <span className="text-zinc-900 dark:text-zinc-100 font-bold">
              {buckets}
            </span>
            <span className="text-zinc-400">=</span>
            <span className="px-3 py-1 rounded-lg bg-amber-500 text-white font-bold shadow-lg shadow-amber-500/20">
              {hashValue ?? totalSum % (buckets as number)}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">
        <MessageSquare className="h-4 w-4 text-amber-500" />
        <span>Hashing Strategy</span>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl shadow-2xl p-6 h-full min-h-[160px]">
        <div key={currentFrame} className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="mt-1 p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Info className="h-4 w-4" />
            </div>
            <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
              {frame.explanation}
            </p>
          </div>

          {renderAsciiBreakdown()}

          {/* Variables Display */}
          {Object.keys(frame.variables).length > 0 && !frame.variables.key && (
            <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-white/10 grid grid-cols-2 gap-4">
              {Object.entries(frame.variables).map(([key, value]) => (
                <div key={key} className="flex flex-col gap-1 overflow-hidden">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-500">
                    {key}
                  </span>
                  <span className="text-sm font-mono font-bold text-amber-600 dark:text-amber-400 truncate">
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
