'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import {
  VisualizerCanvasWrapper,
  type VisualizerWrapperTheme,
} from '@/components/student/visualizer/shared/visualizer-canvas-wrapper'
import { cn } from '@/lib/utils'

export interface VisualizerShellProps {
  title: string
  titleShort?: string
  subtitle: string
  icon: React.ReactNode
  themeColor: VisualizerWrapperTheme
  selectionBg?: string
  glowColor?: string
  backHref?: string
  headerRight: React.ReactNode
  controlDeck: React.ReactNode
  sidebar: React.ReactNode
  children: React.ReactNode
  statusBar?: React.ReactNode
  canvasClassName?: string
  explanationPanel?: React.ReactNode
}

const glowMap: Record<VisualizerWrapperTheme, string> = {
  orange: 'bg-orange-500/10',
  indigo: 'bg-indigo-500/10',
  rose: 'bg-rose-500/10',
  purple: 'bg-purple-500/10',
  amber: 'bg-amber-500/10',
  emerald: 'bg-emerald-500/10',
  lime: 'bg-lime-500/10',
  fuchsia: 'bg-fuchsia-500/10',
  teal: 'bg-teal-500/10',
  violet: 'bg-violet-500/10',
  red: 'bg-red-500/10',
  sky: 'bg-sky-500/10',
  green: 'bg-green-500/10',
}

const themeIconBox: Record<VisualizerWrapperTheme, string> = {
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

export function VisualizerShell({
  title,
  titleShort,
  subtitle,
  icon,
  themeColor,
  selectionBg,
  glowColor,
  backHref = '/visualizer',
  headerRight,
  controlDeck,
  sidebar,
  children,
  statusBar,
  canvasClassName,
  explanationPanel,
}: VisualizerShellProps) {
  const glow = glowColor ?? glowMap[themeColor]
  const selection = selectionBg ?? 'bg-indigo-500/20'

  return (
    <div
      className={cn(
        'relative min-h-screen w-full flex flex-col bg-background text-foreground overflow-x-hidden',
        selection
      )}
    >
      <div
        className={cn(
          'absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full -z-10 opacity-30 pointer-events-none blur-[120px]',
          glow
        )}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <header className="flex-none w-full z-50 px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row gap-4 items-center justify-between backdrop-blur-md transition-all">
        <div className="flex w-full md:w-auto items-center justify-between md:justify-start gap-4 md:gap-8">
          <div className="flex items-center gap-2 md:gap-4">
            <Link href={backHref}>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 md:h-10 md:w-10 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </Link>
            <div className="flex flex-col">
              <h1 className="text-sm md:text-xl font-black tracking-tighter uppercase italic flex items-center gap-2">
                <div
                  className={cn(
                    'w-5 h-5 md:w-6 md:h-6 rounded-md flex items-center justify-center text-white',
                    themeIconBox[themeColor]
                  )}
                >
                  {icon}
                </div>
                <span className="hidden sm:inline">{title}</span>
                <span className="sm:hidden">{titleShort ?? title}</span>
              </h1>
              <span className="text-[9px] md:text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                {subtitle}
              </span>
            </div>
          </div>
        </div>
        <div className="flex w-full md:w-auto items-center justify-between gap-4">
          {headerRight}
        </div>
      </header>

      <VisualizerCanvasWrapper
        themeColor={themeColor}
        controlDeck={controlDeck}
        sidebar={sidebar}
        statusBar={statusBar}
        explanationPanel={explanationPanel}
        className={canvasClassName}
      >
        {children}
      </VisualizerCanvasWrapper>
    </div>
  )
}
