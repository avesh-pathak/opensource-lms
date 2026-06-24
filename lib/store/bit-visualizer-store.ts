import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
export type BitAlgorithmType = 'BIT_AND_OR_XOR' | 'BIT_SHIFTS' | 'BIT_MASK'
export interface BitFrame {
  a: number
  b: number
  result: number
  op: string
  binaryA: string
  binaryB: string
  binaryResult: string
  explanation: string
  activeLine: number
  highlightBit?: number
}
interface BitState {
  algorithm: BitAlgorithmType
  isPlaying: boolean
  currentFrame: number
  playbackSpeed: number
  frames: BitFrame[]
  a: number
  b: number
  setAlgorithm: (a: BitAlgorithmType) => void
  setCurrentFrame: (f: number) => void
  togglePlay: () => void
  setSpeed: (s: number) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
  generateInput: () => void
  setA: (n: number) => void
  setB: (n: number) => void
}
function toBin(n: number, bits = 8): string {
  return (n >>> 0).toString(2).padStart(bits, '0')
}
function generateBitOpFrames(a: number, b: number): BitFrame[] {
  const and = a & b
  const or = a | b
  const xor = a ^ b
  return [
    {
      a,
      b,
      result: and,
      op: 'AND',
      binaryA: toBin(a),
      binaryB: toBin(b),
      binaryResult: toBin(and),
      explanation: `${a} & ${b} = ${and}. Bitwise AND: 1 only where both bits are 1.`,
      activeLine: 1,
    },
    {
      a,
      b,
      result: or,
      op: 'OR',
      binaryA: toBin(a),
      binaryB: toBin(b),
      binaryResult: toBin(or),
      explanation: `${a} | ${b} = ${or}. Bitwise OR: 1 where either bit is 1.`,
      activeLine: 2,
    },
    {
      a,
      b,
      result: xor,
      op: 'XOR',
      binaryA: toBin(a),
      binaryB: toBin(b),
      binaryResult: toBin(xor),
      explanation: `${a} ^ ${b} = ${xor}. Bitwise XOR: 1 where bits differ.`,
      activeLine: 3,
    },
  ]
}
export const useBitStore = create<BitState>((set, get) => ({
  algorithm: 'BIT_AND_OR_XOR',
  isPlaying: false,
  currentFrame: 0,
  playbackSpeed: 1,
  frames: [],
  a: 12,
  b: 25,
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
    const { a, b, algorithm } = get()
    let frames: BitFrame[] = []
    if (algorithm === 'BIT_AND_OR_XOR') frames = generateBitOpFrames(a, b)
    set({ frames, currentFrame: 0, isPlaying: false })
  },
  setA: (a) => set({ a }),
  setB: (b) => set({ b }),
}))
export { useShallow }
