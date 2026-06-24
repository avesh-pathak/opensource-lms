'use client'

import { useVisualizerStore } from '@/lib/store/array-visualizer-store'
import { Timer } from 'lucide-react'
import { cn } from '@/lib/utils'

const COMPLEXITY_DATA = {
  LINEAR_SEARCH: {
    best: 'O(1)',
    average: 'O(n)',
    worst: 'O(n)',
    space: 'O(1)',
    description:
      'Checks each element sequentially until the target is found or the end is reached.',
  },
  BINARY_SEARCH: {
    best: 'O(1)',
    average: 'O(log n)',
    worst: 'O(log n)',
    space: 'O(1)',
    description:
      'Divide and conquer. Repeatedly divides the search interval in half. Requires sorted array.',
  },
  TWO_POINTERS: {
    best: 'O(n)',
    average: 'O(n)',
    worst: 'O(n)',
    space: 'O(1)',
    description: '',
  },
  SLIDING_WINDOW: {
    best: 'O(n)',
    average: 'O(n)',
    worst: 'O(n)',
    space: 'O(1)',
    description: '',
  },
  BUBBLE_SORT: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    description:
      'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
  },
  SELECTION_SORT: {
    best: 'O(n²)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    description:
      'Divides the list into two parts: the sorted part at the left end and the unsorted part at the right end.',
  },
  INSERTION_SORT: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    description:
      'Builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms.',
  },
  MERGE_SORT: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(n)',
    description:
      'Divide and conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.',
  },
  QUICK_SORT: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n²)',
    space: 'O(log n)',
    description:
      'Divide and conquer algorithm. It picks an element as pivot and partitions the given array around the picked pivot.',
  },
  PALINDROME_CHECK: {
    best: 'O(1)',
    average: 'O(n)',
    worst: 'O(n)',
    space: 'O(1)',
    description:
      'Checks if a string reads the same forwards and backwards by comparing characters from both ends moving inward.',
  },
  LONGEST_SUBSTRING: {
    best: 'O(n)',
    average: 'O(n)',
    worst: 'O(n)',
    space: 'O(min(n, m))',
    description:
      'Finds the length of the longest substring without repeating characters using a sliding window approach.',
  },
  LONGEST_PALINDROMIC_SUBSTRING: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    description:
      'Finds the longest palindromic substring in s. Expansion around center approach is used here.',
  },
  COUNT_PALINDROMIC_SUBSTRINGS: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    description:
      'Counts the number of palindromic substrings in a string. Expands around every possible center.',
  },
  LONGEST_COMMON_SUBSEQUENCE: {
    best: 'O(n*m)',
    average: 'O(n*m)',
    worst: 'O(n*m)',
    space: 'O(n*m)',
    description:
      'Finds the longest subsequence present in both strings. (Visualization pending implementation).',
  },
}

export function ComplexityCard() {
  const { algorithm } = useVisualizerStore()
  const data =
    COMPLEXITY_DATA[algorithm as keyof typeof COMPLEXITY_DATA] ||
    COMPLEXITY_DATA.LINEAR_SEARCH

  return (
    <div
      key={algorithm}
      className="flex flex-col gap-3 p-4 rounded-3xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all"
    >
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-zinc-500 dark:text-zinc-400">
        <Timer className="h-3 w-3" />
        <span>Time Complexity</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <ComplexityItem
          label="Best"
          value={data.best}
          color="text-emerald-600 dark:text-emerald-400"
        />
        <ComplexityItem
          label="Average"
          value={data.average}
          color="text-amber-600 dark:text-amber-400"
        />
        <ComplexityItem
          label="Worst"
          value={data.worst}
          color="text-rose-600 dark:text-rose-400"
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
