'use client'

import { useEffect } from 'react'
import { useHashingStore } from '@/lib/store/hashing-visualizer-store'
import { AlgorithmType } from '@/lib/types/visualizer'
import { HashingCanvas } from '@/components/student/visualizer/hashing/hashing-canvas'
import { HashingControlDeck } from '@/components/student/visualizer/hashing/hashing-control-deck'
import { HashingCodeViewer } from '@/components/student/visualizer/hashing/hashing-code-viewer'
import { HashingExplanationPanel } from '@/components/student/visualizer/hashing/hashing-explanation-panel'
import { HashingComplexityCard } from '@/components/student/visualizer/hashing/hashing-complexity-card'
import { HashingInputControls } from '@/components/student/visualizer/hashing/hashing-input-controls'
import Link from 'next/link'
import { ChevronLeft, Hash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function HashingVisualizerPage() {
  const {
    algorithm,
    setAlgorithm,
    generateInput,
    isPlaying,
    playbackSpeed,
    nextStep,
    reset,
  } = useHashingStore()

  useEffect(() => {
    setAlgorithm('HASH_TWO_SUM')
    generateInput()
    reset()
  }, [setAlgorithm, generateInput, reset])

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
    <div className="relative min-h-screen w-full bg-background text-foreground selection:bg-amber-500/20 flex flex-col overflow-x-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-amber-500/10 blur-[120px] rounded-full -z-10 opacity-30 pointer-events-none" />
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
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-md bg-amber-500 flex items-center justify-center">
                  <Hash className="h-3 w-3 text-white" />
                </div>
                <span className="hidden sm:inline">Hashing Visualizer</span>
                <span className="sm:hidden">Hash Vis</span>
              </h1>
              <span className="text-[9px] md:text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Key-Value Optimization
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
              <SelectItem value="HASH_TWO_SUM">Two Sum (Map)</SelectItem>
              <SelectItem value="HASH_CONSECUTIVE">
                Consecutive Sequence
              </SelectItem>
              <SelectItem value="HASH_COLLISION">
                Collision Simulator
              </SelectItem>
            </SelectContent>
          </Select>

          <HashingInputControls />
        </div>
      </header>

      {/* Split Screen Container */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT: Canvas & Visuals (70%) */}
        <div className="relative flex flex-col flex-1 lg:w-[70%] min-h-[500px] lg:h-full overflow-hidden">
          <div className="flex-1 flex flex-col items-center justify-center relative min-h-[300px] md:min-h-[400px]">
            <div className="w-full h-full flex flex-col items-center z-10">
              <div className="flex-1 w-full overflow-hidden">
                <HashingCanvas />
              </div>

              <div className="mt-2 md:mt-8 gap-4 w-full max-w-2xl px-4 flex justify-center pb-8">
                <div className="w-full">
                  <HashingExplanationPanel />
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-40 w-full pb-4 lg:pb-8 flex justify-center px-4">
            <div className="w-full max-w-md pointer-events-auto">
              <HashingControlDeck />
            </div>
          </div>
        </div>

        {/* RIGHT: Code & Info (30%) */}
        <div className="flex-none w-full lg:w-[30%] lg:border-l lg:border-dashed lg:border-zinc-200 dark:lg:border-white/10 lg:bg-white/30 dark:lg:bg-transparent lg:backdrop-blur-xl overflow-y-auto scrollbar-hide flex flex-col gap-4 p-4 lg:p-6 lg:h-full z-30 bg-white/50 dark:bg-black/50 border-t border-dashed lg:border-t-0">
          <div className="flex flex-col gap-4 h-full">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
              <div className="h-1 w-1 bg-amber-500 rounded-full" />
              Hashing Internals
            </div>

            <div className="flex flex-col gap-4">
              <HashingComplexityCard />
            </div>

            <div className="flex-1 min-h-[300px] flex flex-col">
              <HashingCodeViewer />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
