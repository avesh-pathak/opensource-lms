import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { VisualizerFrame, AlgorithmType } from '@/lib/types/visualizer'
import { generateValidParenthesesFrames } from '@/lib/algorithms/stack/valid-parentheses'
import { generateNextGreaterElementFrames } from '@/lib/algorithms/stack/next-greater-element'
import { generateLargestRectangleFrames } from '@/lib/algorithms/stack/largest-rectangle'
import { generateMinStackFrames } from '@/lib/algorithms/stack/min-stack'

interface StackVisualizerState {
  // Canvas State
  stack: (number | string)[] // This is the input string/array
  frames: VisualizerFrame[]
  currentFrame: number

  // Playback State
  isPlaying: boolean
  playbackSpeed: number

  // Config
  algorithm: AlgorithmType

  // Actions
  setStack: (stack: (number | string)[]) => void
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

export const useStackStore = create<StackVisualizerState>((set, get) => ({
  stack: [],
  frames: [],
  currentFrame: 0,
  isPlaying: false,
  playbackSpeed: 1,
  algorithm: 'VALID_PARENTHESES',

  setStack: (stack) => {
    const { algorithm } = get()
    let frames: VisualizerFrame[] = []
    if (algorithm === 'VALID_PARENTHESES') {
      frames = generateValidParenthesesFrames(stack.join(''))
    } else if (algorithm === 'NEXT_GREATER_ELEMENT') {
      frames = generateNextGreaterElementFrames(stack as number[])
    } else if (algorithm === 'LARGEST_RECTANGLE') {
      frames = generateLargestRectangleFrames(stack as number[])
    } else if (algorithm === 'MIN_STACK') {
      // For Min Stack, we'd need a specific operation sequence, but we can reuse setStack for basic push/pop visualization
      // frames = generateMinStackFrames([...]);
    }
    set({ stack, frames, currentFrame: 0, isPlaying: false })
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
    let initialStack: (number | string)[] = []

    if (algorithm === 'VALID_PARENTHESES') {
      const brackets = '()[]{}'
      const input = Array.from(
        { length: 12 },
        () => brackets[Math.floor(Math.random() * brackets.length)]
      ).join('')
      initialStack = input.split('')
      frames = generateValidParenthesesFrames(input)
    } else if (algorithm === 'NEXT_GREATER_ELEMENT') {
      initialStack = Array.from(
        { length: 8 },
        () => Math.floor(Math.random() * 90) + 10
      )
      frames = generateNextGreaterElementFrames(initialStack as number[])
    } else if (algorithm === 'LARGEST_RECTANGLE') {
      initialStack = Array.from(
        { length: 10 },
        () => Math.floor(Math.random() * 20) + 5
      )
      frames = generateLargestRectangleFrames(initialStack as number[])
    } else if (algorithm === 'MIN_STACK') {
      const ops: { op: 'push' | 'pop'; val?: number }[] = []
      const nums = Array.from({ length: 5 }, () =>
        Math.floor(Math.random() * 100)
      )
      nums.forEach((n) => ops.push({ op: 'push', val: n }))
      ops.push({ op: 'pop' })
      ops.push({ op: 'pop' })
      ops.push({ op: 'push', val: Math.floor(Math.random() * 10) })
      frames = generateMinStackFrames(ops)
    }

    set({ stack: initialStack, frames, currentFrame: 0, isPlaying: false })
  },
}))

export { useShallow }
