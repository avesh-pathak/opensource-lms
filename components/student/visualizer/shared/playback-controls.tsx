'use client'

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

export interface PlaybackControlsProps {
  isPlaying: boolean
  onTogglePlay: () => void
  onNext: () => void
  onPrevious: () => void
  onReset: () => void
  playbackSpeed: number
  onSpeedChange: (speed: number) => void
  currentFrame: number
  totalFrames: number
  /** Tailwind accent for play button and slider (e.g. 'orange', 'amber') */
  accentColor?:
    | 'orange'
    | 'indigo'
    | 'rose'
    | 'amber'
    | 'emerald'
    | 'lime'
    | 'fuchsia'
    | 'teal'
    | 'violet'
    | 'red'
    | 'sky'
  /** Optional: show frame scrubber */
  showFrameScrubber?: boolean
  onFrameChange?: (frame: number) => void
  className?: string
}

const accentPlayClass: Record<
  NonNullable<PlaybackControlsProps['accentColor']>,
  string
> = {
  orange: 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20',
  indigo: 'bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/20',
  rose: 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20',
  amber: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20',
  emerald: 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20',
  lime: 'bg-lime-500 hover:bg-lime-600 shadow-lime-500/20',
  fuchsia: 'bg-fuchsia-500 hover:bg-fuchsia-600 shadow-fuchsia-500/20',
  teal: 'bg-teal-500 hover:bg-teal-600 shadow-teal-500/20',
  violet: 'bg-violet-500 hover:bg-violet-600 shadow-violet-500/20',
  red: 'bg-red-500 hover:bg-red-600 shadow-red-500/20',
  sky: 'bg-sky-500 hover:bg-sky-600 shadow-sky-500/20',
}

const accentSliderClass: Record<
  NonNullable<PlaybackControlsProps['accentColor']>,
  string
> = {
  orange: '[&>.relative>.absolute]:bg-orange-500',
  indigo: '[&>.relative>.absolute]:bg-indigo-500',
  rose: '[&>.relative>.absolute]:bg-rose-500',
  amber: '[&>.relative>.absolute]:bg-amber-500',
  emerald: '[&>.relative>.absolute]:bg-emerald-500',
  lime: '[&>.relative>.absolute]:bg-lime-500',
  fuchsia: '[&>.relative>.absolute]:bg-fuchsia-500',
  teal: '[&>.relative>.absolute]:bg-teal-500',
  violet: '[&>.relative>.absolute]:bg-violet-500',
  red: '[&>.relative>.absolute]:bg-red-500',
  sky: '[&>.relative>.absolute]:bg-sky-500',
}

export function PlaybackControls({
  isPlaying,
  onTogglePlay,
  onNext,
  onPrevious,
  onReset,
  playbackSpeed,
  onSpeedChange,
  currentFrame,
  totalFrames,
  accentColor = 'indigo',
  showFrameScrubber = false,
  onFrameChange,
  className,
}: PlaybackControlsProps) {
  const playClass = accentPlayClass[accentColor]
  const sliderClass = accentSliderClass[accentColor]

  return (
    <div
      className={cn(
        'flex items-center gap-4 p-2 rounded-full border border-white/40 dark:border-white/20 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-2xl shadow-2xl',
        className
      )}
    >
      <div className="flex items-center gap-1 pl-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onReset}
          className="h-10 w-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-zinc-300 dark:bg-white/10 mx-2" />
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrevious}
          disabled={currentFrame === 0}
          className="h-10 w-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300 transition-colors disabled:opacity-50"
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          onClick={onTogglePlay}
          className={cn(
            'h-12 w-12 rounded-full shadow-lg transition-all hover:scale-105',
            isPlaying
              ? 'bg-zinc-800 dark:bg-zinc-800 text-red-400 hover:bg-zinc-700 border border-red-500/20'
              : playClass + ' text-white'
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
          onClick={onNext}
          disabled={totalFrames === 0 || currentFrame >= totalFrames - 1}
          className="h-10 w-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300 transition-colors disabled:opacity-50"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      {showFrameScrubber && onFrameChange && totalFrames > 0 && (
        <>
          <div className="w-px h-8 bg-zinc-300 dark:bg-white/10 mx-1" />
          <div className="flex items-center gap-2 min-w-[120px] px-2">
            <span className="text-[10px] font-mono font-bold text-zinc-400 w-10 text-right">
              {currentFrame}/{totalFrames - 1 || 0}
            </span>
            <Slider
              value={[currentFrame]}
              min={0}
              max={Math.max(0, totalFrames - 1)}
              step={1}
              onValueChange={(v) => onFrameChange(v[0])}
              className={cn(
                'w-24',
                sliderClass,
                '[&>.relative]:bg-zinc-200 dark:[&>.relative]:bg-white/10'
              )}
            />
          </div>
        </>
      )}

      <div className="w-px h-8 bg-zinc-300 dark:bg-white/10 mx-1" />
      <div className="flex items-center gap-3 pr-4 min-w-[120px]">
        <FastForward className="h-4 w-4 text-zinc-500" />
        <Slider
          value={[playbackSpeed]}
          min={0.5}
          max={4}
          step={0.5}
          onValueChange={(v) => onSpeedChange(v[0])}
          className={cn(
            'w-24 [&>.relative]:bg-zinc-300 dark:[&>.relative]:bg-white/20',
            sliderClass
          )}
        />
        <span className="text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-400 w-6">
          {playbackSpeed}x
        </span>
      </div>
    </div>
  )
}
