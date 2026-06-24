import { VisualizerFrame } from '@/lib/types/visualizer'

export function generateMaxSumFrames(
  arr: number[],
  k: number
): VisualizerFrame<number>[] {
  const frames: VisualizerFrame<number>[] = []
  const n = arr.length
  if (n === 0 || k > n) return frames

  let windowSum = 0
  for (let i = 0; i < k; i++) windowSum += arr[i]!

  frames.push({
    array: [...arr],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    ranges: [{ start: 0, end: k - 1, type: 'active' }],
    explanation: `Fixed window size k = ${k}. Initialize sum of first ${k} elements.`,
    activeLine: 1,
    variables: { k, windowSum, maxSum: windowSum },
    comparisons: 0,
    phase: 'search',
  })

  let maxSum = windowSum
  let bestStart = 0

  for (let end = k; end < n; end++) {
    const start = end - k
    windowSum = windowSum - arr[start]! + arr[end]!

    frames.push({
      array: [...arr],
      highlights: [end],
      secondaryHighlights: [start],
      visited: [],
      pointers: { start, end },
      ranges: [{ start: start + 1, end, type: 'active' }],
      explanation: `Slide window: drop index ${start} (${arr[start]}), add index ${end} (${arr[end]}). New sum = ${windowSum}.`,
      activeLine: 3,
      variables: { start: start + 1, end, windowSum, maxSum },
      comparisons: end - k + 1,
      phase: 'compare',
    })

    if (windowSum > maxSum) {
      maxSum = windowSum
      bestStart = start + 1
      frames.push({
        array: [...arr],
        highlights: [],
        secondaryHighlights: [],
        visited: [],
        pointers: { start: start + 1, end },
        ranges: [{ start: start + 1, end, type: 'active' }],
        explanation: `New max sum ${maxSum}! Window [${bestStart}, ${end}].`,
        activeLine: 5,
        variables: { maxSum, bestStart, end },
        comparisons: end - k + 1,
        phase: 'found',
      })
    }
  }

  frames.push({
    array: [...arr],
    highlights: [],
    secondaryHighlights: [],
    visited: Array.from({ length: n }, (_, i) => i),
    pointers: {},
    ranges: [{ start: bestStart, end: bestStart + k - 1, type: 'active' }],
    explanation: `Done. Max sum = ${maxSum} in window [${bestStart}, ${bestStart + k - 1}].`,
    activeLine: 7,
    variables: { maxSum, bestStart },
    comparisons: n - k + 1,
    phase: 'found',
  })

  return frames
}
