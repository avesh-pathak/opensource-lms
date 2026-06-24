'use client'

import { useCallback } from 'react'
import type { PlaybackControlsProps } from '@/components/student/visualizer/shared/playback-controls'

export interface PlaybackStore {
  isPlaying: boolean
  currentFrame: number
  frames: unknown[]
  playbackSpeed: number
  togglePlay?: () => void
  setIsPlaying?: (v: boolean) => void
  nextStep: () => void
  prevStep?: () => void
  previousStep?: () => void
  reset: () => void
  setSpeed: (s: number) => void
  setPlaybackSpeed?: (s: number) => void
  setCurrentFrame?: (f: number) => void
}

/**
 * Maps a Zustand-style visualizer store to props for PlaybackControls.
 * Handles different store shapes (togglePlay vs setIsPlaying, prevStep vs previousStep, etc.).
 */
export function usePlaybackControls(
  store: PlaybackStore,
  options?: {
    accentColor?: PlaybackControlsProps['accentColor']
    showFrameScrubber?: boolean
  }
): PlaybackControlsProps {
  const {
    isPlaying,
    currentFrame,
    frames,
    playbackSpeed,
    nextStep,
    reset,
    setCurrentFrame,
  } = store

  const togglePlay = useCallback(
    () => store.togglePlay?.() ?? store.setIsPlaying?.(!store.isPlaying),
    [store.togglePlay, store.setIsPlaying, store.isPlaying]
  )
  const prevStep = useCallback(
    () => (store.prevStep ?? store.previousStep ?? (() => {}))(),
    [store.prevStep, store.previousStep]
  )
  const setSpeed = useCallback(
    (s: number) => (store.setSpeed ?? store.setPlaybackSpeed ?? (() => {}))(s),
    [store.setSpeed, store.setPlaybackSpeed]
  )

  const onFrameChange = useCallback(
    (frame: number) => {
      setCurrentFrame?.(frame)
    },
    [setCurrentFrame]
  )

  return {
    isPlaying,
    onTogglePlay: togglePlay,
    onNext: nextStep,
    onPrevious: prevStep,
    onReset: reset,
    playbackSpeed,
    onSpeedChange: setSpeed,
    currentFrame,
    totalFrames: frames.length,
    accentColor: options?.accentColor ?? 'indigo',
    showFrameScrubber: options?.showFrameScrubber ?? true,
    onFrameChange: setCurrentFrame ? onFrameChange : undefined,
  }
}
