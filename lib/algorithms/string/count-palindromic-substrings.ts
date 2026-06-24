import { VisualizerFrame } from '@/lib/types/visualizer'

export const generateCountPalindromicSubstringsFrames = (
  text: string
): VisualizerFrame<string>[] => {
  const frames: VisualizerFrame<string>[] = []
  const arr = text.split('')
  const n = arr.length
  let comparisons = 0
  let count = 0

  // Initial Frame
  frames.push({
    array: [...arr],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    explanation:
      'Starting Count Palindromic Substrings. We expand around every center and increment count.',
    activeLine: 1,
    variables: { count: 0 },
    comparisons: 0,
    phase: 'search',
  })

  const expandAroundCenter = (left: number, right: number) => {
    while (left >= 0 && right < n && arr[left] === arr[right]) {
      count++
      comparisons++

      frames.push({
        array: [...arr],
        highlights: [left, right],
        secondaryHighlights: [],
        visited: [],
        pointers: { left, right },
        explanation: `Palindrome found at [${left}...${right}] ("${text.substring(left, right + 1)}"). Count is now ${count}.`,
        activeLine: 5,
        variables: { left, right, count, sub: text.substring(left, right + 1) },
        comparisons,
        phase: 'found', // Green flash
      })

      left--
      right++
    }
  }

  for (let i = 0; i < n; i++) {
    expandAroundCenter(i, i) // Odd
    expandAroundCenter(i, i + 1) // Even
  }

  frames.push({
    array: [...arr],
    highlights: [],
    secondaryHighlights: [],
    visited: Array.from({ length: n }, (_, i) => i),
    pointers: {},
    explanation: `Finished! Total Palindromic Substrings: ${count}.`,
    activeLine: 10,
    variables: { count },
    comparisons,
    phase: 'found',
  })

  return frames
}
