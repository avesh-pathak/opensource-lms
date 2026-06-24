'use client'

import React, { useRef } from 'react'
import { useVisualizerStore } from '@/lib/store/array-visualizer-store'
import { cn } from '@/lib/utils'
import { gsap } from 'gsap'
import { Flip } from 'gsap/all'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(Flip, useGSAP)

export function ArrayCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const flipState = useRef<Flip.FlipState | null>(null)
  const {
    frames,
    currentFrame,
    array: storeArray,
    playbackSpeed,
  } = useVisualizerStore()
  const activeFrame = frames[currentFrame]

  // Use active frame data or fall back to store array for initial state
  const array = activeFrame ? activeFrame.array : storeArray
  const highlights = activeFrame?.highlights || []
  const secondary = activeFrame?.secondaryHighlights || []
  const visited = activeFrame?.visited || []
  const pointers = activeFrame?.pointers || {}
  const ranges = activeFrame?.ranges || []
  const swappedIndices = activeFrame?.swappedIndices || []

  // 0. Premium Initial Mount Stagger
  useGSAP(
    () => {
      if (!containerRef.current || !array || array.length === 0) return

      // Only run this when the algorithm first loads (currentFrame === 0)
      if (currentFrame === 0) {
        gsap.fromTo(
          '.array-node',
          { y: 50, opacity: 0, scale: 0.8 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.05,
            ease: 'back.out(1.5)',
          }
        )
      }
    },
    {
      dependencies: [array === storeArray, currentFrame === 0],
      scope: containerRef,
    }
  )

  // 1. FLIP and Frame Actions
  useGSAP(
    () => {
      if (!containerRef.current) return

      // Only FLIP array cells — not .pointer-node. Pointer badges mount/unmount
      // when L/R/M move; including them triggered onLeave with opacity:0 while
      // nodes could still occupy flex space, causing gaps / "missing" cells.
      const targets = gsap.utils.toArray<HTMLElement>('.array-node')
      if (targets.length === 0) return

      const flipDuration = Math.max(0.15, 0.5 / playbackSpeed)

      if (flipState.current) {
        Flip.from(flipState.current, {
          duration: flipDuration,
          ease: 'power2.inOut',
          targets: targets,
          absolute: true,
          nested: true,
          onEnter: (elements) =>
            gsap.fromTo(
              elements,
              { opacity: 0, scale: 0.5, y: -20 },
              { opacity: 1, scale: 1, y: 0, duration: 0.4 }
            ),
          onLeave: (elements) =>
            gsap.to(elements, {
              opacity: 0,
              scale: 0.85,
              width: 0,
              minWidth: 0,
              marginLeft: 0,
              marginRight: 0,
              paddingLeft: 0,
              paddingRight: 0,
              overflow: 'hidden',
              duration: 0.25,
              ease: 'power2.in',
            }),
        })

        // Add Explicit Arc Animation for swapped elements (Sorting Visualizers)
        if (
          swappedIndices.length === 2 &&
          swappedIndices[0] !== swappedIndices[1]
        ) {
          const [idx1, idx2] = swappedIndices
          const node1 = containerRef.current.querySelector(
            `.array-node[data-index="${idx1}"] .array-bar`
          )
          const node2 = containerRef.current.querySelector(
            `.array-node[data-index="${idx2}"] .array-bar`
          )

          if (node1 && node2) {
            gsap.fromTo(
              node1,
              { y: 0, scale: 1, top: 0 },
              {
                y: -45,
                scale: 1.15,
                yoyo: true,
                repeat: 1,
                duration: flipDuration / 2,
                ease: 'power1.inOut',
                onComplete: () => {
                  gsap.set(node1, { clearProps: 'all' })
                },
              }
            )
            gsap.fromTo(
              node2,
              { y: 0, scale: 1, top: 0 },
              {
                y: 45,
                scale: 1.15,
                yoyo: true,
                repeat: 1,
                duration: flipDuration / 2,
                ease: 'power1.inOut',
                onComplete: () => {
                  gsap.set(node2, { clearProps: 'all' })
                },
              }
            )
          }
        }
      }

      flipState.current = Flip.getState(targets)
    },
    {
      // currentFrame drives frame data; avoid `array` reference churn re-running Flip every render
      dependencies: [currentFrame, playbackSpeed, frames.length],
      scope: containerRef,
    }
  )

  // 2. Premium Celebration Wave (On Algorithm Complete)
  useGSAP(
    () => {
      if (!containerRef.current || frames.length === 0) return

      // Trigger wave if we hit the very last frame dynamically
      if (currentFrame === frames.length - 1 && frames.length > 1) {
        gsap.to('.array-bar', {
          y: -20,
          scale: 1.1,
          backgroundColor: '#A855F7', // Purple-500 equivalent
          borderColor: '#D8B4FE', // Purple-300 equivalent
          boxShadow: '0 0 20px rgba(168, 85, 247, 0.6)',
          color: '#ffffff',
          stagger: 0.04,
          yoyo: true,
          repeat: 1,
          duration: 0.3,
          ease: 'power2.inOut',
          onComplete: () => {
            gsap.set('.array-bar', { clearProps: 'all' })
          },
        })
      }
    },
    { dependencies: [currentFrame, frames.length], scope: containerRef }
  )

  if (!array || array.length === 0) return null

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full flex-col items-center justify-center p-4 md:p-8 transition-colors overflow-hidden"
    >
      {/* Array Container with horizontal scroll for mobile */}
      <div className="relative w-full overflow-x-auto scrollbar-hide pb-8 pt-16 px-4">
        <div className="flex min-w-max items-center justify-center mx-auto gap-2 md:gap-3">
          {array.map((value, idx) => {
            const isHighlighted = highlights.includes(idx)
            const isSecondary = secondary.includes(idx)
            const _isVisited = visited.includes(idx)
            const isSorted = activeFrame?.sortedIndices?.includes(idx)
            const isDiscarded = ranges.some(
              (r) => r.type === 'discarded' && idx >= r.start && idx <= r.end
            )

            // Stable id per index only — value-based keys break when values swap or duplicate
            const flipId = `node-${idx}`

            return (
              <div
                key={flipId}
                data-flip-id={flipId}
                data-index={idx}
                className="array-node relative flex flex-col items-center gap-3 group"
              >
                {/* Top Pointers (L, R, M) */}
                <div className="absolute -top-12 flex flex-col gap-1 h-10 justify-end pointer-events-none">
                  {Object.entries(pointers).map(
                    ([name, pos]) =>
                      pos === idx && (
                        <div
                          key={name}
                          data-flip-id={`pointer-${name}`}
                          className={cn(
                            'pointer-node px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-lg backdrop-blur-sm border',
                            name === 'mid'
                              ? 'bg-amber-100/90 text-amber-700 border-amber-200 dark:bg-amber-900/90 dark:text-amber-100 dark:border-amber-700'
                              : 'bg-indigo-100/90 text-indigo-700 border-indigo-200 dark:bg-indigo-900/90 dark:text-indigo-100 dark:border-indigo-700'
                          )}
                        >
                          {name}
                        </div>
                      )
                  )}
                </div>

                {/* Bar/Node */}
                <div
                  className={cn(
                    'array-bar relative flex h-14 w-12 items-center justify-center rounded-xl border-[2px] shadow-lg backdrop-blur-md transition-colors duration-300',
                    'font-mono text-lg font-bold z-10',
                    isHighlighted && '-translate-y-2',
                    typeof value === 'string'
                      ? isHighlighted
                        ? 'border-pink-500 bg-pink-500 text-white shadow-pink-500/50'
                        : isSecondary
                          ? 'border-blue-500 bg-blue-500 text-white shadow-blue-500/50'
                          : 'border-pink-200 bg-pink-100 text-pink-700 dark:border-pink-800 dark:bg-pink-900/30 dark:text-pink-300 shadow-sm'
                      : isHighlighted
                        ? 'border-green-500 bg-green-500 text-white shadow-green-500/50'
                        : isSecondary
                          ? 'border-blue-500 bg-blue-500 text-white shadow-blue-500/50'
                          : isSorted
                            ? 'border-purple-500 bg-purple-500 text-white shadow-purple-500/50'
                            : isDiscarded
                              ? 'border-zinc-200 bg-zinc-100/50 text-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-600'
                              : 'border-white/50 bg-white/80 text-zinc-700 dark:border-zinc-700/50 dark:bg-zinc-800/80 dark:text-zinc-100',
                    isDiscarded &&
                      'border-transparent bg-transparent shadow-none'
                  )}
                >
                  {value}

                  {/* Mirror Reflection Effect */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/5 to-transparent rounded-b-xl" />
                </div>

                {/* Index Number */}
                <span
                  className={cn(
                    'text-xs font-mono font-medium transition-colors',
                    isHighlighted
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-zinc-400 dark:text-zinc-500'
                  )}
                >
                  {idx}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
