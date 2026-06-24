'use client'

import React, { useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useTreeStore } from '@/lib/store/tree-visualizer-store'
import { cn } from '@/lib/utils'

gsap.registerPlugin(useGSAP)

export function TreeCanvas() {
  const { algorithm: _algorithm, frames, currentFrame } = useTreeStore()
  const frame = frames[currentFrame]
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const nodes = frame?.array || []

  // Recursive calculation
  const layout = useMemo(() => {
    const root = nodes.find((n) => n.parentId === null)
    if (!root) return {}

    const positions: Record<string, { x: number; y: number }> = {}
    const canvasWidth = 800
    const levelHeight = 100

    function calculatePositions(
      nodeId: string,
      depth: number,
      left: number,
      right: number
    ) {
      const node = nodes.find((n) => n.id === nodeId)
      if (!node) return

      const x = (left + right) / 2
      const y = depth * levelHeight + 60
      positions[nodeId] = { x, y }

      if (node.leftId) {
        calculatePositions(node.leftId, depth + 1, left, x)
      }
      if (node.rightId) {
        calculatePositions(node.rightId, depth + 1, x, right)
      }
    }

    if (root) calculatePositions(root.id, 0, 0, canvasWidth)
    return positions
  }, [nodes])

  const highlights = frame?.highlights || []
  const secondaryHighlights = frame?.secondaryHighlights || []
  const visited = frame?.visited || []
  const pointers = frame?.pointers || {}

  const containerRef = useRef<HTMLDivElement>(null)
  const prevLayout = useRef<Record<string, { x: number; y: number }>>({})

  useGSAP(
    () => {
      if (!frame) return

      nodes.forEach((node) => {
        const pos = layout[node.id]
        if (!pos) return

        const oldPos = prevLayout.current[node.id] || pos

        const isNewNode = !prevLayout.current[node.id]

        // Node Animation
        if (isNewNode) {
          gsap.fromTo(
            `#node-${node.id}`,
            { x: pos.x - 24, y: pos.y - 24, scale: 0, opacity: 0 },
            {
              x: pos.x - 24,
              y: pos.y - 24,
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: 'back.out(1.5)',
            }
          )
        } else {
          gsap.fromTo(
            `#node-${node.id}`,
            { x: oldPos.x - 24, y: oldPos.y - 24 },
            {
              x: pos.x - 24,
              y: pos.y - 24,
              opacity: 1,
              scale: 1,
              duration: 0.4,
              ease: 'power3.out',
            }
          )
        }

        // Highlight Flash Animation
        const isHighlighted =
          highlights.includes(nodes.indexOf(node)) ||
          secondaryHighlights.includes(nodes.indexOf(node))
        if (isHighlighted && !isNewNode) {
          gsap.fromTo(
            `#node-${node.id}`,
            { scale: 1.2, filter: 'brightness(1.5)' },
            {
              scale: 1,
              filter: 'brightness(1)',
              duration: 0.4,
              ease: 'power2.out',
            }
          )
        }

        // Edge Drawing Simulator using strokeDasharray
        const drawEdge = (childId: string, edgeId: string) => {
          const childPos = layout[childId]
          if (!childPos) return

          const oldChild = prevLayout.current[childId]
          const isNewEdge = !oldChild || isNewNode

          if (isNewEdge) {
            const lineLen = Math.hypot(childPos.x - pos.x, childPos.y - pos.y)
            gsap.fromTo(
              edgeId,
              {
                attr: { x1: pos.x, y1: pos.y, x2: childPos.x, y2: childPos.y },
                strokeDasharray: lineLen,
                strokeDashoffset: lineLen,
                opacity: 0,
              },
              {
                strokeDasharray: lineLen,
                strokeDashoffset: 0,
                opacity: 1,
                duration: 0.6,
                ease: 'power2.out',
                delay: 0.2,
              }
            )
          } else {
            gsap.fromTo(
              edgeId,
              {
                attr: {
                  x1: oldPos.x,
                  y1: oldPos.y,
                  x2: oldChild.x,
                  y2: oldChild.y,
                },
              },
              {
                attr: { x1: pos.x, y1: pos.y, x2: childPos.x, y2: childPos.y },
                duration: 0.4,
                ease: 'power3.out',
              }
            )
          }
        }

        if (node.leftId)
          drawEdge(node.leftId, `#edge-${node.id}-${node.leftId}`)
        if (node.rightId)
          drawEdge(node.rightId, `#edge-${node.id}-${node.rightId}`)
      })

      prevLayout.current = layout
    },
    {
      dependencies: [
        nodes,
        layout,
        currentFrame,
        highlights,
        secondaryHighlights,
      ],
      scope: containerRef,
    }
  )

  if (!frame)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-zinc-500 animate-pulse text-sm font-black uppercase tracking-[0.2em]">
          Initializing Tree Canvas...
        </p>
      </div>
    )

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden p-8 flex items-center justify-center"
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 800 600"
      >
        <defs>
          <marker
            id="tree-arrow"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="currentColor"
              opacity="0.5"
            />
          </marker>
        </defs>

        {/* Draw Edges */}
        {nodes.map((node) => {
          if (!node.leftId && !node.rightId) return null
          const start = layout[node.id]
          if (!start) return null

          const activeEdge = frame.variables?.activeEdge as string[] | undefined
          const isLeftActive =
            activeEdge &&
            activeEdge[0] === node.id &&
            activeEdge[1] === node.leftId
          const isRightActive =
            activeEdge &&
            activeEdge[0] === node.id &&
            activeEdge[1] === node.rightId

          const LaserLine = ({
            x1,
            y1,
            x2,
            y2,
          }: {
            x1: number
            y1: number
            x2: number
            y2: number
          }) => (
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#f59e0b" // amber-500
              strokeWidth="4"
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 4px #f59e0b)' }}
            />
          )

          return (
            <React.Fragment key={`edges-${node.id}`}>
              {node.leftId && layout[node.leftId] && (
                <>
                  <line
                    id={`edge-${node.id}-${node.leftId}`}
                    x1={start.x}
                    y1={start.y}
                    x2={layout[node.leftId].x}
                    y2={layout[node.leftId].y}
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-zinc-400 dark:text-zinc-600"
                  />
                  {isLeftActive && (
                    <LaserLine
                      x1={start.x}
                      y1={start.y}
                      x2={layout[node.leftId].x}
                      y2={layout[node.leftId].y}
                    />
                  )}
                </>
              )}
              {node.rightId && layout[node.rightId] && (
                <>
                  <line
                    id={`edge-${node.id}-${node.rightId}`}
                    x1={start.x}
                    y1={start.y}
                    x2={layout[node.rightId].x}
                    y2={layout[node.rightId].y}
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-zinc-400 dark:text-zinc-600"
                  />
                  {isRightActive && (
                    <LaserLine
                      x1={start.x}
                      y1={start.y}
                      x2={layout[node.rightId].x}
                      y2={layout[node.rightId].y}
                    />
                  )}
                </>
              )}
            </React.Fragment>
          )
        })}
      </svg>

      <div
        className="relative w-full h-full"
        style={{ maxWidth: 800, maxHeight: 600 }}
      >
        {nodes.map((node, idx) => {
          const pos = layout[node.id]
          if (!pos) return null

          const isHighlighted = highlights.includes(idx)
          const isSecondary = secondaryHighlights.includes(idx)
          const isVisited = visited.includes(idx)
          const nodePointers = Object.entries(pointers)
            .filter(([_, pIdx]) => pIdx === idx)
            .map(([name]) => name)

          return (
            <div
              key={node.id}
              id={`node-${node.id}`}
              className={cn(
                'absolute top-0 left-0 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all shadow-lg text-sm font-black italic',
                isHighlighted
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-4 ring-emerald-500/20 z-20'
                  : isSecondary
                    ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 z-10'
                    : isVisited
                      ? 'border-zinc-400 bg-zinc-400/10 text-zinc-500 opacity-60'
                      : 'border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100'
              )}
            >
              {node.value}

              {/* Pointer Labels */}
              {nodePointers.length > 0 && (
                <div className="absolute -top-10 flex flex-col items-center gap-1">
                  {nodePointers.map((name) => (
                    <span
                      key={name}
                      className={cn(
                        'px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest text-white shadow-sm',
                        name === 'curr'
                          ? 'bg-emerald-500'
                          : name === 'lca'
                            ? 'bg-amber-500'
                            : 'bg-blue-500'
                      )}
                    >
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
