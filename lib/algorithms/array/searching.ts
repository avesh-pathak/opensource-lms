import { VisualizerFrame } from '@/lib/types/visualizer'

export const generateLinearSearchFrames = (
  array: number[],
  target: number
): VisualizerFrame[] => {
  const frames: VisualizerFrame[] = []
  let comparisons = 0

  for (let i = 0; i < array.length; i++) {
    comparisons++
    // 1. Comparison Frame
    frames.push({
      array: [...array],
      highlights: [i],
      secondaryHighlights: [],
      visited: Array.from({ length: i }, (_, k) => k),
      pointers: { i },
      explanation: `Checking index ${i}: Is ${array[i]} == ${target}?`,
      activeLine: 3,
      variables: { i, current: array[i], target: target, found: false },
      comparisons,
      phase: 'compare',
      ranges: [],
      trace: `[Linear Search] Checking index i=${i}. Current Value: ${array[i]}. Target: ${target}.`,
    })

    if (array[i] === target) {
      // 2. Found Frame
      frames.push({
        array: [...array],
        highlights: [i],
        secondaryHighlights: [],
        visited: Array.from({ length: i }, (_, k) => k),
        pointers: { i },
        explanation: `Found target ${target} at index ${i}!`,
        activeLine: 4,
        variables: { i, current: array[i], target: target, found: true },
        comparisons,
        phase: 'found',
        ranges: [],
        trace: `[Success] Match found! ${array[i]} == ${target}. Returning index ${i}.`,
      })
      return frames
    } else {
      // Trace for mismatch (optional intermediate frame or just implicit)
      frames.push({
        array: [...array],
        highlights: [i],
        secondaryHighlights: [],
        visited: Array.from({ length: i + 1 }, (_, k) => k), // Mark current as visited
        pointers: { i },
        explanation: `${array[i]} != ${target}. Moving to next element.`,
        activeLine: 3,
        variables: { i, current: array[i], target: target, found: false },
        comparisons,
        phase: 'search',
        ranges: [],
        trace: `[Mismatch] ${array[i]} != ${target}. Incrementing i.`,
      })
    }
  }

  // 3. Not Found Frame
  frames.push({
    array: [...array],
    highlights: [],
    secondaryHighlights: [],
    visited: array.map((_, i) => i),
    pointers: {},
    explanation: `Target ${target} not found in the array.`,
    activeLine: 7,
    variables: { found: false },
    comparisons,
    phase: 'not-found',
    ranges: [],
    trace: `[End] Loop finished. Target ${target} was not found in the array.`,
  })

  return frames
}

export const generateBinarySearchFrames = (
  array: number[],
  target: number
): VisualizerFrame[] => {
  const frames: VisualizerFrame[] = []
  let left = 0
  let right = array.length - 1
  let comparisons = 0

  // Initial Frame
  frames.push({
    array: [...array],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: { left, right },
    explanation: `Starting Binary Search. Search range: [${left}, ${right}]`,
    activeLine: 2,
    variables: { left, right, mid: -1, target: target },
    comparisons: 0,
    phase: 'search',
    ranges: [{ start: left, end: right, type: 'active' }],
    trace: `[Init] Left = ${left}, Right = ${right}. Target = ${target}. Starting loop.`,
  })

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    comparisons++

    // 1. Calculate Mid Frame
    frames.push({
      array: [...array],
      highlights: [mid],
      secondaryHighlights: [],
      visited: [],
      pointers: { left, right, mid },
      explanation: `Calculated mid index ${mid} (Value: ${array[mid]})`,
      activeLine: 5,
      variables: { left, right, mid, current: array[mid], target: target },
      comparisons,
      phase: 'search',
      ranges: [{ start: left, end: right, type: 'active' }],
      trace: `[Step] Calculating mid: floor((${left} + ${right}) / 2) = ${mid}. Value at mid is ${array[mid]}.`,
    })

    // 2. Compare Frame
    frames.push({
      array: [...array],
      highlights: [mid],
      secondaryHighlights: [],
      visited: [],
      pointers: { left, right, mid },
      explanation: `Comparing: Is ${array[mid]} == ${target}?`,
      activeLine: 7,
      variables: { left, right, mid, current: array[mid], target: target },
      comparisons,
      phase: 'compare',
      ranges: [{ start: left, end: right, type: 'active' }],
      trace: `[Compare] Checking if ${array[mid]} == ${target}...`,
    })

    if (array[mid] === target) {
      // Found
      frames.push({
        array: [...array],
        highlights: [mid],
        secondaryHighlights: [],
        visited: [],
        pointers: { left, right, mid },
        explanation: `Found target ${target} at index ${mid}!`,
        activeLine: 7,
        variables: { left, right, mid, found: true },
        comparisons,
        phase: 'found',
        ranges: [{ start: mid, end: mid, type: 'active' }],
        trace: `[Success] Target found at index ${mid}. Returning result.`,
      })
      return frames
    }

    if (array[mid] < target) {
      // 3. Move Right (Discard Left)
      frames.push({
        array: [...array],
        highlights: [mid],
        secondaryHighlights: [],
        visited: [],
        pointers: { left, right, mid },
        explanation: `${array[mid]} < ${target}. Target is larger, so discard left half.`,
        activeLine: 10,
        variables: { left, right, mid },
        comparisons,
        phase: 'compare',
        ranges: [
          { start: left, end: mid, type: 'discarded' },
          { start: mid + 1, end: right, type: 'active' },
        ],
        trace: `[Logic] ${array[mid]} < ${target}. Target is to the right. Adjusting Left pointer to mid + 1 (${mid + 1}).`,
      })
      left = mid + 1
    } else {
      // 3. Move Left (Discard Right)
      frames.push({
        array: [...array],
        highlights: [mid],
        secondaryHighlights: [],
        visited: [],
        pointers: { left, right, mid },
        explanation: `${array[mid]} > ${target}. Target is smaller, so discard right half.`,
        activeLine: 12,
        variables: { left, right, mid },
        comparisons,
        phase: 'compare',
        ranges: [
          { start: left, end: mid - 1, type: 'active' },
          { start: mid, end: right, type: 'discarded' },
        ],
        trace: `[Logic] ${array[mid]} > ${target}. Target is to the left. Adjusting Right pointer to mid - 1 (${mid - 1}).`,
      })
      right = mid - 1
    }

    // 4. New Range State
    frames.push({
      array: [...array],
      highlights: [],
      secondaryHighlights: [],
      visited: [],
      pointers: { left, right },
      explanation: `New search range: [${left}, ${right}].`,
      activeLine: 4,
      variables: { left, right, mid },
      comparisons,
      phase: 'search',
      ranges: [{ start: left, end: right, type: 'active' }],
      trace: `[Loop] New range is [${left}, ${right}]. Continuing search.`,
    })
  }

  // Not Found
  frames.push({
    array: [...array],
    highlights: [],
    secondaryHighlights: [],
    visited: array.map((_, i) => i),
    pointers: {},
    explanation: `Target ${target} not found. Search space exhausted.`,
    activeLine: 15,
    variables: { found: false },
    comparisons,
    phase: 'not-found',
    ranges: [],
    trace: `[End] Left (${left}) > Right (${right}). Search space empty. Target Not Found.`,
  })

  return frames
}
