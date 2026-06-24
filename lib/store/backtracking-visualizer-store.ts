import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
export type BacktrackingAlgorithmType =
  | 'BT_SUBSETS'
  | 'BT_PERMUTATIONS'
  | 'BT_N_QUEENS'
export interface BTFrame {
  subsets: number[][]
  current: number[]
  explanation: string
  activeLine: number
}
interface BacktrackingState {
  algorithm: BacktrackingAlgorithmType
  isPlaying: boolean
  currentFrame: number
  playbackSpeed: number
  frames: BTFrame[]
  nums: number[]
  setAlgorithm: (a: BacktrackingAlgorithmType) => void
  setCurrentFrame: (f: number) => void
  togglePlay: () => void
  setSpeed: (s: number) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
  generateInput: () => void
}
function generateSubsetsFrames(nums: number[]): BTFrame[] {
  const frames: BTFrame[] = []
  const result: number[][] = []
  function backtrack(start: number, current: number[]) {
    frames.push({
      subsets: result.map((r) => [...r]),
      current: [...current],
      explanation: current.length
        ? `Current path: [${current.join(', ')}]. Exploring...`
        : 'Start from empty subset.',
      activeLine: 1,
    })
    result.push([...current])
    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]!)
      backtrack(i + 1, current)
      current.pop()
    }
  }
  backtrack(0, [])
  frames.push({
    subsets: result.map((r) => [...r]),
    current: [],
    explanation: `Done. Found ${result.length} subsets.`,
    activeLine: 2,
  })
  return frames
}
export const useBacktrackingStore = create<BacktrackingState>((set, get) => ({
  algorithm: 'BT_SUBSETS',
  isPlaying: false,
  currentFrame: 0,
  playbackSpeed: 1,
  frames: [],
  nums: [1, 2, 3],
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
    const { nums, algorithm } = get()
    let frames: BTFrame[] = []
    if (algorithm === 'BT_SUBSETS') frames = generateSubsetsFrames(nums)
    set({ frames, currentFrame: 0, isPlaying: false })
  },
}))
export { useShallow }
