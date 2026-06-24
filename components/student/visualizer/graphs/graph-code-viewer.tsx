'use client'

import { useGraphStore } from '@/lib/store/graph-visualizer-store'
import { cn } from '@/lib/utils'

const LINES = [
  'def bfs(graph, start):',
  '  visited = set()',
  '  queue = deque([start])',
  '  while queue:',
  '    node = queue.popleft()',
  '    if node in visited: continue',
  '    visited.add(node)',
  '    for neighbor in graph[node]:',
  '      queue.append(neighbor)',
]

export function GraphCodeViewer() {
  const { frames, currentFrame } = useGraphStore()
  const frame = frames[currentFrame]
  const activeLine = frame?.activeLine ?? 1

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/50 overflow-hidden">
      <div className="px-3 py-2 border-b border-zinc-200 dark:border-white/10">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          BFS
        </span>
      </div>
      <pre className="p-4 text-xs font-mono overflow-x-auto">
        {LINES.map((line, i) => (
          <div
            key={i}
            className={cn(
              'py-0.5 px-2 -mx-2 rounded',
              activeLine === i + 1 &&
                'bg-fuchsia-500/20 text-fuchsia-800 dark:text-fuchsia-200'
            )}
          >
            <span className="text-zinc-400 w-6 inline-block select-none">
              {i + 1}
            </span>
            {line}
          </div>
        ))}
      </pre>
    </div>
  )
}
