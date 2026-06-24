import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { VisualizerFrame } from '@/lib/types/visualizer'
import { generateTwoSumSortedFrames } from '@/lib/algorithms/two-pointers/two-sum-sorted'
import { generatePalindromeFrames } from '@/lib/algorithms/string/two-pointers'
import { generateSortColorsFrames } from '@/lib/algorithms/two-pointers/sort-colors'
import { generateContainerFrames } from '@/lib/algorithms/two-pointers/container'
export type TwoPointersAlgorithmType =
  | 'TP_TWO_SUM_SORTED'
  | 'TP_PALINDROME'
  | 'TP_SORT_COLORS'
  | 'TP_CONTAINER'
interface TwoPointersState {
  algorithm: TwoPointersAlgorithmType
  isPlaying: boolean
  currentFrame: number
  playbackSpeed: number
  frames: VisualizerFrame<number | string>[]
  target: number
  inputString: string
  inputArray: number[]
  setAlgorithm: (algo: TwoPointersAlgorithmType) => void
  setIsPlaying: (playing: boolean) => void
  setCurrentFrame: (frame: number) => void
  setPlaybackSpeed: (speed: number) => void
  nextStep: () => void
  previousStep: () => void
  reset: () => void
  generateInput: () => void
  setTarget: (target: number) => void
  setInputString: (s: string) => void
  setInputArray: (arr: number[]) => void
}
const DEFAULT_SORTED = [1, 3, 4, 5, 9, 12]
const DEFAULT_PALINDROME = 'racecar'
const DEFAULT_COLORS = [2, 0, 1, 2, 0, 1, 1, 0]
const DEFAULT_HEIGHTS = [1, 8, 6, 2, 5, 4, 8, 3, 7]
export const useTwoPointersStore = create<TwoPointersState>((set, get) => ({
  algorithm: 'TP_TWO_SUM_SORTED',
  isPlaying: false,
  currentFrame: 0,
  playbackSpeed: 1,
  frames: [],
  target: 9,
  inputString: DEFAULT_PALINDROME,
  inputArray: DEFAULT_SORTED,
  setAlgorithm: (algorithm) => {
    const defaults: Record<
      TwoPointersAlgorithmType,
      { inputArray?: number[]; inputString?: string; target?: number }
    > = {
      TP_TWO_SUM_SORTED: { inputArray: DEFAULT_SORTED, target: 9 },
      TP_PALINDROME: { inputString: DEFAULT_PALINDROME },
      TP_SORT_COLORS: { inputArray: DEFAULT_COLORS },
      TP_CONTAINER: { inputArray: DEFAULT_HEIGHTS },
    }
    const d = defaults[algorithm]
    set({
      algorithm,
      currentFrame: 0,
      isPlaying: false,
      ...(d.inputArray !== undefined && { inputArray: d.inputArray }),
      ...(d.inputString !== undefined && { inputString: d.inputString }),
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
    const { algorithm, target, inputString, inputArray } = get()
    let frames: VisualizerFrame<number | string>[] = []
    switch (algorithm) {
      case 'TP_TWO_SUM_SORTED':
        frames = generateTwoSumSortedFrames(
          inputArray.length ? inputArray : DEFAULT_SORTED,
          target
        )
        break
      case 'TP_PALINDROME':
        frames = generatePalindromeFrames(
          (inputString || DEFAULT_PALINDROME).trim()
        )
        break
      case 'TP_SORT_COLORS':
        frames = generateSortColorsFrames(
          inputArray.length ? inputArray : DEFAULT_COLORS
        )
        break
      case 'TP_CONTAINER':
        frames = generateContainerFrames(
          inputArray.length ? inputArray : DEFAULT_HEIGHTS
        )
        break
      default:
        frames = []
    }
    set({ frames, currentFrame: 0, isPlaying: false })
  },
  setTarget: (target) => set({ target }),
  setInputString: (inputString) => set({ inputString }),
  setInputArray: (inputArray) => set({ inputArray }),
}))
export { useShallow }
