'use client'

import { useTwoPointersStore } from '@/lib/store/two-pointers-visualizer-store'
import { ALGORITHM_DATA } from '@/lib/algorithms/code-snippets'
import { cn } from '@/lib/utils'
import { Code2 } from 'lucide-react'

export function TwoPointersCodeViewer() {
  const { algorithm, frames, currentFrame } = useTwoPointersStore()
  const frame = frames[currentFrame]
  const data = ALGORITHM_DATA[algorithm as keyof typeof ALGORITHM_DATA]
  const codeLines = (data?.code?.pseudo || '// Select an algorithm').split('\n')
  const activeLineIndex = frame?.activeLine ?? -1

  return (
    <div className="flex flex-col gap-4 w-full h-full max-h-[500px]">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <Code2 className="h-4 w-4 text-zinc-500" />
          <span>Two Pointers</span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl h-full flex flex-col">
        <div className="p-6 border-b border-zinc-200 dark:border-white/10 bg-white/40 dark:bg-white/5 flex-1 overflow-y-auto scrollbar-hide">
          <div className="relative font-mono text-xs leading-relaxed">
            {codeLines.map((line: string, idx: number) => (
              <div
                key={idx}
                className={cn(
                  'px-2 py-1 rounded transition-colors duration-200 flex',
                  idx + 1 === activeLineIndex
                    ? 'bg-zinc-500/10 text-zinc-700 dark:text-zinc-200 shadow-[inset_2px_0_0_0_#52525b]'
                    : 'text-zinc-600 dark:text-zinc-400'
                )}
              >
                <span className="w-6 shrink-0 opacity-30 select-none text-right mr-3">
                  {idx + 1}
                </span>
                <span
                  className={cn(
                    idx + 1 === activeLineIndex &&
                      'font-bold whitespace-pre-wrap'
                  )}
                >
                  {line}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
