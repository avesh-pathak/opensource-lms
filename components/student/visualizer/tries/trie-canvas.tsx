'use client'

import { useTrieStore } from '@/lib/store/trie-visualizer-store'
import { cn } from '@/lib/utils'

export function TrieCanvas() {
  const { frames, currentFrame } = useTrieStore()
  const frame = frames[currentFrame]

  if (!frame || frame.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-zinc-500 text-sm font-black uppercase tracking-[0.2em]">
          Insert a word to visualize the trie
        </p>
      </div>
    )
  }

  const { nodes, edges, highlights } = frame

  return (
    <div className="flex items-center justify-center p-8 w-full h-full overflow-auto">
      <svg
        viewBox={`${-50} ${-20} ${400} ${300}`}
        className="w-full h-full min-h-[300px]"
      >
        {edges.map((e, i) => {
          const from = nodes.find((n) => n.id === e.from)
          const to = nodes.find((n) => n.id === e.to)
          if (!from || !to) return null
          return (
            <g key={i}>
              <line
                x1={from.x + 24}
                y1={from.y + 24}
                x2={to.x + 24}
                y2={to.y + 24}
                stroke="currentColor"
                strokeWidth="2"
                className="text-zinc-300 dark:text-zinc-600"
              />
              <text
                x={(from.x + to.x) / 2 + 24}
                y={(from.y + to.y) / 2 + 24}
                className="fill-lime-600 dark:fill-lime-400 text-xs font-bold"
                textAnchor="middle"
              >
                {e.label}
              </text>
            </g>
          )
        })}
        {nodes.map((n) => {
          const isHighlight = highlights.includes(n.id)
          return (
            <g key={n.id}>
              <circle
                cx={n.x + 24}
                cy={n.y + 24}
                r={22}
                className={cn(
                  'stroke-2 transition-all',
                  isHighlight
                    ? 'fill-lime-500 stroke-lime-600 dark:fill-lime-600 dark:stroke-lime-400'
                    : 'fill-white dark:fill-zinc-800 stroke-zinc-300 dark:stroke-zinc-600'
                )}
              />
              <text
                x={n.x + 24}
                y={n.y + 28}
                textAnchor="middle"
                className={cn(
                  'text-sm font-black',
                  isHighlight
                    ? 'fill-white'
                    : 'fill-zinc-800 dark:fill-zinc-200'
                )}
              >
                {n.char}
              </text>
              {n.isEnd && (
                <circle
                  cx={n.x + 44}
                  cy={n.y + 14}
                  r={4}
                  className="fill-lime-500"
                />
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
