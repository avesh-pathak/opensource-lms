'use client'

import React, { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { cn } from '@/lib/utils'

export interface TreeValueNodeData {
  id: string
  value: number
  isCurrent?: boolean
  isVisited?: boolean
  isSecondary?: boolean
}

const _TREE_NODE_SIZE = 56

const TreeValueNodeComponent = memo(
  ({ data, selected }: { data: TreeValueNodeData; selected?: boolean }) => {
    const { value, isCurrent, isVisited, isSecondary } = data

    return (
      <div className="relative">
        <Handle
          type="target"
          position={Position.Top}
          className="opacity-0 w-2 h-2"
        />
        <div
          className={cn(
            'flex items-center justify-center rounded-xl border-2 font-black text-lg transition-all shadow-lg',
            'w-14 h-14 min-w-[56px] min-h-[56px]',
            isCurrent &&
              'border-emerald-500 bg-emerald-500 text-white ring-4 ring-emerald-500/30 scale-110',
            isSecondary &&
              !isCurrent &&
              'border-amber-500 bg-amber-500/20 text-amber-700 dark:text-amber-300',
            isVisited &&
              !isCurrent &&
              !isSecondary &&
              'border-emerald-300 dark:border-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200',
            !isCurrent &&
              !isVisited &&
              !isSecondary &&
              'border-zinc-200 dark:border-white/20 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200',
            selected && 'ring-2 ring-emerald-500 ring-offset-2'
          )}
        >
          {value}
        </div>
        <Handle
          type="source"
          position={Position.Bottom}
          className="opacity-0 w-2 h-2"
        />
      </div>
    )
  }
)

TreeValueNodeComponent.displayName = 'TreeValueNode'

export { TreeValueNodeComponent }
