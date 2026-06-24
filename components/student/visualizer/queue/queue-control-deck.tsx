'use client'

import { useQueueStore } from '@/lib/store/queue-visualizer-store'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Timer,
} from 'lucide-react'

export function QueueControlDeck() {
  const {
    isPlaying,
    playbackSpeed,
    currentFrame,
    frames,
    togglePlay,
    setSpeed,
    nextStep,
    prevStep,
    reset,
    setCurrentFrame,
  } = useQueueStore()

  const _progress =
    frames.length > 0 ? (currentFrame / (frames.length - 1)) * 100 : 0

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl shadow-2xl p-6">
      <div className="flex flex-col gap-6">
        {/* Progress / Time Travel Slider */}
        <div className="w-full px-1">
          <Slider
            value={[currentFrame]}
            min={0}
            max={frames.length > 0 ? frames.length - 1 : 0}
            step={1}
            onValueChange={(vals) => setCurrentFrame(vals[0])}
            className="w-full [&>.relative>.absolute]:bg-orange-500 [&>.relative]:bg-zinc-200 dark:[&>.relative]:bg-white/10"
          />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Main Controls */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={prevStep}
              disabled={currentFrame === 0}
              className="h-10 w-10 rounded-xl border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-orange-500/10 hover:text-orange-500 transition-all"
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              onClick={togglePlay}
              className="h-14 w-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 scale-110 md:scale-100 transition-all hover:scale-105 active:scale-95"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-1" />
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={nextStep}
              disabled={currentFrame === frames.length - 1}
              className="h-10 w-10 rounded-xl border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-orange-500/10 hover:text-orange-500 transition-all"
            >
              <SkipForward className="h-4 w-4" />
            </Button>

            <div className="w-[1px] h-8 bg-zinc-200 dark:bg-white/10 mx-2" />

            <Button
              variant="ghost"
              size="icon"
              onClick={reset}
              className="h-10 w-10 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/10 transition-all"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Speed & Stats */}
          <div className="flex items-center gap-8 w-full md:w-auto">
            <div className="flex flex-col gap-2 flex-1 md:w-48">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  <Timer className="h-3 w-3" />
                  Playback Speed
                </span>
                <span className="text-[10px] font-black text-orange-500">
                  {playbackSpeed}x
                </span>
              </div>
              <Slider
                value={[playbackSpeed]}
                min={0.5}
                max={3}
                step={0.5}
                onValueChange={(val) => setSpeed(val[0])}
                className="[&_[role=slider]]:bg-orange-500 [&_[role=slider]]:border-orange-500"
              />
            </div>

            <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Frame
              </span>
              <span className="text-xl font-black italic tracking-tighter text-zinc-900 dark:text-zinc-100">
                {currentFrame + 1}
                <span className="text-zinc-400 dark:text-zinc-600 font-normal">
                  /{frames.length}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
