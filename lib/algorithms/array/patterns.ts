import { VisualizerFrame } from '@/lib/types/visualizer'

export const generateTwoPointersFrames = (
  array: number[],
  target: number
): VisualizerFrame[] => {
  const frames: VisualizerFrame[] = []
  let left = 0
  let right = array.length - 1

  // Initial Frame
  frames.push({
    array: [...array],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: { left, right },
    explanation: `Starting Two Pointers to find pair summing to ${target}. Left: ${left}, Right: ${right}`,
    activeLine: 1,
    variables: { left, right, target, currentSum: 0 },
    phase: 'search',
    comparisons: 0,
  })

  let comparisons = 0

  while (left < right) {
    const sum = array[left] + array[right]
    comparisons++

    // 1. Check Sum
    frames.push({
      array: [...array],
      highlights: [left, right], // The pair being summed
      secondaryHighlights: [],
      visited: [],
      pointers: { left, right },
      explanation: `Checking sum: ${array[left]} + ${array[right]} = ${sum}`,
      activeLine: 2,
      variables: { left, right, sum, target },
      phase: 'compare',
      comparisons,
    })

    if (sum === target) {
      // Found
      frames.push({
        array: [...array],
        highlights: [left, right],
        secondaryHighlights: [], // Maybe make them purple/success color? using 'highlights' with green for now
        visited: [],
        pointers: { left, right },
        explanation: `Found pair! ${array[left]} + ${array[right]} = ${target}`,
        activeLine: 3,
        variables: { found: true, indices: [left, right] },
        phase: 'found',
        comparisons,
      })
      return frames
    } else if (sum < target) {
      // Move Left
      frames.push({
        array: [...array],
        highlights: [left, right],
        secondaryHighlights: [],
        visited: [], // Could mark old left as visited?
        pointers: { left, right },
        explanation: `Sum ${sum} < ${target}. Need larger sum, so move Left pointer right.`,
        activeLine: 4,
        variables: { left, right, sum },
        phase: 'search',
        comparisons,
      })
      left++
    } else {
      // Move Right
      frames.push({
        array: [...array],
        highlights: [left, right],
        secondaryHighlights: [],
        visited: [],
        pointers: { left, right },
        explanation: `Sum ${sum} > ${target}. Need smaller sum, so move Right pointer left.`,
        activeLine: 5,
        variables: { left, right, sum },
        phase: 'search',
        comparisons,
      })
      right--
    }
  }

  // Not Found
  frames.push({
    array: [...array],
    highlights: [],
    secondaryHighlights: [],
    visited: array.map((_, i) => i),
    pointers: {},
    explanation: `No pair found summing to ${target}.`,
    activeLine: 6,
    variables: { found: false },
    phase: 'not-found',
    comparisons,
  })

  return frames
}
