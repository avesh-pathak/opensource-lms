'use client'

import { useVisualizerStore } from '@/lib/store/array-visualizer-store'
import { Cpu, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MemoryInspector() {
  const { array, frames, currentFrame } = useVisualizerStore()
  const frame = frames[currentFrame]

  // Only show if we actually have data
  if (!array || array.length === 0) return null

  // Derived pointers for highlighting
  const activeIndices = frame?.highlights || []
  const left = frame?.pointers?.left
  const right = frame?.pointers?.right
  const mid = frame?.pointers?.mid

  // Fake base memory address
  const _BASE_ADDR = 0x1000
  const _ELEMENT_SIZE = 4 // 4 bytes for integer

  return (
    <div className="flex flex-col gap-2 p-4 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-2">
        <Cpu className="h-3 w-3 text-zinc-400" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          Memory View (Contiguous)
        </span>
      </div>

      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-hide mask-fade">
        {array.map((value, idx) => {
          const isHighlighted = activeIndices.includes(idx) // Changed from highlights to activeIndices
          // Generate a mock hex address: 0x1000 + (idx * 4)
          const address = `0x${(4096 + idx * 4).toString(16).toUpperCase()}`

          return (
            <div key={idx} className="flex flex-col items-center gap-1">
              <span className="text-[9px] font-mono text-zinc-400">
                {address}
              </span>
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-bold font-mono transition-colors relative', // Added relative for absolute positioning of idx
                  isHighlighted
                    ? 'bg-blue-500/20 border-blue-500 text-blue-500'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500'
                )}
              >
                {value}
                <span className="absolute bottom-0.5 right-1 text-[8px] opacity-40">
                  {idx}
                </span>
              </div>
              {/* Pointer Indicators (Under memory) - Re-added from original logic */}
              <div className="h-4 relative w-full flex justify-center">
                {left === idx && (
                  <div className="absolute top-1 text-[8px] font-bold text-blue-500">
                    L
                  </div>
                )}
                {right === idx && (
                  <div className="absolute top-1 text-[8px] font-bold text-blue-500">
                    R
                  </div>
                )}
                {mid === idx && (
                  <div className="absolute top-1 text-[8px] font-bold text-orange-500">
                    M
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Contiguous Hint */}
        <div className="ml-4 flex items-center gap-2 text-[10px] text-zinc-400 italic opacity-50">
          <ArrowRight className="w-3 h-3" />
          Next Address = Prev + 4
        </div>
      </div>
    </div>
  )
}
