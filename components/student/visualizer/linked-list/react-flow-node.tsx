import React, { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { cn } from '@/lib/utils'

// Reusing the exact design from linked-list-canvas.tsx
export const LinkedListNodeComponent = memo(({ data, selected }: any) => {
  const {
    value,
    index,
    pointers = {},
    isCurrent,
    isDragStart,
    _accentColor = 'purple',
  } = data

  // determine colors based on state
  // 'slow' | 'prev' -> amber
  // 'fast' | 'curr' -> purple/indigo based on role
  // We will use the passed accents or defaults

  return (
    <div className="relative group">
      {/* Incoming Handle (Null because we control edges programmatically, but needed for layout) */}
      <Handle type="target" position={Position.Left} className="opacity-0" />

      <div
        className={cn(
          'w-20 h-20 rounded-2xl flex flex-col items-center justify-center border-2 transition-all shadow-xl z-10 bg-white/80 dark:bg-black/40 backdrop-blur-sm animate-in zoom-in duration-300',
          isCurrent
            ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-300 ring-4 ring-purple-500/20'
            : 'border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100',
          selected &&
            'ring-2 ring-purple-500 ring-offset-2 ring-offset-white dark:ring-offset-black',
          isDragStart && 'ring-2 ring-purple-500 ring-offset-2'
        )}
      >
        {/* Memory Address Label */}
        <span className="text-xs font-black uppercase tracking-tighter opacity-30 absolute -top-6">
          0x{index?.toString(16) || '??'}
        </span>

        {/* Value */}
        <span className="text-2xl font-black italic">{value}</span>

        {/* Connector Handle Visual (Purely cosmetic/interactive trigger in old version, now maybe just visual) */}
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-full flex items-center justify-center transition-transform z-20 group-hover:border-purple-500">
          <div className="w-2 h-2 bg-zinc-400 rounded-full" />
        </div>
      </div>

      {/* Pointer Labels (Correctly animated) */}
      <div className="absolute -bottom-10 w-full flex flex-col items-center gap-1 pointer-events-none">
        {Object.entries(pointers).map(
          ([name, pIdx]) =>
            pIdx === index && (
              <div
                key={name}
                className={cn(
                  'px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest text-white shadow-sm whitespace-nowrap',
                  'animate-in slide-in-from-bottom-2 fade-in duration-300',
                  name === 'slow' || name === 'prev'
                    ? 'bg-amber-500'
                    : 'bg-purple-500',
                  name === 'fast' || name === 'curr' ? 'bg-indigo-500' : ''
                )}
              >
                {name}
              </div>
            )
        )}
      </div>

      {/* Outgoing Handle */}
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  )
})

LinkedListNodeComponent.displayName = 'LinkedListNode'
