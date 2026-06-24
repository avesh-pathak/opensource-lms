'use client'

import { useStackStore } from '@/lib/store/stack-visualizer-store'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  FastForward,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function StackControlDeck() {
  const {
    isPlaying,
    togglePlay,
    nextStep,
    prevStep,
    reset,
    playbackSpeed,
    setSpeed,
    currentFrame,
    frames,
    setCurrentFrame,
  } = useStackStore()

  return (
    <div className="flex items-center gap-4 p-2 rounded-full border border-white/40 dark:border-white/20 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-2xl shadow-2xl">
      {/* Playback Controls */}
      <div className="flex items-center gap-1 pl-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={reset}
          className="h-10 w-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-zinc-300 dark:bg-white/10 mx-2" />

        <Button
          variant="ghost"
          size="icon"
          onClick={prevStep}
          className="h-10 w-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300 transition-colors"
        >
          <SkipBack className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          onClick={togglePlay}
          className={cn(
            'h-12 w-12 rounded-full shadow-lg transition-all hover:scale-105',
            isPlaying
              ? 'bg-zinc-800 dark:bg-zinc-800 text-red-500 hover:bg-zinc-700 border border-red-500/20'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'
          )}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 fill-current" />
          ) : (
            <Play className="h-5 w-5 fill-current pl-1" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={nextStep}
          className="h-10 w-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300 transition-colors"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      {/* Time Travel Scrubber */}
      <div className="flex items-center gap-2 min-w-[140px] px-2">
        <span className="text-[10px] font-mono font-bold text-zinc-400 dark:text-zinc-600 w-8 text-right">
          {currentFrame}/{frames.length > 0 ? frames.length - 1 : 0}
        </span>
        <Slider
          value={[currentFrame]}
          min={0}
          max={frames.length > 0 ? frames.length - 1 : 0}
          step={1}
          onValueChange={(vals) => setCurrentFrame(vals[0])}
          className="w-32 [&>.relative>.absolute]:bg-purple-500 [&>.relative]:bg-zinc-200 dark:[&>.relative]:bg-white/10"
        />
      </div>

      {/* Speed Control Divider */}
      <div className="w-px h-8 bg-zinc-300 dark:bg-white/10 mx-1" />

      {/* Speed Slider */}
      <div className="flex items-center gap-3 pr-4 min-w-[120px]">
        <FastForward className="h-4 w-4 text-zinc-500" />
        <Slider
          value={[playbackSpeed]}
          min={0.5}
          max={4}
          step={0.5}
          onValueChange={(vals) => setSpeed(vals[0])}
          className="w-24 [&>.relative>.absolute]:bg-indigo-500 [&>.relative]:bg-zinc-300 dark:[&>.relative]:bg-white/20"
        />
        <span className="text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-400 w-6">
          {playbackSpeed}x
        </span>
      </div>
    </div>
  )
}
