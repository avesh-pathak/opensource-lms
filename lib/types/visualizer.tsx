import React from 'react'

export type AlgorithmType =
  | 'LINEAR_SEARCH'
  | 'BINARY_SEARCH'
  | 'BUBBLE_SORT'
  | 'SELECTION_SORT'
  | 'INSERTION_SORT'
  | 'MERGE_SORT'
  | 'QUICK_SORT'
  | 'PALINDROME_CHECK'
  | 'REVERSE_STRING'
  | 'LONGEST_SUBSTR'
  | 'TWO_POINTERS'
  | 'SLIDING_WINDOW'
  | 'LONGEST_SUBSTRING'
  | 'LONGEST_PALINDROMIC_SUBSTRING'
  | 'COUNT_PALINDROMIC_SUBSTRINGS'
  | 'LONGEST_COMMON_SUBSEQUENCE'
  // Stack
  | 'VALID_PARENTHESES'
  | 'NEXT_GREATER_ELEMENT'
  | 'LARGEST_RECTANGLE'
  | 'MIN_STACK'
  // Queue
  | 'SLIDING_WINDOW_MAX'
  | 'CIRCULAR_QUEUE'
  | 'TASK_SCHEDULING'
  | 'PRIORITY_QUEUE_SIM'
  // LinkedList
  | 'LL_REVERSE'
  | 'LL_DETECT_CYCLE'
  | 'LL_MERGE_SORTED'
  | 'LL_MIDDLE_NODE'
  // Trees
  | 'TREE_TRAVERSAL'
  | 'REC_FIBONACCI'
  | 'REC_TOWER_OF_HANOI'
  | 'REC_FACTORIAL'
  | 'REC_SUBSETS'
  | 'TREE_BFS'
  | 'TREE_LCA'
  | 'BST_OPERATIONS'
  | 'AVL_ROTATIONS'
  // Hashing
  | 'HASH_TWO_SUM'
  | 'HASH_CONSECUTIVE'
  | 'HASH_COLLISION'
  // Recursion
  | 'REC_SUBSETS'
  | 'REC_PERMUTATIONS'
  | 'REC_N_QUEENS'
  | 'REC_TOWER_OF_HANOI'
  // Heap
  | 'HEAP_INSERT'
  | 'HEAP_EXTRACT'
  | 'HEAP_HEAPIFY'
  | 'HEAP_SORT'
  | 'HEAP_BUILD'
  // Trie
  | 'TRIE_INSERT'
  | 'TRIE_SEARCH'
  | 'TRIE_PREFIX'
  | 'TRIE_DELETE'
  // Graph
  | 'GRAPH_BFS'
  | 'GRAPH_DFS'
  | 'GRAPH_DIJKSTRA'
  | 'GRAPH_TOPOLOGICAL'
  // DP
  | 'DP_FIBONACCI'
  | 'DP_CLIMB_STAIRS'
  | 'DP_KNAPSACK'
  | 'DP_LCS'
  | 'DP_COIN_CHANGE'
  | 'DP_SUBSET_SUM'
  // Backtracking
  | 'BT_SUBSETS'
  | 'BT_PERMUTATIONS'
  | 'BT_N_QUEENS'
  | 'BT_COMBINATION_SUM'
  // Greedy
  | 'GR_ACTIVITY_SELECTION'
  | 'GR_FRACTIONAL_KNAPSACK'
  | 'GR_JUMP_GAME'
  // Bit
  | 'BIT_AND_OR_XOR'
  | 'BIT_SHIFTS'
  | 'BIT_MASK'

export interface VisualizerFrame<T = any> {
  array: T[]
  highlights: number[]
  secondaryHighlights: number[]
  visited: number[]
  pointers: Record<string, number>
  explanation: string
  activeLine: number
  variables: Record<string, any>
  comparisons: number
  phase: 'search' | 'compare' | 'found' | 'not-found' | 'update'
  ranges?: { start: number; end: number; type: 'active' | 'discarded' }[]
  trace?: string
  sortedIndices?: number[]
  swappedIndices?: number[]
}

export interface HashBucket {
  index: number
  items: { key: string; value: any; color?: string; isNew?: boolean }[]
}

export interface RecursionNode {
  id: string
  name: string
  params: any
  returnValue?: any
  depth: number
  parentId: string | null
  status: 'active' | 'completed' | 'pending'
}

// SVG Icon Components
const ArrayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
)

const SortIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M8 6L8 18M8 6L4 10M8 6L12 10" />
    <path d="M16 18L16 6M16 18L12 14M16 18L20 14" />
  </svg>
)

const StringIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
)

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

const LinkedListIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="5" cy="12" r="3" />
    <circle cx="19" cy="12" r="3" />
    <path d="M8 12h8" />
  </svg>
)

const StackIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="6" y="4" width="12" height="4" />
    <rect x="6" y="10" width="12" height="4" />
    <rect x="6" y="16" width="12" height="4" />
  </svg>
)

const QueueIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="8" width="18" height="8" rx="1" />
    <path d="M7 12h10M14 9l3 3-3 3" />
  </svg>
)

const HashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M4 9h16M4 15h16M9 4v16M15 4v16" />
  </svg>
)

const RecursionIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M21 21v-5h-5" />
  </svg>
)

const TreeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="4" r="2" />
    <circle cx="6" cy="12" r="2" />
    <circle cx="18" cy="12" r="2" />
    <circle cx="6" cy="20" r="2" />
    <circle cx="18" cy="20" r="2" />
    <path d="M12 6v4M10 12l-2-2M14 12l2-2M8 14l-2 4M16 14l2 4" />
  </svg>
)

const HeapIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 2l8 20H4L12 2z" />
  </svg>
)

const GraphIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="5" cy="5" r="3" />
    <circle cx="19" cy="5" r="3" />
    <circle cx="12" cy="19" r="3" />
    <path d="M8 5h8M7 7l4 10M17 7l-4 10" />
  </svg>
)

const GreedyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
)

const DPIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
  </svg>
)

const BacktrackIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 12h18M3 12l6-6M3 12l6 6" />
  </svg>
)

const BitIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <rect x="8" y="10" width="8" height="4" rx="1" />
    <rect x="8" y="18" width="8" height="4" rx="1" />
  </svg>
)

const WindowIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18" />
  </svg>
)

const PointerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M5 12h14M5 12l4-4M5 12l4 4M19 12l-4-4M19 12l-4 4" />
  </svg>
)

// Algorithm data with proper typing
export interface AlgorithmData {
  title: string
  subtitle: string
  description: string
  icon: React.ReactElement
  textColor: string
  bgColor: string
  href: string
  slug: string
}

