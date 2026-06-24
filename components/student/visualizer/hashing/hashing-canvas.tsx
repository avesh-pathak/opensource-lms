'use client'

import React from 'react'
import { useHashingStore } from '@/lib/store/hashing-visualizer-store'
import { HashBucket } from '@/lib/types/visualizer'
import { cn } from '@/lib/utils'

export function HashingCanvas() {
  const { algorithm: _algorithm, frames, currentFrame } = useHashingStore()
  const frame = frames[currentFrame]

  if (!frame)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-zinc-500 animate-pulse text-sm font-black uppercase tracking-[0.2em]">
          Initializing Hashing Canvas...
        </p>
      </div>
    )

  const {
    array,
    highlights,
    secondaryHighlights: _secondaryHighlights,
    pointers,
    variables,
  } = frame

  // Determine if we are rendering buckets or a simple array
  const isBucketView =
    Array.isArray(array) &&
    array.length > 0 &&
    typeof array[0] === 'object' &&
    'items' in array[0]
  const isStringArray =
    Array.isArray(array) && array.length > 0 && typeof array[0] === 'string'
  const buckets = isBucketView ? (array as HashBucket[]) : []
  const nums = !isBucketView && !isStringArray ? (array as number[]) : []
  const strings = isStringArray ? (array as string[]) : []

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col gap-12 p-8">
      {/* Input Array View (Always shown at top for context) */}
      <div className="flex flex-col gap-4">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 opacity-50">
          Input Sequence
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {(nums.length > 0
            ? nums
            : strings.length > 0
              ? strings
              : variables.nums || []
          ).map((item: any, idx: number) => {
            const isHighlighted = highlights.includes(idx)
            const isPointer = pointers.curr === idx || pointers.start === idx

            return (
              <div
                key={`${idx}-${item}`}
                className={cn(
                  'flex items-center justify-center min-w-[40px] h-10 rounded-xl border text-xs font-bold transition-all duration-200',
                  isHighlighted
                    ? 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20'
                    : isPointer
                      ? 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                      : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100'
                )}
              >
                {item}
              </div>
            )
          })}
        </div>
      </div>

      {/* Hash Table / Buckets View */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 opacity-50">
          Hash Table (Buckets)
        </span>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 overflow-y-auto pr-2 scrollbar-hide">
          {(buckets.length > 0
            ? buckets
            : Array.from({ length: 8 }, (_, i) => ({ index: i, items: [] }))
          ).map((bucket, bIdx) => {
            const isBucketHighlighted =
              highlights.includes(bIdx) && isBucketView

            return (
              <div key={bIdx} className="flex flex-col gap-2">
                <div
                  className={cn(
                    'h-8 rounded-lg border flex items-center justify-center text-[10px] font-bold uppercase tracking-widest',
                    isBucketHighlighted
                      ? 'border-amber-500 bg-amber-500/20 text-amber-600'
                      : 'border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-zinc-400'
                  )}
                >
                  Idx {bIdx}
                </div>
                <div className="min-h-[100px] rounded-xl border-2 border-dashed border-zinc-200 dark:border-white/10 p-2 flex flex-col gap-2 bg-zinc-50/50 dark:bg-white/2 backdrop-blur-sm">
                  {bucket.items.map((item, iIdx) => (
                    <div
                      key={`${item.key}-${iIdx}`}
                      className={cn(
                        'w-full py-2 rounded-lg border bg-white dark:bg-zinc-900 shadow-sm flex flex-col items-center justify-center gap-0.5 animate-in slide-in-from-top-4 fade-in duration-300',
                        item.isNew
                          ? 'border-amber-500 ring-2 ring-amber-500/20'
                          : 'border-zinc-200 dark:border-white/10'
                      )}
                    >
                      <span className="text-[10px] font-black italic">
                        {item.key}
                      </span>
                      <span className="text-[8px] opacity-50">
                        val: {item.value}
                      </span>
                    </div>
                  ))}
                  {bucket.items.length === 0 && (
                    <div className="flex-1 flex items-center justify-center opacity-10">
                      <span className="text-[10px] font-bold uppercase">
                        Empty
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
