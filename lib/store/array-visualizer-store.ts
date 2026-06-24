import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { VisualizerFrame, AlgorithmType } from '@/lib/types/visualizer'
import {
  generateLinearSearchFrames,
  generateBinarySearchFrames,
} from '@/lib/algorithms/array/searching'
import { generateBubbleSortFrames } from '@/lib/algorithms/sorting/bubble'
import { generateSelectionSortFrames } from '@/lib/algorithms/sorting/selection'
import { generateInsertionSortFrames } from '@/lib/algorithms/sorting/insertion'
import { generateMergeSortFrames } from '@/lib/algorithms/sorting/merge'
import { generateQuickSortFrames } from '@/lib/algorithms/sorting/quick'
import { generatePalindromeCheckFrames } from '@/lib/algorithms/string/palindrome'
import { generateReverseStringFrames } from '@/lib/algorithms/string/reverse'
import { generateLCSFrames } from '@/lib/algorithms/string/lcs'
import { generateLongestSubstringFrames } from '@/lib/algorithms/string/sliding-window'
import { generateLongestPalindromicSubstringFrames } from '@/lib/algorithms/string/longest-palindromic-substring'
import { generateCountPalindromicSubstringsFrames } from '@/lib/algorithms/string/count-palindromic-substrings'

interface VisualizerState {
  // Canvas State
  array: (number | string)[]
  frames: VisualizerFrame[]
  currentFrame: number

  // Playback State
  isPlaying: boolean
  playbackSpeed: number // Multiplier, 1 is normal

  // Config
  algorithm: AlgorithmType
  target: number | null

  // Actions
  setArray: (arr: number[]) => void
  setFrames: (frames: VisualizerFrame[]) => void
  setCurrentFrame: (frame: number) => void
  setAlgorithm: (algo: AlgorithmType) => void

  // Playback Controls
  togglePlay: () => void
  setSpeed: (speed: number) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
  generateArray: () => void
  setCustomArray: (arr: number[]) => void
  setTarget: (target: number) => void
}

