'use client'

import React, { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { cn } from '@/lib/utils'

export interface StackNodeData {
  value: string | number
  index: number
  isTop: boolean
  /** Theme: indigo (default), pink, etc. */
  accent?: 'indigo' | 'pink'
}

const StackNodeComponent = memo(
  ({ data, selected }: { data: StackNodeData; selected?: boolean }) => {
    const { value, index, isTop, accent = 'indigo' } = data

    const isIndigo = accent === 'indigo'

    return (
      <div className="relative group">
        <Handle type="target" position={Position.Top} className="opacity-0" />

        <div
          className={cn(
            'w-[140px] h-12 flex items-center justify-between px-4 rounded-xl border-2 font-mono text-sm font-black shadow-lg transition-all animate-in slide-in-from-top-4 fade-in duration-300',
            'bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm',
            isTop
              ? isIndigo
                ? 'border-indigo-500 bg-indigo-500 text-white shadow-indigo-500/30 ring-4 ring-indigo-500/20'
                : 'border-pink-500 bg-pink-500 text-white shadow-pink-500/30 ring-4 ring-pink-500/20'
              : isIndigo
                ? 'border-indigo-200 bg-white text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/20 dark:text-indigo-300'
                : 'border-pink-200 bg-white text-pink-700 dark:border-pink-900/50 dark:bg-pink-950/20 dark:text-pink-300',
            selected &&
              'ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-black'
          )}
        >
          <span className="text-xs font-black uppercase opacity-50">
            [{index}]
          </span>
          <span className="font-black italic">{String(value)}</span>
          {isTop && (
            <span
              className={cn(
                'text-[10px] px-2 py-0.5 rounded uppercase tracking-tighter font-black',
                isIndigo ? 'bg-white/20' : 'bg-white/20'
              )}
            >
              TOP
            </span>
          )}
        </div>

        {/* Floating Top badge - rendered above node when isTop */}
        {isTop && (
          <div
            className={cn(
              'absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest text-white shadow-sm whitespace-nowrap animate-in slide-in-from-bottom-2 fade-in duration-300',
              isIndigo ? 'bg-indigo-500' : 'bg-pink-500'
            )}
          >
            Top
          </div>
        )}

        <Handle
          type="source"
          position={Position.Bottom}
          className="opacity-0"
        />
      </div>
    )
  }
)

StackNodeComponent.displayName = 'StackNode'

export { StackNodeComponent }
