'use client'

import React, { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { cn } from '@/lib/utils'

export interface RecursionNodeData {
  id: string
  name: string
  params?: Record<string, unknown>
  returnValue?: unknown
  depth: number
  status: 'active' | 'completed' | 'pending'
  /** For REC_SUBSETS: display as subset array */
  subset?: unknown[]
}

const RecursionNodeComponent = memo(
  ({ data, selected }: { data: RecursionNodeData; selected?: boolean }) => {
    const { name, returnValue, depth, status, subset } = data

    const isActive = status === 'active'
    const isCompleted = status === 'completed'

    return (
      <div className="relative group">
        <Handle type="target" position={Position.Top} className="opacity-0" />

        <div
          className={cn(
            'min-w-[120px] p-4 rounded-2xl border-2 transition-all shadow-xl animate-in zoom-in-95 fade-in duration-300',
            'bg-white/90 dark:bg-black/50 backdrop-blur-sm',
            isActive &&
              'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-300 ring-4 ring-rose-500/20',
            isCompleted &&
              'border-zinc-200 dark:border-white/10 bg-white dark:bg-black/40 text-zinc-600 dark:text-zinc-400',
            !isActive &&
              !isCompleted &&
              'border-zinc-100 dark:border-white/5 opacity-60',
            selected &&
              'ring-2 ring-rose-500 ring-offset-2 ring-offset-white dark:ring-offset-black'
          )}
        >
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-50 shrink-0">
              Depth {depth}
            </span>
            <span className="text-base font-black italic tracking-tighter shrink-0 break-all">
              {subset != null ? `[${(subset as unknown[]).join(', ')}]` : name}
            </span>
            {returnValue !== undefined && (
              <div className="mt-2 pt-2 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between gap-2">
                <span className="text-[9px] font-black uppercase opacity-50">
                  Ret:
                </span>
                <span className="text-sm font-black text-rose-600 dark:text-rose-400">
                  {String(returnValue)}
                </span>
              </div>
            )}
          </div>
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="opacity-0"
        />
      </div>
    )
  }
)

RecursionNodeComponent.displayName = 'RecursionNode'

export { RecursionNodeComponent }
