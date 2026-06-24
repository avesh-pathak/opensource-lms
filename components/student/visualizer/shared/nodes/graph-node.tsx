'use client'

import React, { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { cn } from '@/lib/utils'

export interface GraphNodeData {
  label: string
  isCurrent?: boolean
  isVisited?: boolean
}

export const GraphNodeComponent = memo(
  ({ data, selected }: { data: GraphNodeData; selected?: boolean }) => {
    const { label, isCurrent, isVisited } = data

    return (
      <>
        <Handle type="target" position={Position.Top} className="opacity-0" />
        <Handle
          type="source"
          position={Position.Bottom}
          className="opacity-0"
        />
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-black transition-all shadow-lg',
            isCurrent &&
              'border-fuchsia-500 bg-fuchsia-500 text-white ring-4 ring-fuchsia-500/30',
            !isCurrent &&
              isVisited &&
              'border-fuchsia-400 bg-fuchsia-200 dark:bg-fuchsia-900/50 text-fuchsia-900 dark:text-white',
            !isCurrent &&
              !isVisited &&
              'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200',
            selected && 'ring-2 ring-fuchsia-500 ring-offset-2'
          )}
        >
          {label}
        </div>
      </>
    )
  }
)

GraphNodeComponent.displayName = 'GraphNode'
