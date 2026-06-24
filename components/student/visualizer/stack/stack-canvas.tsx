'use client'

import { useStackStore } from '@/lib/store/stack-visualizer-store'
import { cn } from '@/lib/utils'
import { StackFlowCanvas } from './stack-flow-canvas'

export function StackCanvas() {
  const { frames, currentFrame, stack: storeInput, algorithm } = useStackStore()
  const activeFrame = frames[currentFrame]

  // Use React Flow canvas for Valid Parentheses and Next Greater Element
  if (
    algorithm === 'VALID_PARENTHESES' ||
    algorithm === 'NEXT_GREATER_ELEMENT'
  ) {
    return <StackFlowCanvas />
  }

  // Input string/array being processed (for LARGEST_RECTANGLE, MIN_STACK)
  const inputArray = activeFrame ? activeFrame.array : storeInput
  const highlights = activeFrame?.highlights || []
  const secondaryHighlights = activeFrame?.secondaryHighlights || []
  const _pointers = activeFrame?.pointers || {}

  // Internal Stack State (from variables)
  const internalStack =
    (activeFrame?.variables?.stack as (string | number)[]) || []
  const minStack =
    (activeFrame?.variables?.minStack as (string | number)[]) || []
  const _stackTopIdx = internalStack.length - 1

  // Special view for Largest Rectangle
  if (algorithm === 'LARGEST_RECTANGLE') {
    const rect = activeFrame?.variables?.rect as
      | { start: number; end: number; height: number }
      | undefined

    return (
      <div className="flex h-full w-full flex-col items-center justify-between p-4 md:p-8 transition-colors overflow-hidden">
        <div className="w-full h-[400px] flex items-end justify-center gap-1 md:gap-2 px-4 relative">
          {(inputArray as number[]).map((height, idx) => {
            const isHighlighted = highlights.includes(idx)
            const isInStack = secondaryHighlights.includes(idx)
            const isInRect = rect && idx >= rect.start && idx <= rect.end

            return (
              <div
                key={`hist-${idx}`}
                className={cn(
                  'relative flex-1 max-w-[40px] rounded-t-md transition-all border-x border-t',
                  isHighlighted
                    ? 'bg-pink-500 border-pink-600 shadow-lg z-20'
                    : isInRect
                      ? 'bg-indigo-500/80 border-indigo-600 z-10'
                      : isInStack
                        ? 'bg-indigo-300 border-indigo-400 dark:bg-indigo-900/60 dark:border-indigo-800'
                        : 'bg-zinc-200 border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700'
                )}
                style={{ height: `${(height / 25) * 100}%` }}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-zinc-500">
                  {height}
                </div>
                {isHighlighted && (
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-pink-500" />
                    <span className="text-[8px] font-bold text-pink-500 mt-1 uppercase">
                      CUR
                    </span>
                  </div>
                )}
              </div>
            )
          })}

          {/* Rectangle Highlight Overlay */}
          {rect && (
            <div
              className="absolute bottom-0 border-4 border-dashed border-indigo-500 bg-indigo-500/20 rounded-lg pointer-events-none"
              style={{
                left: `calc(50% - ${(inputArray.length * 24) / 2}px + ${rect.start * 24}px)`,
                width: `${(rect.end - rect.start + 1) * 24}px`,
                height: `${(rect.height / 25) * 100}%`,
              }}
            />
          )}
        </div>

        {/* Internal Stack Visualization */}
        <div className="mt-16 w-full flex flex-col items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Monotonic Stack (Indices)
          </span>
          <div className="flex gap-2 min-h-[40px] items-center">
            {internalStack.map((idxVal, sIdx) => (
              <div
                key={`idx-stack-${sIdx}`}
                className="px-3 py-1 rounded bg-indigo-600 text-white font-mono text-xs font-bold animate-in slide-in-from-top-4 fade-in duration-300"
              >
                {idxVal}
              </div>
            ))}

            {internalStack.length === 0 && (
              <span className="text-xs text-zinc-400 italic">Empty</span>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Special view for Min Stack
  if (algorithm === 'MIN_STACK') {
    return (
      <div className="flex h-full w-full items-center justify-around p-4 md:p-8 gap-8 overflow-hidden">
        {/* Main Stack */}
        <div className="flex flex-col items-center gap-4 flex-1 max-w-[200px]">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
            Main Stack
          </span>
          <div className="relative flex flex-col items-center justify-end h-[300px] w-full border-b-4 border-l-4 border-r-4 border-zinc-200 dark:border-zinc-800 rounded-b-2xl bg-zinc-50/50 dark:bg-white/[0.02] p-4">
            <div className="flex flex-col-reverse gap-2 w-full">
              {internalStack.map((value, idx) => (
                <div
                  key={`main-${idx}`}
                  className="w-full h-10 flex items-center justify-center rounded-lg border-2 border-indigo-500 bg-indigo-500 text-white font-mono font-bold text-sm shadow-sm animate-in slide-in-from-top-6 fade-in duration-300"
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Min Stack */}
        <div className="flex flex-col items-center gap-4 flex-1 max-w-[200px]">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink-500">
            Min Stack
          </span>
          <div className="relative flex flex-col items-center justify-end h-[300px] w-full border-b-4 border-l-4 border-r-4 border-pink-200 dark:border-pink-900/50 rounded-b-2xl bg-pink-50/30 dark:bg-pink-950/10 p-4">
            <div className="flex flex-col-reverse gap-2 w-full">
              {minStack.map((value, idx) => (
                <div
                  key={`min-${idx}`}
                  className="w-full h-10 flex items-center justify-center rounded-lg border-2 border-pink-500 bg-pink-500 text-white font-mono font-bold text-sm shadow-sm animate-in slide-in-from-top-6 fade-in duration-300"
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Fallback: Valid Parentheses / NGE use React Flow (StackFlowCanvas) via early return
  return <StackFlowCanvas />
}
