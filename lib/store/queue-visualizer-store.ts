import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { VisualizerFrame, AlgorithmType } from '@/lib/types/visualizer'
import { generateSlidingWindowMaxFrames } from '@/lib/algorithms/queue/sliding-window-max'
import { generateCircularQueueFrames } from '@/lib/algorithms/queue/circular-queue'
import { generateTaskSchedulingFrames } from '@/lib/algorithms/queue/task-scheduling'
import { generatePriorityQueueFrames } from '@/lib/algorithms/queue/priority-queue'
interface QueueVisualizerState {
  // Canvas State
  queue: (number | string)[]
  frames: VisualizerFrame[]
  currentFrame: number
  // Playback State
  isPlaying: boolean
  playbackSpeed: number
  // Config
  algorithm: AlgorithmType
  // Actions
  setQueue: (queue: (number | string)[]) => void
  setFrames: (frames: VisualizerFrame[]) => void
  setCurrentFrame: (frame: number) => void
  setAlgorithm: (algo: AlgorithmType) => void
  // Playback Controls
  togglePlay: () => void
  setSpeed: (speed: number) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
  generateInput: () => void
}
export const useQueueStore = create<QueueVisualizerState>((set, get) => ({
  queue: [],
  frames: [],
  currentFrame: 0,
  isPlaying: false,
  playbackSpeed: 1,
  algorithm: 'SLIDING_WINDOW_MAX',
  setQueue: (queue) => {
    const { algorithm } = get()
    let frames: VisualizerFrame[] = []
    if (algorithm === 'SLIDING_WINDOW_MAX') {
      frames = generateSlidingWindowMaxFrames(queue as number[], 3)
    } else if (algorithm === 'CIRCULAR_QUEUE') {
      const ops: { op: 'enqueue' | 'dequeue'; val?: string | number }[] =
        queue.map((val) => ({ op: 'enqueue', val }))
      frames = generateCircularQueueFrames(8, ops)
    }
    set({ queue, frames, currentFrame: 0, isPlaying: false })
  },
  setFrames: (frames) => set({ frames, currentFrame: 0, isPlaying: false }),
  setAlgorithm: (algorithm) => {
    set({ algorithm })
    get().generateInput()
  },
  setCurrentFrame: (currentFrame) => {
    const { frames } = get()
    if (currentFrame >= 0 && currentFrame < frames.length) {
      set({ currentFrame })
    }
  },
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setSpeed: (playbackSpeed) => set({ playbackSpeed }),
  nextStep: () => {
    const { currentFrame, frames } = get()
    if (currentFrame < frames.length - 1) {
      set({ currentFrame: currentFrame + 1 })
    } else {
      set({ isPlaying: false })
    }
  },
  prevStep: () => {
    const { currentFrame } = get()
    if (currentFrame > 0) {
      set({ currentFrame: currentFrame - 1 })
    }
  },
  reset: () => set({ currentFrame: 0, isPlaying: false }),
  generateInput: () => {
    const { algorithm } = get()
    let frames: VisualizerFrame[] = []
    let initialQueue: (number | string)[] = []
    if (algorithm === 'SLIDING_WINDOW_MAX') {
      initialQueue = Array.from(
        { length: 12 },
        () => Math.floor(Math.random() * 90) + 10
      )
      frames = generateSlidingWindowMaxFrames(initialQueue as number[], 3)
    } else if (algorithm === 'CIRCULAR_QUEUE') {
      initialQueue = ['A', 'B', 'C', 'D']
      const ops: { op: 'enqueue' | 'dequeue'; val?: string | number }[] = [
        { op: 'enqueue', val: 'A' },
        { op: 'enqueue', val: 'B' },
        { op: 'dequeue' },
        { op: 'enqueue', val: 'C' },
        { op: 'enqueue', val: 'D' },
        { op: 'enqueue', val: 'E' },
        { op: 'dequeue' },
      ]
      frames = generateCircularQueueFrames(5, ops)
    } else if (algorithm === 'TASK_SCHEDULING') {
      const tasks = [
        { id: 'P1', time: 10 },
        { id: 'P2', time: 4 },
        { id: 'P3', time: 7 },
      ]
      frames = generateTaskSchedulingFrames(tasks, 3)
      initialQueue = tasks.map((t) => t.id)
    } else if (algorithm === 'PRIORITY_QUEUE_SIM') {
      const items = [
        { val: 'A', priority: 5 },
        { val: 'B', priority: 2 },
        { val: 'C', priority: 8 },
        { val: 'D', priority: 1 },
      ]
      frames = generatePriorityQueueFrames(items)
      initialQueue = items.map((t) => t.val)
    }
    set({ queue: initialQueue, frames, currentFrame: 0, isPlaying: false })
  },
}))
export { useShallow }
