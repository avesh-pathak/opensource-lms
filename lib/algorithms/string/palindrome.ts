import { VisualizerFrame } from '@/lib/types/visualizer'

// Palindrome Check Frame Generator
export function generatePalindromeCheckFrames(
  text: string[]
): VisualizerFrame[] {
  const frames: VisualizerFrame[] = []
  const n = text.length
  let left = 0
  let right = n - 1
  let comparisons = 0

  // Initial frame
  frames.push({
    array: [...text],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: { left, right },
    ranges: [
      { start: left, end: left, type: 'active' },
      { start: right, end: right, type: 'active' },
    ],
    phase: 'search',
    explanation:
      'Starting Palindrome Check. We place pointers at the start (left) and end (right) of the string.',
    activeLine: 1,
    variables: {},
    comparisons,
  })

  // Check palindrome
  while (left < right) {
    comparisons++

    // Highlight comparison
    frames.push({
      array: [...text],
      highlights: [left, right],
      secondaryHighlights: [],
      visited: [],
      pointers: { left, right },
      ranges: [
        { start: left, end: left, type: 'active' },
        { start: right, end: right, type: 'active' },
      ],
      phase: 'search',
      explanation: `Checking index ${left}: Is ${text[left]} == ${text[right]}?`,
      activeLine: 4,
      variables: {},
      comparisons,
    })

    if (text[left] !== text[right]) {
      // Not a palindrome
      frames.push({
        array: [...text],
        highlights: [left, right],
        secondaryHighlights: [],
        visited: [],
        pointers: { left, right },
        ranges: [],
        phase: 'not-found',
        explanation: `Return False (Mismatch)`,
        activeLine: 5,
        variables: {},
        comparisons,
      })
      return frames
    }

    // Move pointers inward
    left++
    right--

    if (left < right) {
      frames.push({
        array: [...text],
        highlights: [],
        secondaryHighlights: [],
        visited: [],
        pointers: { left, right },
        ranges: [
          { start: left, end: left, type: 'active' },
          { start: right, end: right, type: 'active' },
        ],
        phase: 'search',
        explanation: `// Move pointers inward\nIncrement left\nDecrement right`,
        activeLine: 9,
        variables: {},
        comparisons,
      })
    }
  }

  // Is palindrome
  frames.push({
    array: [...text],
    highlights: [],
    secondaryHighlights: [],
    visited: Array.from({ length: n }, (_, i) => i),
    pointers: { left, right },
    ranges: [],
    phase: 'found',
    explanation: 'Return True (Palindrome)',
    activeLine: 12,
    variables: {},
    comparisons,
  })

  return frames
}
