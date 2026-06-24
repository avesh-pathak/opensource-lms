'use client'

import { useVisualizerStore } from '@/lib/store/array-visualizer-store'
import { Play, Pause, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { useEffect } from 'react'

export function VisualizerControls() {
  const {
    isPlaying,
    playbackSpeed,
    togglePlay,
    nextStep,
    prevStep,
    reset,
    setSpeed,
  } = useVisualizerStore()

  // Handle auto-play
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        nextStep()
      }, 1000 / playbackSpeed)
    }
    return () => clearInterval(interval)
  }, [isPlaying, playbackSpeed, nextStep])

  return (
    <div className="flex flex-col gap-4 rounded-full border border-zinc-200 bg-white/10 p-2 shadow-lg backdrop-blur-md md:flex-row md:items-center md:justify-between dark:border-zinc-800 dark:bg-black/20">
      {/* Playback Controls */}
      <div className="flex w-full items-center justify-between gap-1 md:w-auto md:justify-start">
        <Button
          variant="ghost"
          size="icon"
          onClick={reset}
          title="Reset"
          className="h-10 w-10 text-muted-foreground hover:bg-zinc-200/50 hover:text-foreground dark:hover:bg-zinc-800/50"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={prevStep}
          title="Previous Step"
          className="h-10 w-10 text-muted-foreground hover:bg-zinc-200/50 hover:text-foreground dark:hover:bg-zinc-800/50"
        >
          <SkipBack className="h-4 w-4" />
        </Button>

        <Button
          variant="default"
          size="icon"
          onClick={togglePlay}
          className={cn(
            'h-12 w-12 rounded-full shadow-md transition-all hover:scale-105 active:scale-95',
            isPlaying
              ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700'
              : 'bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
          )}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 text-white" />
          ) : (
            <Play className="h-5 w-5 fill-current text-white ml-0.5" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={nextStep}
          title="Next Step"
          className="h-10 w-10 text-muted-foreground hover:bg-zinc-200/50 hover:text-foreground dark:hover:bg-zinc-800/50"
        >
          <SkipForward className="h-4 w-4" />
        </Button>

        <div className="mx-2 h-8 w-px bg-zinc-200 dark:bg-zinc-800 md:hidden" />
      </div>

      {/* Speed Control */}
      <div className="flex w-full flex-1 items-center gap-4 px-4 md:border-l md:border-zinc-200/50 md:dark:border-zinc-800/50">
        <span className="min-w-max text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
          Speed
        </span>
        <Slider
          value={[playbackSpeed]}
          min={0.5}
          max={4}
          step={0.5}
          onValueChange={(val) => setSpeed(val[0])}
          className="w-full md:max-w-[200px]"
        />
        <span className="min-w-[2ch] text-xs font-mono font-medium text-muted-foreground">
          {playbackSpeed}x
        </span>
      </div>
    </div>
  )
}
