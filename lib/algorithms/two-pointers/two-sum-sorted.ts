import { VisualizerFrame } from '@/lib/types/visualizer'

export function generateTwoSumSortedFrames(
  arr: number[],
  target: number
): VisualizerFrame<number>[] {
  const frames: VisualizerFrame<number>[] = []
  const n = arr.length
  let left = 0
  let right = n - 1

  frames.push({
    array: [...arr],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: { left: 0, right: n - 1 },
    explanation: `Two Sum (sorted). Target = ${target}. Pointers at start and end.`,
    activeLine: 1,
    variables: { target, left: 0, right: n - 1 },
    comparisons: 0,
    phase: 'search',
  })

  while (left < right) {
    const sum = arr[left]! + arr[right]!

    frames.push({
      array: [...arr],
      highlights: [left, right],
      secondaryHighlights: [],
      visited: [],
      pointers: { left, right },
      explanation: `Sum = ${arr[left]} + ${arr[right]} = ${sum}. Compare with target ${target}.`,
      activeLine: 3,
      variables: { left, right, sum, target },
      comparisons: left + (n - right),
      phase: 'compare',
    })

    if (sum === target) {
      frames.push({
        array: [...arr],
        highlights: [left, right],
        secondaryHighlights: [],
        visited: [],
        pointers: { left, right },
        explanation: `Found! Indices [${left}, ${right}].`,
        activeLine: 5,
        variables: { left, right, result: [left, right] },
        comparisons: left + (n - right),
        phase: 'found',
      })
      return frames
    }

    if (sum < target) {
      left++
      frames.push({
        array: [...arr],
        highlights: [left, right],
        secondaryHighlights: [],
        visited: [],
        pointers: { left, right },
        explanation: `Sum < target. Move left forward.`,
        activeLine: 7,
        variables: { left, right },
        comparisons: left + (n - right),
        phase: 'compare',
      })
    } else {
      right--
      frames.push({
        array: [...arr],
        highlights: [left, right],
        secondaryHighlights: [],
        visited: [],
        pointers: { left, right },
        explanation: `Sum > target. Move right backward.`,
        activeLine: 9,
        variables: { left, right },
        comparisons: left + (n - right),
        phase: 'compare',
      })
    }
  }

  frames.push({
    array: [...arr],
    highlights: [],
    secondaryHighlights: [],
    visited: Array.from({ length: n }, (_, i) => i),
    pointers: {},
    explanation: 'No pair found.',
    activeLine: 11,
    variables: { result: null },
    comparisons: n,
    phase: 'not-found',
  })
  return frames
}
