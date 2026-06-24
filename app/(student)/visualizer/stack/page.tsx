'use client'

import { useEffect } from 'react'
import { useStackStore } from '@/lib/store/stack-visualizer-store'
import { AlgorithmType } from '@/lib/types/visualizer'
import { StackCanvas } from '@/components/student/visualizer/stack/stack-canvas'
import { StackControlDeck } from '@/components/student/visualizer/stack/stack-control-deck'
import { StackCodeViewer } from '@/components/student/visualizer/stack/stack-code-viewer'
import { StackExplanationPanel } from '@/components/student/visualizer/stack/stack-explanation-panel'
import { StackComplexityCard } from '@/components/student/visualizer/stack/stack-complexity-card'
import { StackInputControls } from '@/components/student/visualizer/stack/stack-input-controls'
import { VisualizerCanvasWrapper } from '@/components/student/visualizer/shared/visualizer-canvas-wrapper'
import Link from 'next/link'
import { ArrowLeft, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function StackVisualizerPage() {
  const { reset, setAlgorithm, generateInput, algorithm } = useStackStore()

  useEffect(() => {
    setAlgorithm('VALID_PARENTHESES')
    generateInput()
    reset()
  }, [setAlgorithm, generateInput, reset])

  const { isPlaying, playbackSpeed, nextStep } = useStackStore()

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        nextStep()
      }, 800 / playbackSpeed)
    }
    return () => clearInterval(interval)
  }, [isPlaying, playbackSpeed, nextStep])

  const handleAlgorithmChange = (algo: string) => {
    setAlgorithm(algo as AlgorithmType)
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-background text-foreground selection:bg-indigo-500/20 overflow-x-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full -z-10 opacity-30 pointer-events-none" />
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
                <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </Link>
            <div className="flex flex-col">
              <h1 className="text-sm md:text-xl font-black tracking-tighter uppercase italic flex items-center gap-2">
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-md bg-indigo-500 flex items-center justify-center">
                  <Layers className="h-3 w-3 text-white" />
                </div>
                <span className="hidden sm:inline">Stack Visualizer</span>
                <span className="sm:hidden">Stack Vis</span>
              </h1>
              <span className="text-[9px] md:text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Memory & Logic
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-full md:w-auto items-center justify-between gap-4">
          <Select
            value={algorithm}
            onValueChange={(value) => handleAlgorithmChange(value)}
          >
            <SelectTrigger className="w-[200px] h-9 bg-white/60 dark:bg-zinc-900/80 border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-zinc-100 font-medium shadow-sm backdrop-blur-sm hover:bg-white/80 dark:hover:bg-zinc-800 transition-colors">
              <SelectValue placeholder="Select Algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VALID_PARENTHESES">
                Valid Parentheses
              </SelectItem>
              <SelectItem value="NEXT_GREATER_ELEMENT">
                Next Greater Element
              </SelectItem>
              <SelectItem value="LARGEST_RECTANGLE">
                Largest Rectangle
              </SelectItem>
              <SelectItem value="MIN_STACK">Min Stack</SelectItem>
            </SelectContent>
          </Select>

          {/* Controls */}
          <StackInputControls />
        </div>
      </header>

      {/* Split Screen: Canvas (React Flow) + Control Deck + Sidebar */}
      <VisualizerCanvasWrapper
        themeColor="indigo"
        controlDeck={<StackControlDeck />}
        sidebar={
          <>
            <StackExplanationPanel />
            <StackComplexityCard />
            <div className="flex-1 min-h-[300px] flex flex-col">
              <StackCodeViewer />
            </div>
          </>
        }
      >
        <StackCanvas />
      </VisualizerCanvasWrapper>
    </div>
  )
}
