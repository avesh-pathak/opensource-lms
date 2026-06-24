'use client'

import { useVisualizerStore } from '@/lib/store/array-visualizer-store'
import { ALGORITHM_DATA } from '@/lib/algorithms/code-snippets'
import { cn } from '@/lib/utils'
import { FileCode, Terminal } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useState, useEffect } from 'react'

export function CodePanel() {
  const { algorithm, currentFrame, frames, isPlaying } = useVisualizerStore()
  const [isOpen, setIsOpen] = useState(false)

  // Auto-open when playing
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isPlaying) setIsOpen(true)
  }, [isPlaying])

  const data = ALGORITHM_DATA[algorithm as keyof typeof ALGORITHM_DATA]
  // Cast to any because we changed the type structure in code-snippets
  const codeData = data?.code as any
  const code = codeData?.pseudo || '// Select an algorithm'
  const lines = code.split('\n')

  // Determine active line from current frame
  const activeLineIndex = frames[currentFrame]?.activeLine - 1

  // Render variables from the current frame
  const variables = frames[currentFrame]?.variables || {}

  // Group variables
  const pointerVars = ['left', 'right', 'mid', 'i', 'j']
  const resultVars = ['found', 'index', 'target', 'current']

  const pointers = Object.entries(variables).filter(([k]) =>
    pointerVars.includes(k)
  )
  const results = Object.entries(variables).filter(([k]) =>
    resultVars.includes(k)
  )

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Variable Watcher */}
      <div className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2 border-b border-zinc-100 bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300">
          <Terminal className="h-3.5 w-3.5" />
          <span>Variable Watcher</span>
        </div>
        <div className="p-4 font-mono text-xs">
          {/* If no frames, we haven't started. If frames but no variables, usually means initial frame. */}
          {Object.keys(variables).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              {frames.length === 0 ? (
                <>
                  <Terminal className="mb-2 h-8 w-8 opacity-10 text-zinc-400" />
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                    Select an algorithm
                  </span>
                </>
              ) : (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-zinc-500">
                    Ready to visualize
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    Click Play or Step to start
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {pointers.length > 0 && (
                <div>
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Pointers
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                    {pointers.map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 dark:border-zinc-700 dark:bg-zinc-800/50"
                      >
                        <span className="text-zinc-500 dark:text-zinc-400">
                          {key}
                        </span>
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">
                          {String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.length > 0 && (
                <div>
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    State
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                    {results.map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 dark:border-zinc-700 dark:bg-zinc-800/50"
                      >
                        <span className="text-zinc-500 dark:text-zinc-400">
                          {key}
                        </span>
                        <span
                          className={cn(
                            'font-bold',
                            key === 'found' && value === true
                              ? 'text-green-600 dark:text-green-400'
                              : key === 'found' && value === false
                                ? 'text-red-500 dark:text-red-400'
                                : 'text-blue-600 dark:text-blue-400'
                          )}
                        >
                          {String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Code View - Pseudo Logic Only */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <div
          className="flex cursor-pointer items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-2 hover:bg-zinc-100 transition-colors dark:border-zinc-800 dark:bg-zinc-900/50"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            <FileCode className="h-4 w-4" />
            <span>Algorithm Logic</span>
            <span className="ml-2 rounded bg-zinc-200 px-2 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {isOpen ? 'Hide' : 'Show'}
            </span>
          </div>
        </div>

        {isOpen && (
          <ScrollArea
            className="flex-1 bg-white font-mono text-sm dark:bg-zinc-900"
            scrollHideDelay={0}
          >
            <div className="flex flex-col py-2">
              {lines.map((line: string, i: number) => (
                <div
                  key={i}
                  className={cn(
                    'flex px-4 py-0.5 transition-colors',
                    i === activeLineIndex
                      ? 'bg-blue-100 text-blue-900 border-l-3 border-blue-600 dark:bg-blue-950/30 dark:text-blue-200 dark:border-blue-500'
                      : 'text-zinc-600 dark:text-zinc-400'
                  )}
                >
                  <span className="mr-4 min-w-[2.5rem] text-right text-xs text-zinc-400 select-none dark:text-zinc-600">
                    {i + 1}
                  </span>
                  <pre className="flex-1 whitespace-pre text-sm leading-tight">
                    {line}
                  </pre>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  )
}
