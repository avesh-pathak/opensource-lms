'use client'

import { useStackStore } from '@/lib/store/stack-visualizer-store'
import { Timer } from 'lucide-react'
import { cn } from '@/lib/utils'

const COMPLEXITY_DATA = {
  VALID_PARENTHESES: {
    best: 'O(n)',
    average: 'O(n)',
    worst: 'O(n)',
    space: 'O(n)',
    description:
      'Uses a stack to keep track of opening brackets. Each character is pushed or popped exactly once.',
  },
  NEXT_GREATER_ELEMENT: {
    best: 'O(n)',
    average: 'O(n)',
    worst: 'O(n)',
    space: 'O(n)',
    description:
      "Monotonic stack maintains elements for which we haven't found the next greater element yet.",
  },
  LARGEST_RECTANGLE: {
    best: 'O(n)',
    average: 'O(n)',
    worst: 'O(n)',
    space: 'O(n)',
    description:
      'Uses a monotonic stack to find the nearest smaller element on both sides for each bar.',
  },
  MIN_STACK: {
    best: 'O(1)',
    average: 'O(1)',
    worst: 'O(1)',
    space: 'O(n)',
    description:
      'Standard stack modified to support O(1) retrieval of the minimum element, usually with a secondary value or stack.',
  },
}

export function StackComplexityCard() {
  const { algorithm } = useStackStore()
  const data =
    COMPLEXITY_DATA[algorithm as keyof typeof COMPLEXITY_DATA] ||
    COMPLEXITY_DATA.VALID_PARENTHESES

  return (
    <div
      key={algorithm}
      className="flex flex-col gap-3 p-4 rounded-3xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all"
    >
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-zinc-500 dark:text-zinc-400">
        <Timer className="h-3 w-3" />
        <span>Complexity Profile</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <ComplexityItem
          label="Time"
          value={data.worst}
          color="text-indigo-600 dark:text-indigo-400"
        />
        <ComplexityItem
          label="Space"
          value={data.space}
          color="text-amber-600 dark:text-amber-400"
        />
        <ComplexityItem
          label="Average"
          value={data.average}
          color="text-zinc-600 dark:text-zinc-400"
        />
      </div>

      <div className="h-px w-full bg-zinc-200 dark:bg-white/10 my-1" />

      <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
        {data.description}
      </p>
    </div>
  )
}

function ComplexityItem({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color: string
}) {
  return (
    <div className="flex flex-col items-center bg-white/40 dark:bg-white/5 rounded-xl p-2 border border-white/20 dark:border-white/10 shadow-sm">
      <span className="text-[9px] uppercase tracking-wider text-zinc-500 mb-1">
        {label}
      </span>
      <span className={cn('font-mono font-bold text-sm', color)}>{value}</span>
    </div>
  )
}
