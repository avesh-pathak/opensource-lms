'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export type VisualizerWrapperTheme =
  | 'orange'
  | 'indigo'
  | 'rose'
  | 'purple'
  | 'amber'
  | 'emerald'
  | 'lime'
  | 'fuchsia'
  | 'teal'
  | 'violet'
  | 'red'
  | 'sky'
  | 'green'

export interface VisualizerCanvasWrapperProps {
  /** Theme color for accent - used for sidebar dot and styling */
  themeColor?: VisualizerWrapperTheme
  /** Control deck: Play, Pause, Reset, Next, Previous, Speed slider */
  controlDeck: React.ReactNode
  /** Right sidebar content: ExplanationPanel, ComplexityCard, CodeViewer */
  sidebar: React.ReactNode
  /** Main canvas content (React Flow or other visualizer) */
  children: React.ReactNode
  /** Optional class for the canvas container */
  className?: string
  /** Optional status bar below controls (e.g. "Step 3 / 12") */
  statusBar?: React.ReactNode
  /** Optional explanation panel below canvas (step-by-step, like Array/String) */
  explanationPanel?: React.ReactNode
}

const themeMap: Record<VisualizerWrapperTheme, string> = {
  orange: 'bg-orange-500',
  indigo: 'bg-indigo-500',
  rose: 'bg-rose-500',
  purple: 'bg-purple-500',
  amber: 'bg-amber-500',
  emerald: 'bg-emerald-500',
  lime: 'bg-lime-500',
  fuchsia: 'bg-fuchsia-500',
  teal: 'bg-teal-500',
  violet: 'bg-violet-500',
  red: 'bg-red-500',
  sky: 'bg-sky-500',
  green: 'bg-green-500',
}

/**
 * Standardized layout for DSA visualizers using React Flow or other canvas.
 * Matches Array/Linked List aesthetic: full canvas area, control deck, sidebar.
 */
export function VisualizerCanvasWrapper({
  themeColor = 'indigo',
  controlDeck,
  sidebar,
  children,
  className,
  statusBar,
  explanationPanel,
}: VisualizerCanvasWrapperProps) {
  const accentClass = themeMap[themeColor] ?? themeMap.indigo

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
      {/* LEFT: Canvas (70%) - full area for React Flow */}
      <div className="relative flex flex-col flex-1 lg:w-[70%] min-h-[500px] lg:h-full overflow-hidden">
        <div
          className={cn(
            'flex-1 flex flex-col relative min-h-[300px] md:min-h-[400px] w-full',
            className
          )}
        >
          {/* Canvas fills this container; React Flow will pan/zoom inside */}
          <div className="absolute inset-0 z-0 w-full h-full">{children}</div>
        </div>

        {/* Explanation panel below canvas (step-by-step, like Array/String) */}
        {explanationPanel && (
          <div className="relative z-10 mt-2 md:mt-6 mb-4 w-full max-w-2xl mx-auto px-4 flex justify-center shrink-0">
            <div className="w-full">{explanationPanel}</div>
          </div>
        )}

        {/* Floating Control Deck (bottom center of left panel) */}
        <div className="relative z-40 w-full pb-4 lg:pb-8 flex flex-col items-center gap-2 px-4">
          <div className="w-full max-w-md pointer-events-auto">
            {controlDeck}
          </div>
          {statusBar && (
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {statusBar}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Sidebar (30%) - scrollable; ExplanationPanel, ComplexityCard, CodeViewer */}
      <div className="flex-none w-full lg:w-[30%] lg:min-h-0 lg:h-full flex flex-col z-30 bg-white/50 dark:bg-black/50 border-t border-dashed lg:border-t-0 lg:border-l lg:border-dashed lg:border-zinc-200 dark:lg:border-white/10 lg:bg-white/30 dark:lg:bg-transparent lg:backdrop-blur-xl">
        <div className="shrink-0 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 px-4 pt-4 lg:px-6 lg:pt-6 pb-2">
          <div className={cn('h-1 w-1 rounded-full', accentClass)} />
          Algorithm Details
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col gap-4 p-4 lg:p-6 pt-0 visualizer-details-scroll">
          {sidebar}
        </div>
      </div>
    </div>
  )
}
