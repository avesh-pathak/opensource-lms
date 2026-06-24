'use client'

import { useEffect } from 'react'
import { useTreeStore } from '@/lib/store/tree-visualizer-store'
import { AlgorithmType } from '@/lib/types/visualizer'
import ReactFlowTreeCanvas from '@/components/student/visualizer/trees/react-flow-tree-canvas'
import { TreeControlDeck } from '@/components/student/visualizer/trees/tree-control-deck'
import { TreeCodeViewer } from '@/components/student/visualizer/trees/tree-code-viewer'
import { TreeExplanationPanel } from '@/components/student/visualizer/trees/tree-explanation-panel'
import { TreeComplexityCard } from '@/components/student/visualizer/trees/tree-complexity-card'
import { TreeInputControls } from '@/components/student/visualizer/trees/tree-input-controls'
import Link from 'next/link'
import { ChevronLeft, Trees } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function TreeVisualizerPage() {
  const {
    algorithm,
    setAlgorithm,
    generateInput,
    isPlaying,
    playbackSpeed,
    nextStep,
    previousStep,
    setIsPlaying,
    setPlaybackSpeed,
    reset,
  } = useTreeStore()

  useEffect(() => {
    setAlgorithm('TREE_TRAVERSAL')
    generateInput()
    reset()
  }, [setAlgorithm, generateInput, reset])

  // Keyboard accessibility: navigation shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase() || ''
      if (tag === 'input' || tag === 'textarea') return
      switch (e.code) {
        case 'Space':
          e.preventDefault()
          setIsPlaying(!isPlaying)
          break
        case 'ArrowRight':
          nextStep()
          break
        case 'ArrowLeft':
          // @ts-ignore
          if (previousStep) previousStep()
          break
        case 'ArrowUp':
          setPlaybackSpeed(Math.min(3, playbackSpeed + 0.5))
          break
        case 'ArrowDown':
          setPlaybackSpeed(Math.max(0.5, playbackSpeed - 0.5))
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [
    isPlaying,
    playbackSpeed,
    nextStep,
    previousStep,
    setIsPlaying,
    setPlaybackSpeed,
    setPlaybackSpeed,
  ])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        nextStep()
      }, 800 / playbackSpeed)
    }
    return () => clearInterval(interval)
  }, [isPlaying, playbackSpeed, nextStep])

  const handleAlgorithmChange = (val: string) => {
    setAlgorithm(val as AlgorithmType)
  }

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground selection:bg-emerald-500/20 flex flex-col overflow-x-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full -z-10 opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header */}
      <header className="flex-none w-full z-50 px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row gap-4 items-center justify-between data-[state=scrolled]:bg-background/80 backdrop-blur-md transition-[background-color]">
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
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-md bg-emerald-500 flex items-center justify-center">
                  <Trees className="h-3 w-3 text-white" />
                </div>
                <span className="hidden sm:inline">Trees Visualizer</span>
                <span className="sm:hidden">Tree Vis</span>
              </h1>
              <span className="text-[9px] md:text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Hierarchical Structures
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-full md:w-auto items-center justify-between gap-4">
          <Select value={algorithm} onValueChange={handleAlgorithmChange}>
            <SelectTrigger className="w-[200px] h-9 bg-white/60 dark:bg-zinc-900/80 border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-zinc-100 font-medium shadow-sm backdrop-blur-sm hover:bg-white/80 dark:hover:bg-zinc-800 transition-colors">
              <SelectValue placeholder="Select Algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TREE_TRAVERSAL">In-order Traversal</SelectItem>
              <SelectItem value="TREE_BFS">Level-order (BFS)</SelectItem>
              <SelectItem value="TREE_LCA">Lowest Common Ancestor</SelectItem>
              <SelectItem value="BST_OPERATIONS">BST Operations</SelectItem>
            </SelectContent>
          </Select>

          {/* Controls */}
          <TreeInputControls />
        </div>
      </header>

      {/* Split Screen Container */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT: Canvas & Visuals (70%) */}
        <div className="relative flex flex-col flex-1 lg:w-[70%] min-h-[500px] lg:h-full overflow-hidden">
          {/* Visualizer Canvas Area */}
          <div className="flex-1 flex flex-col items-center justify-center relative min-h-[300px] md:min-h-[400px]">
            <div className="w-full h-full flex flex-col items-center z-10 transition-transform origin-top lg:origin-center">
              <div className="flex-1 w-full overflow-hidden">
                <ReactFlowTreeCanvas />
              </div>

              {/* Explanation Panel */}
              <div className="mt-2 md:mt-8 lg:mt-12 mb-4 md:mb-12 w-full max-w-2xl px-4 flex justify-center">
                <div className="w-full">
                  <TreeExplanationPanel />
                </div>
              </div>
            </div>
          </div>

          {/* Floating Control Deck */}
          <div className="relative z-40 w-full pb-4 lg:pb-8 flex justify-center px-4">
            <div className="w-full max-w-md pointer-events-auto">
              <TreeControlDeck />
            </div>
          </div>
        </div>

        {/* RIGHT: Code & Info (30%) */}
        <div className="flex-none w-full lg:w-[30%] lg:border-l lg:border-dashed lg:border-zinc-200 dark:lg:border-white/10 lg:bg-white/30 dark:lg:bg-transparent lg:backdrop-blur-xl flex flex-col gap-4 p-4 lg:p-6 lg:h-full z-30 bg-white/50 dark:bg-black/50 border-t border-dashed lg:border-t-0 visualizer-details-scroll">
          <div className="flex flex-col gap-4 h-full">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
              <div className="h-1 w-1 bg-emerald-500 rounded-full" />
              Tree Internals
            </div>

            <div className="flex flex-col gap-4">
              <TreeComplexityCard />
            </div>

            <div className="flex-1 min-h-[300px] flex flex-col">
              <TreeCodeViewer />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