export const ALGORITHMS: AlgorithmData[] = [
  {
    title: 'Arrays',
    subtitle: 'Sliding Window • Prefix Sum',
    description:
      'Master the fundamentals of memory layout and pointer manipulation.',
    icon: <ArrayIcon />,
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-600',
    href: '/visualizer/array',
    slug: 'array',
  },
  {
    title: 'Sorting',
    subtitle: 'Merge • Quick • Heap',
    description:
      'Visualize the divide and conquer strategies that power modern databases.',
    icon: <SortIcon />,
    textColor: 'text-green-600',
    bgColor: 'bg-green-600',
    href: '/visualizer/sorting',
    slug: 'sorting',
  },
  {
    title: 'String',
    subtitle: 'KMP • Rabin-Karp',
    description:
      'Uncover hidden patterns in text using advanced string matching algorithms.',
    icon: <StringIcon />,
    textColor: 'text-rose-600',
    bgColor: 'bg-rose-600',
    href: '/visualizer/string',
    slug: 'string',
  },
  {
    title: 'Searching',
    subtitle: 'Binary • Linear',
    description: 'Find the needle in the haystack with O(log n) efficiency.',
    icon: <SearchIcon />,
    textColor: 'text-yellow-600',
    bgColor: 'bg-yellow-600',
    href: '/visualizer/searching',
    slug: 'searching',
  },
  {
    title: 'Linked List',
    subtitle: 'Singly • Doubly • Cycle',
    description:
      'Wire and re-wire nodes dynamically to understand pointer logic.',
    icon: <LinkedListIcon />,
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-600',
    href: '/visualizer/linked-list',
    slug: 'linked-list',
  },
  {
    title: 'Stack',
    subtitle: 'LIFO • Monotonic',
    description:
      'Push and pop your way through expression parsing and history management.',
    icon: <StackIcon />,
    textColor: 'text-indigo-600',
    bgColor: 'bg-indigo-600',
    href: '/visualizer/stack',
    slug: 'stack',
  },
  {
    title: 'Queue',
    subtitle: 'FIFO • Priority Deque',
    description:
      'Manage scheduling and buffering tasks with first-in-first-out logic.',
    icon: <QueueIcon />,
    textColor: 'text-orange-600',
    bgColor: 'bg-orange-600',
    href: '/visualizer/queue',
    slug: 'queue',
  },
  {
    title: 'Hashing',
    subtitle: 'Maps • Sets • Collision',
    description: 'Learn how constant time lookups work under the hood.',
    icon: <HashIcon />,
    textColor: 'text-pink-600',
    bgColor: 'bg-pink-600',
    href: '/visualizer/hashing',
    slug: 'hashing',
  },
  {
    title: 'Recursion',
    subtitle: 'Base Case • Call Stack',
    description:
      'The art of solving a problem by solving smaller instances of itself.',
    icon: <RecursionIcon />,
    textColor: 'text-cyan-600',
    bgColor: 'bg-cyan-600',
    href: '/visualizer/recursion',
    slug: 'recursion',
  },
  {
    title: 'Trees',
    subtitle: 'BST • AVL • Traversal',
    description:
      'Navigate hierarchical data structures with recursive elegance.',
    icon: <TreeIcon />,
    textColor: 'text-emerald-600',
    bgColor: 'bg-emerald-600',
    href: '/visualizer/trees',
    slug: 'trees',
  },
  {
    title: 'Heaps',
    subtitle: 'Min-Heap • Max-Heap',
    description:
      'Efficiently manage priority data for scheduling and graph algorithms.',
    icon: <HeapIcon />,
    textColor: 'text-amber-600',
    bgColor: 'bg-amber-600',
    href: '/visualizer/heaps',
    slug: 'heaps',
  },
  {
    title: 'Tries',
    subtitle: 'Prefix Tree • Autocomplete',
    description: 'Optimize dictionary searches and prefix matching.',
    icon: <TreeIcon />,
    textColor: 'text-lime-600',
    bgColor: 'bg-lime-600',
    href: '/visualizer/tries',
    slug: 'tries',
  },
  {
    title: 'Graphs',
    subtitle: 'BFS • DFS • Dijkstra',
    description: 'Model real-world connections and find the shortest paths.',
    icon: <GraphIcon />,
    textColor: 'text-fuchsia-600',
    bgColor: 'bg-fuchsia-600',
    href: '/visualizer/graphs',
    slug: 'graphs',
  },
  {
    title: 'Greedy',
    subtitle: 'Activity Selection • Huffman',
    description: 'Make locally optimal choices to find a global optimum.',
    icon: <GreedyIcon />,
    textColor: 'text-teal-600',
    bgColor: 'bg-teal-600',
    href: '/visualizer/greedy',
    slug: 'greedy',
  },
  {
    title: 'Dynamic Programming',
    subtitle: 'Memoization • Tabulation',
    description: 'Break down complex problems into overlapping subproblems.',
    icon: <DPIcon />,
    textColor: 'text-violet-600',
    bgColor: 'bg-violet-600',
    href: '/visualizer/dp',
    slug: 'dp',
  },
  {
    title: 'Backtracking',
    subtitle: 'N-Queens • Sudoku',
    description:
      'Explore all potential solutions by building candidates incrementally.',
    icon: <BacktrackIcon />,
    textColor: 'text-red-600',
    bgColor: 'bg-red-600',
    href: '/visualizer/backtracking',
    slug: 'backtracking',
  },
  {
    title: 'Bit Manipulation',
    subtitle: 'XOR • Shifts • Masks',
    description: 'Operate directly on binary data for extreme performance.',
    icon: <BitIcon />,
    textColor: 'text-sky-600',
    bgColor: 'bg-sky-600',
    href: '/visualizer/bit-manipulation',
    slug: 'bit-manipulation',
  },
  {
    title: 'Sliding Window',
    subtitle: 'Fixed • Dynamic',
    description: 'Efficiently process subarrays without re-computing.',
    icon: <WindowIcon />,
    textColor: 'text-stone-600',
    bgColor: 'bg-stone-600',
    href: '/visualizer/sliding-window',
    slug: 'sliding-window',
  },
  {
    title: 'Two Pointers',
    subtitle: 'Collision • Parallel',
    description:
      'Traverse data from multiple directions to reduce time complexity.',
    icon: <PointerIcon />,
    textColor: 'text-zinc-600',
    bgColor: 'bg-zinc-600',
    href: '/visualizer/two-pointers',
    slug: 'two-pointers',
  },
]
