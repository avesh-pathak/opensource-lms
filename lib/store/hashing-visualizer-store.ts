import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import {
  AlgorithmType,
  VisualizerFrame,
  HashBucket,
} from '@/lib/types/visualizer'
import { generateTwoSumFrames } from '@/lib/algorithms/hashing/two-sum'
import { generateConsecutiveFrames } from '@/lib/algorithms/hashing/consecutive'
import { generateCollisionFrames } from '@/lib/algorithms/hashing/collision'
interface HashingState {
  algorithm: AlgorithmType
  isPlaying: boolean
  currentFrame: number
  playbackSpeed: number
  frames: VisualizerFrame<HashBucket | number | string>[] // Can be buckets, numbers, or strings (for input array)
  buckets: HashBucket[]
  // Actions
  setAlgorithm: (algo: AlgorithmType) => void
  setIsPlaying: (isPlaying: boolean) => void
  setCurrentFrame: (frame: number) => void
  setPlaybackSpeed: (speed: number) => void
  nextStep: () => void
  previousStep: () => void
  reset: () => void
  generateInput: () => void
}
export const useHashingStore = create<HashingState>((set, get) => ({
  algorithm: 'HASH_TWO_SUM',
  isPlaying: false,
  currentFrame: 0,
  playbackSpeed: 1,
  frames: [],
  buckets: [],
  setAlgorithm: (algo) => {
    set({ algorithm: algo, currentFrame: 0, isPlaying: false })
    get().generateInput()
  },
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentFrame: (frame) => set({ currentFrame: frame }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  nextStep: () => {
    const { currentFrame, frames } = get()
    if (currentFrame < frames.length - 1) {
      set({ currentFrame: currentFrame + 1 })
    } else {
      set({ isPlaying: false })
    }
  },
  previousStep: () => {
    const { currentFrame } = get()
    if (currentFrame > 0) {
      set({ currentFrame: currentFrame - 1 })
    }
  },
  reset: () => {
    set({ currentFrame: 0, isPlaying: false })
  },
  generateInput: () => {
    const { algorithm } = get()
    let frames: any[] = []
    switch (algorithm) {
      case 'HASH_TWO_SUM':
        frames = generateTwoSumFrames([2, 7, 11, 15, 6, 3], 9)
        break
      case 'HASH_CONSECUTIVE':
        frames = generateConsecutiveFrames([100, 4, 200, 1, 3, 2])
        break
      case 'HASH_COLLISION':
        frames = generateCollisionFrames(
          ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve'],
          10
        )
        break
      default:
        frames = []
    }
    set({ frames, currentFrame: 0, isPlaying: false })
  },
}))
export { useShallow }
