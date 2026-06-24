import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
export type GreedyAlgorithmType =
  | 'GR_ACTIVITY_SELECTION'
  | 'GR_FRACTIONAL_KNAPSACK'
  | 'GR_JUMP_GAME'
export interface GreedyFrame {
  picked: number[]
  explanation: string
  activeLine: number
  array: number[]
}
interface GreedyState {
  algorithm: GreedyAlgorithmType
  isPlaying: boolean
  currentFrame: number
  playbackSpeed: number
  frames: GreedyFrame[]
  activities: [number, number][]
  setAlgorithm: (a: GreedyAlgorithmType) => void
  setCurrentFrame: (f: number) => void
  togglePlay: () => void
  setSpeed: (s: number) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
  generateInput: () => void
}
function generateActivitySelectionFrames(
  intervals: [number, number][]
): GreedyFrame[] {
  const frames: GreedyFrame[] = []
  const sorted = [...intervals].sort((a, b) => a[1] - b[1])
  const picked: number[] = []
  let lastEnd = -1
  sorted.forEach(([s, e], i) => {
    frames.push({
      array: sorted.flat(),
      picked: [...picked],
      explanation:
        picked.length === 0
          ? `Pick first activity: [${s}, ${e}].`
          : `Check [${s}, ${e}]. Start ${s} >= lastEnd ${lastEnd}? ${s >= lastEnd ? 'Yes — pick.' : 'No — skip.'}`,
      activeLine: 1,
    })
    if (s >= lastEnd) {
      picked.push(i)
      lastEnd = e
    }
  })
  frames.push({
    array: sorted.flat(),
    picked: [...picked],
    explanation: `Done. Selected ${picked.length} activities.`,
    activeLine: 2,
  })
  return frames
}
export const useGreedyStore = create<GreedyState>((set, get) => ({
  algorithm: 'GR_ACTIVITY_SELECTION',
  isPlaying: false,
  currentFrame: 0,
  playbackSpeed: 1,
  frames: [],
  activities: [
    [1, 3],
    [2, 4],
    [3, 5],
    [0, 6],
  ],
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
    const { activities, algorithm } = get()
    let frames: GreedyFrame[] = []
    if (algorithm === 'GR_ACTIVITY_SELECTION')
      frames = generateActivitySelectionFrames(activities)
    set({ frames, currentFrame: 0, isPlaying: false })
  },
}))
export { useShallow }
