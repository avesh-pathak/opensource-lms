import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import type { VisualizerFrame } from '@/lib/types/visualizer'
import { generateFibonacciDPFrames } from '@/lib/algorithms/dp/fibonacci'
export type DPAlgorithmType =
  | 'DP_FIBONACCI'
  | 'DP_CLIMB_STAIRS'
  | 'DP_KNAPSACK'
  | 'DP_LCS'
  | 'DP_COIN_CHANGE'
interface DPState {
  algorithm: DPAlgorithmType
  isPlaying: boolean
  currentFrame: number
  playbackSpeed: number
  frames: VisualizerFrame[]
  n: number
  setAlgorithm: (a: DPAlgorithmType) => void
  setCurrentFrame: (f: number) => void
  togglePlay: () => void
  setSpeed: (s: number) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
  generateInput: () => void
  setN: (n: number) => void
}
const DEFAULT_N = 6
const INITIAL_FRAMES = generateFibonacciDPFrames(DEFAULT_N)
export const useDPStore = create<DPState>((set, get) => ({
  algorithm: 'DP_FIBONACCI',
  isPlaying: false,
  currentFrame: 0,
  playbackSpeed: 1,
  frames: INITIAL_FRAMES,
  n: DEFAULT_N,
  setAlgorithm: (algorithm) => {
    set({ algorithm, currentFrame: 0, isPlaying: false })
    get().generateInput()
  },
  setCurrentFrame: (f) => {
    const { frames } = get()
    if (f >= 0 && f < frames.length) set({ currentFrame: f })
  },
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setSpeed: (playbackSpeed) => set({ playbackSpeed }),
  nextStep: () => {
    const { currentFrame, frames } = get()
    if (currentFrame < frames.length - 1)
      set({ currentFrame: currentFrame + 1 })
    else set({ isPlaying: false })
  },
  prevStep: () => {
    const { currentFrame } = get()
    if (currentFrame > 0) set({ currentFrame: currentFrame - 1 })
  },
  reset: () => set({ currentFrame: 0, isPlaying: false }),
  generateInput: () => {
    const { n, algorithm } = get()
    let frames: VisualizerFrame[] = []
    if (algorithm === 'DP_FIBONACCI') frames = generateFibonacciDPFrames(n)
    set({ frames, currentFrame: 0, isPlaying: false })
  },
  setN: (n) => set({ n }),
}))
export { useShallow }
