'use client'

import { useEffect } from 'react'
import { useVisualizerStore } from '@/lib/store/array-visualizer-store'
import { ArrayCanvas } from '@/components/student/visualizer/array/array-canvas'
import { ControlDeck } from '@/components/student/visualizer/array/control-deck'
import { CodeViewer } from '@/components/student/visualizer/array/code-viewer'
import { ExplanationPanel } from '@/components/student/visualizer/array/explanation-panel'
import { ComplexityCard } from '@/components/student/visualizer/array/complexity-card'
import { InputControls } from '@/components/student/visualizer/array/input-controls'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, Search, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function ArrayVisualizerPage() {
  const { reset, setAlgorithm, generateArray, algorithm } = useVisualizerStore()

  useEffect(() => {
    setAlgorithm('LINEAR_SEARCH')
    generateArray()
    reset()
  }, [setAlgorithm, generateArray, reset])

  const { isPlaying, playbackSpeed, nextStep } = useVisualizerStore()

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        nextStep()
      }, 800 / playbackSpeed) // Base speed 800ms
    }
    return () => clearInterval(interval)
  }, [isPlaying, playbackSpeed, nextStep])

  const handleAlgorithmChange = (algo: string) => {
    setAlgorithm(algo as 'LINEAR_SEARCH' | 'BINARY_SEARCH')
    generateArray()
    reset()
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-background text-foreground selection:bg-orange-500/20 overflow-x-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full -z-10 opacity-30 pointer-events-none" />
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
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-md bg-orange-500 flex items-center justify-center">
                  <ShieldCheck className="h-3 w-3 text-white" />
                </div>
                <span className="hidden sm:inline">Array Visualizer</span>
                <span className="sm:hidden">Array Vis</span>
              </h1>
              <span className="text-[9px] md:text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Interactive Learning
              </span>
            </div>
          </div>

          {/* Algorithm Selector Mobile/Desktop */}
          <div className="hidden md:flex items-center bg-muted/50 p-1 rounded-xl border border-white/5 backdrop-blur-sm">
            <AlgorithmTab
              label="Linear"
              isActive={algorithm === 'LINEAR_SEARCH'}
              onClick={() => handleAlgorithmChange('LINEAR_SEARCH')}
              icon={<Search className="h-3 w-3" />}
            />
            <AlgorithmTab
              label="Binary"
              isActive={algorithm === 'BINARY_SEARCH'}
              onClick={() => handleAlgorithmChange('BINARY_SEARCH')}
              icon={<Zap className="h-3 w-3" />}
            />
          </div>
        </div>

        <div className="flex w-full md:w-auto items-center justify-between gap-2">
          {/* Algorithm Selector Mobile - Visible only on small screens */}
          <div className="md:hidden flex items-center bg-muted/50 p-1 rounded-xl border border-white/5 backdrop-blur-sm">
            <AlgorithmTab
              label="Lin"
              isActive={algorithm === 'LINEAR_SEARCH'}
              onClick={() => handleAlgorithmChange('LINEAR_SEARCH')}
              icon={<Search className="h-3 w-3" />}
            />
            <AlgorithmTab
              label="Bin"
              isActive={algorithm === 'BINARY_SEARCH'}
              onClick={() => handleAlgorithmChange('BINARY_SEARCH')}
              icon={<Zap className="h-3 w-3" />}
            />
          </div>
          <InputControls />
        </div>
      </header>

      {/* Split Screen Container (Desktop) / Stacked (Mobile) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT: Canvas & Visuals (70%) */}
        <div className="relative flex flex-col flex-1 lg:w-[70%] min-h-[500px] lg:h-full overflow-hidden">
          {/* Visualizer Canvas Area */}
          <div className="flex-1 flex flex-col items-center justify-center relative min-h-[300px] md:min-h-[400px]">
            <div className="w-full max-w-7xl flex flex-col items-center z-10 transition-transform origin-top lg:origin-center">
              <div className="w-full overflow-hidden">
                <ArrayCanvas />
              </div>

              {/* Explanation Panel on Main Stage (Replaces MemoryInspector) */}
              <div className="mt-2 md:mt-8 lg:mt-12 mb-4 md:mb-12 w-full max-w-2xl px-4 flex justify-center">
                <div className="w-full">
                  <ExplanationPanel />
                </div>
              </div>
            </div>
          </div>

          {/* Floating Control Deck (Bottom Center of Left Panel) */}
          <div className="relative z-40 w-full pb-4 lg:pb-8 flex justify-center px-4">
            <div className="w-full max-w-md pointer-events-auto">
              <ControlDeck />
            </div>
          </div>
        </div>

        {/* RIGHT: Code & Info (30%) */}
        <div className="flex-none w-full lg:w-[30%] lg:border-l lg:border-dashed lg:border-zinc-200 dark:lg:border-white/10 lg:bg-white/30 dark:lg:bg-transparent lg:backdrop-blur-xl overflow-y-auto scrollbar-hide flex flex-col gap-4 p-4 lg:p-6 lg:h-full z-30 bg-white/50 dark:bg-black/50 border-t border-dashed lg:border-t-0">
          <div className="flex flex-col gap-4 h-full">
            {/* Title for Sidebar */}
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
              <div className="h-1 w-1 bg-orange-500 rounded-full" />
              Algorithm Details
            </div>

            <div className="flex flex-col gap-4">
              <ComplexityCard />
            </div>

            <div className="flex-1 min-h-[300px] flex flex-col">
              <CodeViewer />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AlgorithmTab({
  label,
  isActive,
  onClick,
  icon,
}: {
  label: string
  isActive: boolean
  onClick: () => void
  icon: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-[background-color,color,box-shadow]',
        isActive
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
      )}
    >
      {icon}
      {label}
    </button>
  )
}
