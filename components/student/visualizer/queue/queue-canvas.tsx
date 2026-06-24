'use client'

import React from 'react'
import { useQueueStore } from '@/lib/store/queue-visualizer-store'
import { cn } from '@/lib/utils'

export function QueueCanvas() {
  const { algorithm, frames, currentFrame } = useQueueStore()
  const frame = frames[currentFrame]

  if (!frame)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-zinc-500 animate-pulse text-sm font-black uppercase tracking-[0.2em]">
          Initializing Queue Canvas...
        </p>
      </div>
    )

  const { array, highlights, secondaryHighlights, pointers, variables } = frame

  // Specialized renderers based on algorithm
  if (algorithm === 'SLIDING_WINDOW_MAX') {
    const deque = variables.deque || []
    const result = variables.result || []
    const windowIdx = pointers.i !== undefined ? pointers.i : -1
    const k = variables.k || 3

    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-8 gap-12">
        {/* Input Array */}
        <div className="flex flex-col items-center gap-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            Input Stream
          </span>
          <div className="flex gap-2">
            {array.map((val: any, idx: number) => {
              const isInWindow =
                windowIdx >= 0 && idx > windowIdx - k && idx <= windowIdx
              return (
                <div
                  key={`input-${idx}`}
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm border-2 transition-all animate-in zoom-in-75 fade-in duration-300',
                    isInWindow
                      ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400'
                      : 'border-zinc-200 dark:border-white/5 text-zinc-400',
                    idx === windowIdx && 'ring-4 ring-orange-500/20 scale-110'
                  )}
                >
                  {val}
                </div>
              )
            })}
          </div>
        </div>

        {/* Deque & Results Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 w-full max-w-4xl">
          {/* Monotonic Deque */}
          <div className="flex flex-col items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Monotonic Deque (Indices)
            </span>
            <div className="flex items-center gap-2 min-h-[60px] p-4 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-white/10 bg-white/40 dark:bg-black/20">
              {deque.map((idx: number) => (
                <div
                  key={`deque-${idx}`}
                  className="w-10 h-10 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold shadow-lg shadow-orange-500/20 animate-in slide-in-from-right-6 fade-in duration-300"
                >
                  {idx}
                </div>
              ))}
              {deque.length === 0 && (
                <span className="text-xs text-zinc-500 italic">Empty</span>
              )}
            </div>
          </div>

          {/* Result Array */}
          <div className="flex flex-col items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
              Max Result
            </span>
            <div className="flex gap-2">
              {result.map((val: number, idx: number) => (
                <div
                  key={`res-${idx}`}
                  className="w-12 h-12 rounded-xl border-2 border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold animate-in slide-in-from-top-6 fade-in duration-300"
                >
                  {val}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (algorithm === 'CIRCULAR_QUEUE') {
    const head = pointers.head ?? -1
    const tail = pointers.tail ?? -1
    const size = variables.size || 5

    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <div className="relative w-80 h-80 rounded-full border-4 border-dashed border-zinc-200 dark:border-white/10 flex items-center justify-center">
          {array.map((val: any, idx: number) => {
            const angle = (idx / size) * 2 * Math.PI - Math.PI / 2
            const x = Math.cos(angle) * 120
            const y = Math.sin(angle) * 120

            return (
              <div
                key={`circular-${idx}`}
                style={{ x, y }}
                className={cn(
                  'absolute w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg border-2 transition-all shadow-xl animate-in zoom-in-50 fade-in duration-300',
                  val !== null
                    ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-300'
                    : 'border-zinc-200 dark:border-white/5 bg-zinc-100/50 dark:bg-white/5/5 text-zinc-300',
                  idx === head && 'ring-4 ring-indigo-500/30 scale-110',
                  idx === tail && 'ring-4 ring-orange-500/30'
                )}
              >
                {val ?? ''}

                {idx === head && (
                  <div className="absolute text-[10px] font-black uppercase text-indigo-500 whitespace-nowrap">
                    HEAD
                  </div>
                )}
                {idx === tail && (
                  <div className="absolute text-[10px] font-black uppercase text-orange-500 whitespace-nowrap">
                    TAIL
                  </div>
                )}
              </div>
            )
          })}
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black italic tracking-tighter text-zinc-900 dark:text-zinc-100">
              RING
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Buffer
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (algorithm === 'TASK_SCHEDULING') {
    const queue = variables.queue || []
    const completed = variables.completedTasks || []
    const activeTask = variables.activeTask

    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-8 gap-12">
        {/* Ready Queue */}
        <div className="flex flex-col items-center gap-4 w-full">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            Process Ready Queue
          </span>
          <div className="flex gap-4 p-6 rounded-[2rem] border-2 border-dashed border-zinc-200 dark:border-white/10 bg-white/40 dark:bg-black/20 min-h-[100px] items-center">
            {queue.map((task: any) => (
              <div
                key={task.id}
                className="px-6 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 shadow-lg flex items-center gap-3 animate-in slide-in-from-right-8 fade-in duration-300"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center font-black text-xs">
                  P{task.id}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                    Burst
                  </span>
                  <span className="text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100">
                    {task.burst}ms
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CPU Center */}
        <div className="flex items-center gap-12">
          <div className="w-1 px-4 h-24 bg-zinc-200 dark:bg-white/10 rounded-full" />
          <div className="flex flex-col items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 animate-pulse">
              Active CPU Core
            </span>
            <div className="w-40 h-40 rounded-[2.5rem] border-4 border-orange-500/20 bg-orange-500/5 flex items-center justify-center relative overflow-hidden group">
              {activeTask ? (
                <div
                  key={activeTask.id}
                  className="flex flex-col items-center animate-in slide-in-from-left-8 fade-in duration-300"
                >
                  <div className="text-4xl font-black italic text-orange-500 tracking-tighter">
                    P{activeTask.id}
                  </div>
                  <div className="text-[10px] font-black text-zinc-500 uppercase">
                    Executing
                  </div>
                </div>
              ) : (
                <span className="text-xs text-zinc-400 italic">IDLE</span>
              )}

              {/* Spinning Glow */}
              {activeTask && (
                <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent,orange)] opacity-20 animate-spin-slow pointer-events-none" />
              )}
            </div>
          </div>
          <div className="w-1 px-4 h-24 bg-zinc-200 dark:bg-white/10 rounded-full" />
        </div>

        {/* Completed */}
        <div className="flex flex-col items-center gap-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
            Terminated Processes
          </span>
          <div className="flex gap-2">
            {completed.map((id: number) => (
              <div
                key={id}
                className="w-10 h-10 rounded-full border-2 border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xs animate-in slide-in-from-bottom-4 fade-in duration-300"
              >
                P{id}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (algorithm === 'PRIORITY_QUEUE_SIM') {
    const heap = variables.heap || []

    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-8 gap-12">
        <div className="flex flex-col items-center gap-8">
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 whitespace-nowrap">
            Min-Heap Array Representation
          </span>
          <div className="flex gap-2 flex-wrap justify-center max-w-2xl">
            {heap.map((val: number, idx: number) => {
              const _isNew = idx === heap.length - 1 && highlights.includes(idx)
              return (
                <div
                  key={`heap-slot-${idx}`}
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm border-2 transition-all animate-in zoom-in-75 fade-in duration-300',
                    highlights.includes(idx)
                      ? 'border-orange-500 bg-orange-500/20 text-orange-600 dark:text-orange-400 shadow-lg shadow-orange-500/10'
                      : 'border-zinc-200 dark:border-white/5 bg-white/40 dark:bg-black/20 text-zinc-500',
                    secondaryHighlights.includes(idx) &&
                      'border-indigo-500 bg-indigo-500/10 text-indigo-600'
                  )}
                >
                  <div className="flex flex-col items-center leading-none">
                    <span className="text-[8px] opacity-40 mb-1">{idx}</span>
                    {val}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Visual Heap Layout (Optional but nice) */}
          <div className="mt-8 relative flex flex-col items-center h-48">
            {/* Simple visual representation of heap hierarchy */}
            <div className="flex flex-col items-center gap-12">
              <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic opacity-50">
                Hierarchical Map
              </div>
              <div className="flex gap-16">
                {heap.length > 0 && (
                  <div className="w-14 h-14 rounded-full border-4 border-orange-500 flex items-center justify-center font-black text-lg bg-orange-500/10">
                    {heap[0]}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default view
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8">
      <span className="text-sm font-black text-zinc-400 uppercase italic">
        Select an algorithm to visualize
      </span>
    </div>
  )
}
