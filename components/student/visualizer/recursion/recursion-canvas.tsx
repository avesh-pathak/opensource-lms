'use client'

import React, { useRef } from 'react'
import { useRecursionStore } from '@/lib/store/recursion-visualizer-store'
import { RecursionNode } from '@/lib/types/visualizer'
import { cn } from '@/lib/utils'
import { gsap } from 'gsap'
import { Flip } from 'gsap/all'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(Flip, useGSAP)

export function RecursionCanvas() {
  const { algorithm, frames, currentFrame } = useRecursionStore()
  const frame = frames[currentFrame]

  const containerRef = useRef<HTMLDivElement>(null)
  const flipState = useRef<Flip.FlipState | null>(null)

  useGSAP(
    () => {
      if (!frame) return
      const { array } = frame
      if (!containerRef.current || algorithm !== 'REC_TOWER_OF_HANOI') return

      const targets = gsap.utils.toArray<HTMLElement>('.hanoi-disk')
      if (targets.length === 0) return

      if (flipState.current) {
        Flip.from(flipState.current, {
          duration: 0.5,
          ease: 'power2.inOut',
          targets: targets,
          absolute: true,
          nested: true,
        })
      }

      flipState.current = Flip.getState(targets)
    },
    { dependencies: [frame?.array, currentFrame], scope: containerRef }
  )

  if (!frame)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-zinc-500 animate-pulse text-sm font-black uppercase tracking-[0.2em]">
          Initializing Recursion Canvas...
        </p>
      </div>
    )

  const { array, pointers, variables: _variables } = frame

  // Tower of Hanoi View
  if (algorithm === 'REC_TOWER_OF_HANOI') {
    const hanoiState = array[0] as any
    if (!hanoiState) return null

    return (
      <div
        ref={containerRef}
        className="relative w-full h-full flex items-end justify-center gap-12 p-12 overflow-hidden"
      >
        {['A', 'B', 'C'].map((peg) => (
          <div key={peg} className="relative flex flex-col items-center group">
            {/* Peg Label */}
            <span className="absolute -top-12 text-sm font-black italic opacity-30 group-hover:opacity-100 transition-opacity">
              Peg {peg}
            </span>

            {/* The Peg itself */}
            <div className="w-2 md:w-4 h-48 md:h-64 bg-zinc-200 dark:bg-white/10 rounded-t-full relative z-0 shadow-inner" />

            {/* Ground/Base */}
            <div className="w-24 md:w-32 h-2 bg-zinc-300 dark:bg-white/20 rounded-full" />

            {/* Disks */}
            <div className="absolute bottom-2 flex flex-col-reverse items-center z-10">
              {hanoiState[peg].map((disk: number, _idx: number) => (
                <div
                  key={disk}
                  data-flip-id={`hanoi-disk-${disk}`}
                  className={cn(
                    'hanoi-disk h-6 md:h-8 rounded-full border-2 shadow-lg mb-0.5 transition-colors',
                    disk === 1
                      ? 'bg-rose-500 border-rose-600'
                      : disk === 2
                        ? 'bg-amber-500 border-amber-600'
                        : disk === 3
                          ? 'bg-emerald-500 border-emerald-600'
                          : 'bg-indigo-500 border-indigo-600'
                  )}
                  style={{ width: (disk + 1) * 30 }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-[10px] font-black text-white">
                      {disk}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pointer label for moving from/to */}
            {String(pointers.from) === peg && (
              <div className="absolute -bottom-8 px-2 py-0.5 rounded-md bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest">
                From
              </div>
            )}
            {String(pointers.to) === peg && (
              <div className="absolute -bottom-8 px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest">
                To
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  // Default Node/Tree/Stack View for other algorithms
  return (
    <div className="relative w-full h-full overflow-hidden p-8 flex flex-col gap-8">
      <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-white/10 pb-4">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 opacity-50">
          Call Trace & State
        </span>
      </div>

      <div className="flex-1 overflow-x-auto scrollbar-hide">
        <div className="flex flex-wrap gap-4 items-start justify-center">
          {(array as RecursionNode[]).map((node, idx) => {
            const _isCurrent = idx === array.length - 1
            return (
              <div
                key={node.id}
                className={cn(
                  'min-w-[120px] p-4 rounded-3xl border-2 transition-all shadow-xl group animate-in zoom-in-75 fade-in duration-300',
                  (node as RecursionNode).status === 'active'
                    ? 'border-rose-500 bg-rose-500/10 text-rose-600 ring-4 ring-rose-500/20'
                    : (node as RecursionNode).status === 'completed'
                      ? 'border-zinc-200 dark:border-white/10 bg-white dark:bg-black/40 text-zinc-400'
                      : 'border-zinc-100 dark:border-white/5 opacity-50'
                )}
                style={{
                  marginLeft: ((node as RecursionNode).depth ?? 0) * 20,
                }}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-50 shrink-0">
                    {algorithm === 'REC_SUBSETS'
                      ? `Subset ${idx + 1}`
                      : `Depth ${(node as RecursionNode).depth ?? 0}`}
                  </span>
                  <span className="text-lg font-black italic tracking-tighter shrink-0">
                    {algorithm === 'REC_SUBSETS'
                      ? `[${(node as unknown as number[]).join(', ')}]`
                      : (node as RecursionNode).name}
                  </span>
                  {(node as RecursionNode).returnValue !== undefined && (
                    <div className="mt-2 pt-2 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase opacity-30">
                        Ret:
                      </span>
                      <span className="text-sm font-black text-rose-600 dark:text-rose-400">
                        {node.returnValue}
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
