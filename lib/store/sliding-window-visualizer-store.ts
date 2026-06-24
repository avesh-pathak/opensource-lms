import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { VisualizerFrame } from '@/lib/types/visualizer'
import { generateMaxSumFrames } from '@/lib/algorithms/sliding-window/max-sum'
import { generateMinSizeSubarrayFrames } from '@/lib/algorithms/sliding-window/min-size-subarray'
import { generateLongestSubstringFrames } from '@/lib/algorithms/string/sliding-window'

export type SlidingWindowAlgorithmType =
  | 'SW_MAX_SUM'
  | 'SW_LONGEST_SUBSTRING'
  | 'SW_MIN_SIZE_SUBARRAY'

interface SlidingWindowState {
  algorithm: SlidingWindowAlgorithmType
  isPlaying: boolean
  currentFrame: number
  playbackSpeed: number
  frames: VisualizerFrame<number | string>[]
  k: number
  target: number
  inputString: string
  inputArray: number[]

  setAlgorithm: (algo: SlidingWindowAlgorithmType) => void
  setIsPlaying: (playing: boolean) => void
  setCurrentFrame: (frame: number) => void
  setPlaybackSpeed: (speed: number) => void
  nextStep: () => void
  previousStep: () => void
  reset: () => void
  generateInput: () => void
  setK: (k: number) => void
  setTarget: (target: number) => void
  setInputString: (s: string) => void
  setInputArray: (arr: number[]) => void
}

export const useSlidingWindowStore = create<SlidingWindowState>((set, get) => ({
  algorithm: 'SW_MAX_SUM',
  isPlaying: false,
  currentFrame: 0,
  playbackSpeed: 1,
  frames: [],
  k: 3,
  target: 9,
  inputString: 'abcabcbb',
  inputArray: [2, 1, 5, 1, 3, 2],

  setAlgorithm: (algorithm) => {
    const defaults: Record<
      SlidingWindowAlgorithmType,
      {
        inputArray?: number[]
        inputString?: string
        k?: number
        target?: number
      }
    > = {
      SW_MAX_SUM: { inputArray: [2, 1, 5, 1, 3, 2], k: 3 },
      SW_LONGEST_SUBSTRING: { inputString: 'abcabcbb' },
      SW_MIN_SIZE_SUBARRAY: { inputArray: [2, 1, 5, 1, 3, 2], target: 9 },
    }
    const d = defaults[algorithm]
    set({
      algorithm,
      currentFrame: 0,
      isPlaying: false,
      ...(d.inputArray !== undefined && { inputArray: d.inputArray }),
      ...(d.inputString !== undefined && { inputString: d.inputString }),
      ...(d.k !== undefined && { k: d.k }),
      ...(d.target !== undefined && { target: d.target }),
    })
    get().generateInput()
  },

  setIsPlaying: (isPlaying) => set({ isPlaying }),

  setCurrentFrame: (currentFrame) => {
    const { frames } = get()
    if (currentFrame >= 0 && currentFrame < frames.length) set({ currentFrame })
  },

  setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),

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
    if (currentFrame > 0) set({ currentFrame: currentFrame - 1 })
  },

  reset: () => set({ currentFrame: 0, isPlaying: false }),

  generateInput: () => {
    const { algorithm, k, target, inputString, inputArray } = get()
    let frames: VisualizerFrame<number | string>[] = []

    switch (algorithm) {
      case 'SW_MAX_SUM':
        frames = generateMaxSumFrames(inputArray, k)
        break
      case 'SW_LONGEST_SUBSTRING':
        frames = generateLongestSubstringFrames(inputString || 'abcabcbb')
        break
      case 'SW_MIN_SIZE_SUBARRAY':
        frames = generateMinSizeSubarrayFrames(inputArray, target)
        break
      default:
        frames = []
    }

    set({ frames, currentFrame: 0, isPlaying: false })
  },

  setK: (k) => set({ k }),
  setTarget: (target) => set({ target }),
  setInputString: (inputString) => set({ inputString }),
  setInputArray: (inputArray) => set({ inputArray }),
}))

export { useShallow }
