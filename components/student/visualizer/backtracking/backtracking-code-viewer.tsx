'use client'

import { useBacktrackingStore } from '@/lib/store/backtracking-visualizer-store'
import { cn } from '@/lib/utils'

const LINES = [
  'def backtrack(start, path):',
  '  result.append(path[:])',
  '  for i in range(start, len(nums)):',
  '    path.append(nums[i])',
  '    backtrack(i + 1, path)',
  '    path.pop()',
]

export function BacktrackingCodeViewer() {
  const { frames, currentFrame } = useBacktrackingStore()
  const frame = frames[currentFrame]
  const activeLine = frame?.activeLine ?? 1

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/50 overflow-hidden">
      <div className="px-3 py-2 border-b border-zinc-200 dark:border-white/10">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          Subsets backtracking
        </span>
      </div>
      <pre className="p-4 text-xs font-mono overflow-x-auto">
        {LINES.map((line, i) => (
          <div
            key={i}
            className={cn(
              'py-0.5 px-2 -mx-2 rounded',
              activeLine === i + 1 &&
                'bg-red-500/20 text-red-800 dark:text-red-200'
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
