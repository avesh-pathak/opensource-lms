import React from 'react'

// SVG Icon Components
export const ArrayIcon: React.FC<{ className?: string }> = ({ className }) => (
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

export const SortIcon: React.FC<{ className?: string }> = ({ className }) => (
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

export const StringIcon: React.FC<{ className?: string }> = ({ className }) => (
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

export const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
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

export const LinkedListIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
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

export const StackIcon: React.FC<{ className?: string }> = ({ className }) => (
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

export const QueueIcon: React.FC<{ className?: string }> = ({ className }) => (
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

export const HashIcon: React.FC<{ className?: string }> = ({ className }) => (
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

export const RecursionIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
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

export const TreeIcon: React.FC<{ className?: string }> = ({ className }) => (
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

export const HeapIcon: React.FC<{ className?: string }> = ({ className }) => (
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

export const GraphIcon: React.FC<{ className?: string }> = ({ className }) => (
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

export const GreedyIcon: React.FC<{ className?: string }> = ({ className }) => (
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

export const DPIcon: React.FC<{ className?: string }> = ({ className }) => (
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

export const BacktrackIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
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

export const BitIcon: React.FC<{ className?: string }> = ({ className }) => (
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

export const WindowIcon: React.FC<{ className?: string }> = ({ className }) => (
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

export const PointerIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
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

export interface AlgorithmData {
  title: string
  subtitle: string
  description: string
  icon: React.ReactElement
  textColor: string
  bgColor: string
  href: string
  slug: string
  isLocked?: boolean
}

export const ALGORITHMS: AlgorithmData[] = [
  {
    title: 'Arrays',
    subtitle:
      'Sliding Window • Prefix Sum • Kadane • Two Pointers • Subarray Sum • Dutch Flag',
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
    subtitle: 'Merge • Quick • Heap • Counting • Radix • Bucket',
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
    subtitle: 'KMP • Rabin-Karp • Z-Algorithm • Trie • Suffix Array • LCS',
    description:
      'Uncover hidden patterns in text using advanced string matching algorithms.',
    icon: <StringIcon />,
    textColor: 'text-rose-600',
    bgColor: 'bg-rose-600',
    href: '/visualizer/string',
    slug: 'string',
  },

  {
    title: 'LinkedList',
    subtitle: 'Singly • Doubly • Cycle • Reverse • Merge • Fast-Slow',
    description:
      'Wire and re-wire nodes dynamically to understand pointer logic.',
    icon: <LinkedListIcon />,
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-600',
    href: '/visualizer/linked-list',
    slug: 'linked-list',
    isLocked: false,
  },
  {
    title: 'Stack',
    subtitle:
      'LIFO • Monotonic • Valid Parens • Next Greater • Min Stack • Histogram',
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
    subtitle: 'FIFO • Priority • Deque • Sliding Max • BFS • Circular',
    description:
      'Manage scheduling and buffering tasks with first-in-first-out logic.',
    icon: <QueueIcon />,
    textColor: 'text-orange-600',
    bgColor: 'bg-orange-600',
    href: '/visualizer/queue',
    slug: 'queue',
    isLocked: false,
  },
  {
    title: 'Hashing',
    subtitle:
      'Maps • Sets • Collision • Two Sum • Group Anagrams • Subarray Sum',
    description: 'Learn how constant time lookups work under the hood.',
    icon: <HashIcon />,
    textColor: 'text-pink-600',
    bgColor: 'bg-pink-600',
    href: '/visualizer/hashing',
    slug: 'hashing',
    isLocked: false,
  },
  {
    title: 'Recursion',
    subtitle:
      'Base Case • Call Stack • Divide-Conquer • Backtrack • Memo • Tree',
    description:
      'The art of solving a problem by solving smaller instances of itself.',
    icon: <RecursionIcon />,
    textColor: 'text-cyan-600',
    bgColor: 'bg-cyan-600',
    href: '/visualizer/recursion',
    slug: 'recursion',
    isLocked: false,
  },
  {
    title: 'Trees',
    subtitle: 'BST • AVL • Inorder • Preorder • Postorder • Level Order',
    description:
      'Navigate hierarchical data structures with recursive elegance.',
    icon: <TreeIcon />,
    textColor: 'text-emerald-600',
    bgColor: 'bg-emerald-600',
    href: '/visualizer/trees',
    slug: 'trees',
    isLocked: false,
  },
  {
    title: 'Heaps',
    subtitle: 'Min-Heap • Max-Heap • Insert • Heapify • Heap Sort • Top K',
    description:
      'Efficiently manage priority data for scheduling and graph algorithms.',
    icon: <HeapIcon />,
    textColor: 'text-amber-600',
    bgColor: 'bg-amber-600',
    href: '/visualizer/heaps',
    slug: 'heaps',
    isLocked: false,
  },
  {
    title: 'Tries',
    subtitle:
      'Prefix Tree • Autocomplete • Insert • Search • StartsWith • Delete',
    description: 'Optimize dictionary searches and prefix matching.',
    icon: <TreeIcon />,
    textColor: 'text-lime-600',
    bgColor: 'bg-lime-600',
    href: '/visualizer/tries',
    slug: 'tries',
    isLocked: false,
  },
  {
    title: 'Graphs',
    subtitle: 'BFS • DFS • Dijkstra • Shortest Path • Topo Sort • Cycle',
    description: 'Model real-world connections and find the shortest paths.',
    icon: <GraphIcon />,
    textColor: 'text-fuchsia-600',
    bgColor: 'bg-fuchsia-600',
    href: '/visualizer/graphs',
    slug: 'graphs',
    isLocked: false,
  },
  {
    title: 'Greedy',
    subtitle:
      'Activity Selection • Huffman • Interval • Job Sequencing • Knapsack • Platforms',
    description: 'Make locally optimal choices to find a global optimum.',
    icon: <GreedyIcon />,
    textColor: 'text-teal-600',
    bgColor: 'bg-teal-600',
    href: '/visualizer/greedy',
    slug: 'greedy',
    isLocked: false,
  },
  {
    title: 'Dynamic Programming',
    subtitle:
      'Memoization • Tabulation • Fibonacci • Knapsack • LCS • Coin Change',
    description: 'Break down complex problems into overlapping subproblems.',
    icon: <DPIcon />,
    textColor: 'text-violet-600',
    bgColor: 'bg-violet-600',
    href: '/visualizer/dp',
    slug: 'dp',
    isLocked: false,
  },
  {
    title: 'Backtracking',
    subtitle:
      'N-Queens • Sudoku • Subsets • Permutations • Combination Sum • Maze',
    description:
      'Explore all potential solutions by building candidates incrementally.',
    icon: <BacktrackIcon />,
    textColor: 'text-red-600',
    bgColor: 'bg-red-600',
    href: '/visualizer/backtracking',
    slug: 'backtracking',
    isLocked: false,
  },
  {
    title: 'Bit Manipulation',
    subtitle: 'AND • OR • XOR • Shifts • Masks • Power of Two • Subset Bits',
    description: 'Operate directly on binary data for extreme performance.',
    icon: <BitIcon />,
    textColor: 'text-sky-600',
    bgColor: 'bg-sky-600',
    href: '/visualizer/bit-manipulation',
    slug: 'bit-manipulation',
    isLocked: false,
  },
  {
    title: 'Sliding Window',
    subtitle:
      'Fixed • Dynamic • Max Sum • Min Size • Longest Substring • Anagrams',
    description: 'Efficiently process subarrays without re-computing.',
    icon: <WindowIcon />,
    textColor: 'text-yellow-600',
    bgColor: 'bg-yellow-600',
    href: '/visualizer/sliding-window',
    slug: 'sliding-window',
    isLocked: false,
  },
  {
    title: 'Two Pointers',
    subtitle:
      'Collision • Parallel • Sort Colors • Container • Remove Duplicates • Triplet',
    description:
      'Traverse data from multiple directions to reduce time complexity.',
    icon: <PointerIcon />,
    textColor: 'text-zinc-600',
    bgColor: 'bg-zinc-600',
    href: '/visualizer/two-pointers',
    slug: 'two-pointers',
    isLocked: false,
  },
]
