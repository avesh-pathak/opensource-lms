'use client'

import { useMemo } from 'react'

export interface UseVisualizerFramesOptions<T> {
  frames: T[]
  currentFrame: number
}

export interface VisualizerFramesResult<T> {
  frame: T | null
  isFirst: boolean
  isLast: boolean
  progress: number
  totalFrames: number
}

/**
 * Returns the current frame and derived state (progress, isFirst, isLast).
 */
export function useVisualizerFrames<T>({
  frames,
  currentFrame,
}: UseVisualizerFramesOptions<T>): VisualizerFramesResult<T> {
  return useMemo(() => {
    const total = frames.length
    const frame =
      total > 0 && currentFrame >= 0 && currentFrame < total
        ? frames[currentFrame]!
        : null
    const progress =
      total <= 1 ? 100 : (currentFrame / Math.max(1, total - 1)) * 100
    return {
      frame,
      isFirst: currentFrame === 0,
      isLast: total === 0 || currentFrame >= total - 1,
      progress,
      totalFrames: total,
    }
  }, [frames, currentFrame])
}
