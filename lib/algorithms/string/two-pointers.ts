import { VisualizerFrame } from '@/lib/types/visualizer'

export const generatePalindromeFrames = (
  text: string
): VisualizerFrame<string>[] => {
  const frames: VisualizerFrame<string>[] = []
  const arr = text.split('')
  const n = arr.length
  let comparisons = 0

  let left = 0
  let right = n - 1

  // Initial Frame
  frames.push({
    array: [...arr],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: { left, right },
    explanation:
      'Starting Palindrome Check. We place pointers at the start (left) and end (right) of the string.',
    activeLine: 1,
    variables: { left, right, n },
    comparisons: 0,
    phase: 'search',
  })

  while (left < right) {
    comparisons++

    // Compare Frame
    frames.push({
      array: [...arr],
      highlights: [left, right],
      secondaryHighlights: [],
      visited: [],
      pointers: { left, right },
      explanation: `Comparing characters at indices ${left} ('${arr[left]}') and ${right} ('${arr[right]}').`,
      activeLine: 3,
      variables: { left, right, lChar: arr[left], rChar: arr[right] },
      comparisons,
      phase: 'compare',
    })

    if (arr[left] !== arr[right]) {
      // Mismatch
      frames.push({
        array: [...arr],
        highlights: [left, right], // Maybe red visual in canvas if phase is 'not-found'
        secondaryHighlights: [],
        visited: [],
        pointers: { left, right },
        explanation: `Mismatch found! '${arr[left]}' !== '${arr[right]}'. Not a palindrome.`,
        activeLine: 5,
        variables: { left, right, result: false },
        comparisons,
        phase: 'not-found', // Use this to trigger red color
        trace: `[Mismatch] '${arr[left]}' != '${arr[right]}'.`,
      })
      return frames
    }

    // Match - Move Inward
    frames.push({
      array: [...arr],
      highlights: [left, right],
      secondaryHighlights: [],
      visited: [], // Could mark previous matched indices as visited
      pointers: { left, right },
      explanation: `Match! '${arr[left]}' === '${arr[right]}'. Moving pointers inward.`,
      activeLine: 8,
      variables: { left, right },
      comparisons,
      phase: 'found', // Green flash
    })

    left++
    right--
  }

  // Success
  frames.push({
    array: [...arr],
    highlights: [],
    secondaryHighlights: [],
    visited: Array.from({ length: n }, (_, i) => i), // Mark all as visited/success
    pointers: {},
    explanation:
      'Loop finished. All compared characters matched. It is a palindrome!',
    activeLine: 12,
    variables: { result: true },
    comparisons,
    phase: 'found',
  })

  return frames
}