export const useVisualizerStore = create<VisualizerState>((set, get) => ({
  // Initial State
  array: [10, 25, 30, 45, 50, 65, 70, 85, 90], // Default sorted array
  frames: [],
  currentFrame: 0,

  isPlaying: false,
  playbackSpeed: 1,
  target: null,

  algorithm: 'LINEAR_SEARCH',

  // Actions
  setArray: (array) => set({ array, currentFrame: 0, frames: [] }),

  setFrames: (frames) => set({ frames, currentFrame: 0, isPlaying: false }),

  setAlgorithm: (algorithm) => {
    set({ algorithm })
    get().generateArray() // Re-generate frames when algorithm changes
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

  setCustomArray: (inputArray: number[]) => {
    const sortedArray = [...inputArray].sort((a, b) => a - b)
    const { algorithm } = get()
    // Default target to a random element for valid Search
    const target = sortedArray[Math.floor(Math.random() * sortedArray.length)]

    let frames: VisualizerFrame[] = []
    if (algorithm === 'LINEAR_SEARCH') {
      frames = generateLinearSearchFrames(sortedArray, target)
    } else if (algorithm === 'BINARY_SEARCH') {
      frames = generateBinarySearchFrames(sortedArray, target)
    }

    set({
      array: sortedArray,
      frames,
      currentFrame: 0,
      isPlaying: false,
      target,
    })
  },

  setTarget: (target: number) => {
    const { array, algorithm } = get()
    let frames: VisualizerFrame[] = []

    if (algorithm === 'LINEAR_SEARCH') {
      frames = generateLinearSearchFrames(array as number[], target)
    } else if (algorithm === 'BINARY_SEARCH') {
      frames = generateBinarySearchFrames(array as number[], target)
    }

    set({ frames, currentFrame: 0, isPlaying: false, target })
  },

  reset: () => set({ currentFrame: 0, isPlaying: false }),

  generateArray: () => {
    const { algorithm } = get()

    // String algorithms use characters, others use numbers
    const isStringAlgorithm = [
      'PALINDROME_CHECK',
      'REVERSE_STRING',
      'LONGEST_SUBSTRING',
      'LONGEST_PALINDROMIC_SUBSTRING',
      'COUNT_PALINDROMIC_SUBSTRINGS',
      'LONGEST_COMMON_SUBSEQUENCE',
    ].includes(algorithm)

    const isSortingAlgorithm = [
      'BUBBLE_SORT',
      'SELECTION_SORT',
      'INSERTION_SORT',
      'MERGE_SORT',
      'QUICK_SORT',
    ].includes(algorithm)

    if (isStringAlgorithm) {
      const letters = 'abcdefghijklmnopqrstuvwxyz'

      // Default random generator
      const getRandomString = (len: number) =>
        Array.from(
          { length: len },
          () => letters[Math.floor(Math.random() * letters.length)]
        ).join('')

      let newArray: string[] = []
      let frames: VisualizerFrame[] = []

      if (algorithm === 'PALINDROME_CHECK') {
        // Generate a guaranteed Palindrome
        const halfLen = 4 + Math.floor(Math.random() * 3) // 4-6 half length
        const half = getRandomString(halfLen)
        // 50% chance of even length, 50% chance of odd length (middle char)
        const isEven = Math.random() > 0.5
        const palindrome = isEven
          ? half + half.split('').reverse().join('')
          : half + getRandomString(1) + half.split('').reverse().join('')

        newArray = palindrome.split('')
        frames = generatePalindromeCheckFrames(newArray)
      } else if (algorithm === 'REVERSE_STRING') {
        // Any string works
        const str = getRandomString(8 + Math.floor(Math.random() * 5))
        newArray = str.split('')
        frames = generateReverseStringFrames(newArray)
      } else if (algorithm === 'LONGEST_SUBSTRING') {
        const str = getRandomString(8)
        newArray = str.split('')
        frames = generateLongestSubstringFrames(str)
      } else if (algorithm === 'LONGEST_PALINDROMIC_SUBSTRING') {
        const str = getRandomString(7)
        newArray = str.split('')
        frames = generateLongestPalindromicSubstringFrames(str)
      } else if (algorithm === 'COUNT_PALINDROMIC_SUBSTRINGS') {
        const str = getRandomString(6)
        newArray = str.split('')
        frames = generateCountPalindromicSubstringsFrames(str)
      } else if (algorithm === 'LONGEST_COMMON_SUBSEQUENCE') {
        // Generate Smart LCS Input (Guaranteed match)
        // 1. Generate a common base sequence
        const baseLen = 3 + Math.floor(Math.random() * 3) // 3-5 chars
        const base = getRandomString(baseLen)

        // 2. Inject noise into base to create s1
        let s1 = ''
        for (const char of base) {
          s1 +=
            getRandomString(Math.floor(Math.random() * 2)) +
            char +
            getRandomString(Math.floor(Math.random() * 2))
        }

        // 3. Inject DIFFERENT noise into base to create s2
        let s2 = ''
        for (const char of base) {
          s2 +=
            getRandomString(Math.floor(Math.random() * 2)) +
            char +
            getRandomString(Math.floor(Math.random() * 2))
        }

        // Ensure non-empty
        if (s1.length < 3) s1 = 'ABC' + s1
        if (s2.length < 3) s2 = 'DEF' + s2

        // Pass as single combined array with separator
        const combined = [...s1.split(''), '|', ...s2.split('')]
        frames = generateLCSFrames(combined)

        // LCS is special case, returns early with its own array
        set({
          array: combined,
          frames,
          currentFrame: 0,
          isPlaying: false,
          target: null,
        })
        return
      } else {
        // Fallback for unimplemented string algos
        const str = getRandomString(10)
        newArray = str.split('')
      }

      set({
        array: newArray,
        frames,
        currentFrame: 0,
        isPlaying: false,
        target: null,
      })
    } else if (isSortingAlgorithm) {
      // Generate UNSORTED array for sorting algorithms
      const newArray = Array.from(
        { length: 12 },
        () => Math.floor(Math.random() * 90) + 10
      )
      let frames: VisualizerFrame[] = []

      switch (algorithm) {
        case 'BUBBLE_SORT':
          frames = generateBubbleSortFrames(newArray)
          break
        case 'SELECTION_SORT':
          frames = generateSelectionSortFrames(newArray)
          break
        case 'INSERTION_SORT':
          frames = generateInsertionSortFrames(newArray)
          break
        case 'MERGE_SORT':
          frames = generateMergeSortFrames(newArray)
          break
        case 'QUICK_SORT':
          frames = generateQuickSortFrames(newArray)
          break
        default:
          break
      }

      // Other sorting algos will have empty frames for now
      set({
        array: newArray,
        frames,
        currentFrame: 0,
        isPlaying: false,
        target: null,
      })
    } else {
      // Search algorithms: Generate SORTED array
      const newArray = Array.from(
        { length: 12 },
        () => Math.floor(Math.random() * 90) + 10
      ).sort((a, b) => a - b)
      const uniqueArray = Array.from(new Set(newArray)) // Binary search needs unique for clarity

      // Pick a random target from the array
      const target =
        Math.random() > 0.3
          ? uniqueArray[Math.floor(Math.random() * uniqueArray.length)]
          : Math.floor(Math.random() * 100)

      // Generate Frames based on Algorithm
      let frames: VisualizerFrame[] = []

      if (algorithm === 'LINEAR_SEARCH') {
        frames = generateLinearSearchFrames(
          uniqueArray as number[],
          target as number
        )
      } else if (algorithm === 'BINARY_SEARCH') {
        frames = generateBinarySearchFrames(
          uniqueArray as number[],
          target as number
        )
      }

      set({
        array: uniqueArray,
        frames,
        currentFrame: 0,
        isPlaying: false,
        target,
      })
    }
  },
}))

export { useShallow }
