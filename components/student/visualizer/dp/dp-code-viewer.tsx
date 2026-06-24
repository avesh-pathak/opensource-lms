'use client'

import { useDPStore } from '@/lib/store/dp-visualizer-store'
import { cn } from '@/lib/utils'

const LINES = [
  'dp[0], dp[1] = 0, 1',
  'for i in range(2, n+1):',
  '  dp[i] = dp[i-1] + dp[i-2]',
  'return dp[n]',
]

export function DPCodeViewer() {
  const { frames, currentFrame } = useDPStore()
  const frame = frames[currentFrame]
  const activeLine = frame?.activeLine ?? 1

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/50 overflow-hidden">
      <div className="px-3 py-2 border-b border-zinc-200 dark:border-white/10">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          Tabulation
        </span>
      </div>
      <pre className="p-4 text-xs font-mono overflow-x-auto">
        {LINES.map((line, i) => (
          <div
            key={i}
            className={cn(
              'py-0.5 px-2 -mx-2 rounded',
              activeLine === i + 1 &&
                'bg-violet-500/20 text-violet-800 dark:text-violet-200'
            )}
          >
            <span className="text-zinc-400 w-6 inline-block select-none">
              {i + 1}
            </span>
            {line}
          </div>
        ))}
      </pre>
    </div>
  )
}
