'use client'

import { useGraphStore } from '@/lib/store/graph-visualizer-store'
import { cn } from '@/lib/utils'

export function GraphCanvas() {
  const { nodes, edges, frames, currentFrame } = useGraphStore()
  const frame = frames[currentFrame]
  const highlights = frame?.highlights ?? []
  const visited = frame?.visited ?? []

  return (
    <div className="flex items-center justify-center p-8 w-full h-full overflow-auto">
      <svg
        viewBox="-30 -30 260 260"
        className="w-full h-full min-h-[320px] max-w-2xl"
      >
        {edges.map((e, i) => {
          const from = nodes.find((n) => n.id === e.from)
          const to = nodes.find((n) => n.id === e.to)
          if (!from || !to) return null
          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="currentColor"
              strokeWidth="2"
              className="text-zinc-300 dark:text-zinc-600"
            />
          )
        })}
        {nodes.map((n, idx) => {
          const isCurrent = highlights.includes(idx)
          const isVisited = visited.includes(idx)
          return (
            <g key={n.id}>
              <circle
                cx={n.x}
                cy={n.y}
                r={22}
                className={cn(
                  'stroke-2 transition-all',
                  isCurrent &&
                    'fill-fuchsia-500 stroke-fuchsia-600 dark:stroke-fuchsia-400',
                  !isCurrent &&
                    isVisited &&
                    'fill-fuchsia-200 dark:fill-fuchsia-900/50 stroke-fuchsia-400',
                  !isCurrent &&
                    !isVisited &&
                    'fill-white dark:fill-zinc-800 stroke-zinc-300 dark:stroke-zinc-600'
                )}
              />
              <text
                x={n.x}
                y={n.y + 5}
                textAnchor="middle"
                className={cn(
                  'text-sm font-black',
                  isCurrent || isVisited
                    ? 'fill-fuchsia-900 dark:fill-white'
                    : 'fill-zinc-800 dark:fill-zinc-200'
                )}
              >
                {n.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
