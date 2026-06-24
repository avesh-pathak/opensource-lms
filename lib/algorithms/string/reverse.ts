import { VisualizerFrame } from '@/lib/types/visualizer'

export function generateReverseStringFrames(text: string[]): VisualizerFrame[] {
  const frames: VisualizerFrame[] = []
  const n = text.length
  const arr = [...text] // Working copy
  let left = 0
  let right = n - 1
  let comparisons = 0

  // Initial State
  frames.push({
    array: [...arr],
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
      'We start with pointers at the beginning (left) and end (right) of the string.',
    activeLine: 1,
    variables: {},
    comparisons,
  })

  while (left < right) {
    comparisons++

    // Visualize Swap
    frames.push({
      array: [...arr],
      highlights: [left, right], // Highlight elements to be swapped
      secondaryHighlights: [],
      visited: [],
      pointers: { left, right },
      ranges: [
        { start: left, end: left, type: 'active' },
        { start: right, end: right, type: 'active' },
      ],
      phase: 'compare',
      explanation: `Swapping characters at index ${left} ('${arr[left]}') and ${right} ('${arr[right]}')`,
      activeLine: 3,
      variables: { temp: arr[left] },
      comparisons,
    })

    // Perform Swap
    ;[arr[left], arr[right]] = [arr[right], arr[left]]

    // Show Post-Swap State
    frames.push({
      array: [...arr], // Updated array
      highlights: [left, right], // Keep highlighted
      secondaryHighlights: [],
      visited: [],
      pointers: { left, right },
      ranges: [
        { start: left, end: left, type: 'active' },
        { start: right, end: right, type: 'active' },
      ],
      phase: 'compare',
      explanation: `Swapped: '${arr[left]}' is now at ${left}, '${arr[right]}' is now at ${right}`,
      activeLine: 4,
      variables: {},
      comparisons,
    })

    // Move Pointers
    left++
    right--

    if (left < right) {
      frames.push({
        array: [...arr],
        highlights: [],
        secondaryHighlights: [],
        visited: [],
        pointers: { left, right },
        ranges: [
          { start: left, end: left, type: 'active' },
          { start: right, end: right, type: 'active' },
        ],
        phase: 'search',
        explanation: 'Moving pointers inward...',
        activeLine: 5,
        variables: {},
        comparisons,
      })
    }
  }

  // Final State
  frames.push({
    array: [...arr],
    highlights: [],
    secondaryHighlights: [],
    visited: Array.from({ length: n }, (_, i) => i), // Mark all as visited/completed
    pointers: {},
    ranges: [],
    phase: 'found',
    explanation: 'String reversal complete!',
    activeLine: 6,
    variables: {},
    comparisons,
  })

  return frames
}
