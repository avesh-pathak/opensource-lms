import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import type { VisualizerFrame } from '@/lib/types/visualizer'
import { generateHeapInsertFrames } from '@/lib/algorithms/heap/heap-insert'
import { generateHeapifyFrames } from '@/lib/algorithms/heap/heapify'
export type HeapAlgorithmType =
  | 'HEAP_INSERT'
  | 'HEAP_EXTRACT'
  | 'HEAP_HEAPIFY'
  | 'HEAP_SORT'
  | 'HEAP_BUILD'
export type HeapType = 'min' | 'max'
interface HeapState {
  algorithm: HeapAlgorithmType
  heapType: HeapType
  isPlaying: boolean
  currentFrame: number
  playbackSpeed: number
  frames: VisualizerFrame[]
  /** Current heap array (for display when no frames) */
  heap: number[]
  /** Last inserted value (for insert operation) */
  insertValue: number
  setAlgorithm: (algo: HeapAlgorithmType) => void
  setHeapType: (t: HeapType) => void
  setFrames: (frames: VisualizerFrame[]) => void
  setCurrentFrame: (f: number) => void
  togglePlay: () => void
  setSpeed: (s: number) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
  generateInput: () => void
  setInsertValue: (v: number) => void
  runInsert: () => void
  runHeapify: () => void
}
export const useHeapStore = create<HeapState>((set, get) => ({
  algorithm: 'HEAP_INSERT',
  heapType: 'min',
  isPlaying: false,
  currentFrame: 0,
  playbackSpeed: 1,
  frames: [],
  heap: [],
  insertValue: 10,
  setAlgorithm: (algorithm) => {
    set({ algorithm, currentFrame: 0, isPlaying: false })
    get().generateInput()
  },
  setHeapType: (heapType) => {
    set({ heapType, currentFrame: 0, isPlaying: false })
    get().generateInput()
  },
  setFrames: (frames) => set({ frames, currentFrame: 0, isPlaying: false }),
  setCurrentFrame: (currentFrame) => {
    const { frames } = get()
    if (currentFrame >= 0 && currentFrame < frames.length) set({ currentFrame })
  },
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
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
    if (currentFrame > 0) set({ currentFrame: currentFrame - 1 })
  },
  reset: () => set({ currentFrame: 0, isPlaying: false }),
  generateInput: () => {
    const { algorithm, heapType } = get()
    const initial = [30, 50, 20, 70, 40, 60, 80]
    let frames: VisualizerFrame[] = []
    if (algorithm === 'HEAP_INSERT') {
      const insertVal = get().insertValue
      frames = generateHeapInsertFrames(initial, insertVal, heapType === 'min')
    } else if (algorithm === 'HEAP_HEAPIFY' || algorithm === 'HEAP_BUILD') {
      const randomArr = Array.from(
        { length: 7 },
        () => Math.floor(Math.random() * 90) + 10
      )
      frames = generateHeapifyFrames(randomArr, heapType === 'min')
    }
    set({
      frames,
      heap: frames[0]?.array ?? initial,
      currentFrame: 0,
      isPlaying: false,
    })
  },
  setInsertValue: (insertValue) => set({ insertValue }),
  runInsert: () => {
    const { heap, insertValue, heapType } = get()
    const currentHeap = heap.length > 0 ? heap : [50, 30, 70, 20, 40]
    const frames = generateHeapInsertFrames(
      currentHeap,
      insertValue,
      heapType === 'min'
    )
    const lastFrame = frames[frames.length - 1]
    set({
      frames,
      heap: (lastFrame?.array as number[]) ?? [...currentHeap, insertValue],
      currentFrame: 0,
      isPlaying: false,
    })
  },
  runHeapify: () => {
    get().setAlgorithm('HEAP_HEAPIFY')
  },
}))
export { useShallow }
