import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import {
  AlgorithmType,
  VisualizerFrame,
  RecursionNode,
} from '@/lib/types/visualizer'
import { generateFibonacciFrames } from '@/lib/algorithms/recursion/fibonacci'
import { generateTowerOfHanoiFrames } from '@/lib/algorithms/recursion/tower-of-hanoi'
import { generateFactorialFrames } from '@/lib/algorithms/recursion/factorial'
import { generateSubsetsFrames } from '@/lib/algorithms/recursion/subsets'
interface RecursionState {
  algorithm: AlgorithmType
  isPlaying: boolean
  currentFrame: number
  playbackSpeed: number
  frames: VisualizerFrame<RecursionNode | any>[]
  nodes: RecursionNode[]
  // Actions
  setAlgorithm: (algo: AlgorithmType) => void
  setIsPlaying: (isPlaying: boolean) => void
  setCurrentFrame: (frame: number) => void
  setPlaybackSpeed: (speed: number) => void
  nextStep: () => void
  previousStep: () => void
  reset: () => void
  isRubberDuckMode: boolean
  toggleRubberDuckMode: () => void
  generateInput: () => void
}
export const useRecursionStore = create<RecursionState>((set, get) => ({
  algorithm: 'REC_FIBONACCI',
  isPlaying: false,
  currentFrame: 0,
  playbackSpeed: 1,
  frames: [],
  nodes: [],
  setAlgorithm: (algo) => {
    set({ algorithm: algo, currentFrame: 0, isPlaying: false })
    get().generateInput()
  },
  isRubberDuckMode: false,
  toggleRubberDuckMode: () =>
    set((state) => ({ isRubberDuckMode: !state.isRubberDuckMode })),
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
      case 'REC_FIBONACCI':
        frames = generateFibonacciFrames(5)
        break
      case 'REC_TOWER_OF_HANOI':
        frames = generateTowerOfHanoiFrames(3)
        break
      case 'REC_FACTORIAL':
        frames = generateFactorialFrames(5)
        break
      case 'REC_SUBSETS':
        frames = generateSubsetsFrames([1, 2, 3])
        break
      default:
        frames = []
    }
    set({ frames, currentFrame: 0, isPlaying: false })
  },
}))
export { useShallow }
