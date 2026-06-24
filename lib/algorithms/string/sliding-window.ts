import { VisualizerFrame } from '@/lib/types/visualizer'

export const generateLongestSubstringFrames = (
  text: string
): VisualizerFrame<string>[] => {
  const frames: VisualizerFrame<string>[] = []
  const arr = text.split('')
  const n = arr.length
  let comparisons = 0

  let left = 0
  let right = 0
  let maxLength = 0
  const charSet = new Set<string>()

  frames.push({
    array: [...arr],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: { left, right },
    explanation:
      "Starting Sliding Window. We expand 'right' and shrink 'left' if duplicate found.",
    activeLine: 1,
    variables: { left, right, maxLength, window: '' },
    comparisons: 0,
    phase: 'search',
  })

  while (right < n) {
    const char = arr[right]
    comparisons++

    frames.push({
      array: [...arr],
      highlights: [right],
      secondaryHighlights: [left],
      visited: [],
      pointers: { left, right },
      ranges: [{ start: left, end: right, type: 'active' }],
      explanation: `Expanding window right to index ${right} ('${char}'). Current Window: "${text.substring(left, right + 1)}"`,
      activeLine: 3,
      variables: { left, right, char, maxLength },
      comparisons,
      phase: 'compare',
    })

    // If duplicate exists in window
    while (charSet.has(char)) {
      frames.push({
        array: [...arr],
        highlights: [right],
        secondaryHighlights: [left],
        visited: [],
        pointers: { left, right },
        ranges: [{ start: left, end: right, type: 'active' }],
        explanation: `Duplicate '${char}' found! Shrinking window from left (index ${left}).`,
        activeLine: 5,
        variables: { left, right, char },
        comparisons,
        phase: 'not-found', // Red flash
      })

      charSet.delete(arr[left])
      left++
    }

    charSet.add(char)
    const currentLength = right - left + 1

    if (currentLength > maxLength) {
      maxLength = currentLength
    }

    frames.push({
      array: [...arr],
      highlights: [],
      secondaryHighlights: [],
      visited: [],
      pointers: { left, right },
      ranges: [{ start: left, end: right, type: 'active' }],
      explanation: `Window is valid. Max Length is now ${maxLength}.`,
      activeLine: 8,
      variables: { left, right, maxLength },
      comparisons,
      phase: 'found',
    })

    right++
  }

  frames.push({
    array: [...arr],
    highlights: [],
    secondaryHighlights: [],
    visited: Array.from({ length: n }, (_, i) => i),
    pointers: {},
    explanation: `Finished. Longest Substring Length: ${maxLength}.`,
    activeLine: 12,
    variables: { maxLength },
    comparisons,
    phase: 'found',
  })

  return frames
}
