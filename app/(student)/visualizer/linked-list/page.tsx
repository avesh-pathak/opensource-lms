'use client'

import { useEffect } from 'react'
import { useLinkedListStore } from '@/lib/store/linked-list-visualizer-store'
import { AlgorithmType } from '@/lib/types/visualizer'
import { LinkedListCanvas } from '@/components/student/visualizer/linked-list/linked-list-canvas'
import { LinkedListControlDeck } from '@/components/student/visualizer/linked-list/linked-list-control-deck'
import { LinkedListCodeViewer } from '@/components/student/visualizer/linked-list/linked-list-code-viewer'
import { LinkedListExplanationPanel } from '@/components/student/visualizer/linked-list/linked-list-explanation-panel'
import { LinkedListComplexityCard } from '@/components/student/visualizer/linked-list/linked-list-complexity-card'
import { LinkedListInputControls } from '@/components/student/visualizer/linked-list/linked-list-input-controls'
import { LinkedListErrorBoundary } from '@/components/student/visualizer/linked-list/error-boundary'
import Link from 'next/link'
import { ChevronLeft, GitBranch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function LinkedListVisualizerPage() {
  const {
    algorithm,
    setAlgorithm,
    generateInput,
    isPlaying,
    playbackSpeed,
    nextStep,
    previousStep,
    reset: _reset,
    recalculateFrames,
  } = useLinkedListStore()

  useEffect(() => {
    const state = useLinkedListStore.getState()
    if (state.nodes.length === 0) {
      setAlgorithm('LL_REVERSE')
      generateInput()
    } else if (state.frames.length === 0) {
      recalculateFrames()
    }
  }, [setAlgorithm, generateInput, recalculateFrames])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        nextStep()
      }, 800 / playbackSpeed)
    }
    return () => clearInterval(interval)
  }, [isPlaying, playbackSpeed, nextStep])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName))
        return

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        nextStep()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        previousStep()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextStep, previousStep])

  const handleAlgorithmChange = (val: string) => {
    setAlgorithm(val as AlgorithmType)
  }

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground flex flex-col overflow-x-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full -z-10 opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <header className="flex-none w-full z-50 px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row gap-4 items-center justify-between backdrop-blur-md transition-[background-color]">
        <div className="flex w-full md:w-auto items-center justify-between md:justify-start gap-4 md:gap-8">
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/visualizer">
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
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-md bg-purple-500 flex items-center justify-center">
                  <GitBranch className="h-3 w-3 text-white fill-current" />
                </div>
                <span className="hidden sm:inline">LinkedList Visualizer</span>
                <span className="sm:hidden">LL Vis</span>
              </h1>
              <span className="text-[9px] md:text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Pointer Logic
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-full md:w-auto flex-col md:flex-row items-center justify-between gap-4">
          <Select value={algorithm} onValueChange={handleAlgorithmChange}>
            <SelectTrigger className="w-full md:w-[200px] h-9 bg-white/60 dark:bg-zinc-900/80 border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-zinc-100 font-medium shadow-sm backdrop-blur-sm hover:bg-white/80 dark:hover:bg-zinc-800 transition-colors">
              <SelectValue placeholder="Select Algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LL_REVERSE">Reverse List</SelectItem>
              <SelectItem value="LL_DETECT_CYCLE">Detect Cycle</SelectItem>
              <SelectItem value="LL_MERGE_SORTED">Merge Sorted</SelectItem>
              <SelectItem value="LL_MIDDLE_NODE">Middle Node</SelectItem>
            </SelectContent>
          </Select>

          <div className="w-full md:w-auto">
            <LinkedListInputControls />
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="relative flex-1 lg:w-[70%] min-h-[500px] overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col">
          <div className="absolute inset-0 z-0 w-full h-full">
            <LinkedListErrorBoundary>
              <LinkedListCanvas />
            </LinkedListErrorBoundary>
          </div>

          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 pointer-events-none">
            <div className="pointer-events-auto">
              <LinkedListExplanationPanel />
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 pointer-events-auto flex justify-center">
            <LinkedListControlDeck />
          </div>
        </div>

        <div className="flex-none w-full lg:w-[30%] lg:border-l lg:border-dashed lg:border-zinc-200 dark:lg:border-white/10 lg:bg-white/30 dark:lg:bg-transparent lg:backdrop-blur-xl overflow-y-auto scrollbar-hide flex flex-col gap-4 p-4 lg:p-6 lg:h-full z-30 bg-white/50 dark:bg-black/50 border-t border-dashed lg:border-t-0">
          <div className="flex flex-col gap-4 h-full">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
              <div className="h-1 w-1 bg-purple-500 rounded-full" />
              Algorithm Details
            </div>

            <div className="flex flex-col gap-4">
              <LinkedListComplexityCard />
            </div>

            <div className="flex-1 min-h-[300px] flex flex-col">
              <LinkedListCodeViewer />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
