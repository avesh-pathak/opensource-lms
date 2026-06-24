import { VisualizerFrame } from '@/lib/types/visualizer'

export function generateMinSizeSubarrayFrames(
  arr: number[],
  target: number
): VisualizerFrame<number>[] {
  const frames: VisualizerFrame<number>[] = []
  const n = arr.length
  let left = 0
  let sum = 0
  let minLen = Infinity
  let bestStart = -1
  let bestEnd = -1

  frames.push({
    array: [...arr],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: { left: 0 },
    explanation: `Min size subarray with sum >= ${target}. Dynamic window: expand right, shrink left when sum >= target.`,
    activeLine: 1,
    variables: { target, left, sum: 0, minLen: '∞' },
    comparisons: 0,
    phase: 'search',
  })

  for (let right = 0; right < n; right++) {
    sum += arr[right]!

    frames.push({
      array: [...arr],
      highlights: [right],
      secondaryHighlights: [left],
      visited: [],
      pointers: { left, right },
      ranges: [{ start: left, end: right, type: 'active' }],
      explanation: `Expand right to ${right}. Sum = ${sum}.`,
      activeLine: 3,
      variables: {
        left,
        right,
        sum,
        minLen: minLen === Infinity ? '∞' : minLen,
      },
      comparisons: right + 1,
      phase: 'compare',
    })

    while (sum >= target && left <= right) {
      const len = right - left + 1
      if (len < minLen) {
        minLen = len
        bestStart = left
        bestEnd = right
        frames.push({
          array: [...arr],
          highlights: [],
          secondaryHighlights: [],
          visited: [],
          pointers: { left, right },
          ranges: [{ start: left, end: right, type: 'active' }],
          explanation: `Sum ${sum} >= ${target}. New min length = ${minLen}.`,
          activeLine: 6,
          variables: { left, right, sum, minLen },
          comparisons: right + 1,
          phase: 'found',
        })
      }
      sum -= arr[left]!
      left++
      if (left <= right) {
        frames.push({
          array: [...arr],
          highlights: [right],
          secondaryHighlights: [left],
          visited: [],
          pointers: { left, right },
          ranges: [{ start: left, end: right, type: 'active' }],
          explanation: `Shrink left. New sum = ${sum}.`,
          activeLine: 8,
          variables: { left, right, sum, minLen },
          comparisons: right + 1,
          phase: 'compare',
        })
      }
    }
  }

  const resultLen = bestStart >= 0 ? minLen : 0
  frames.push({
    array: [...arr],
    highlights: [],
    secondaryHighlights: [],
    visited: Array.from({ length: n }, (_, i) => i),
    pointers: {},
    ranges:
      bestStart >= 0
        ? [{ start: bestStart, end: bestEnd!, type: 'active' }]
        : [],
    explanation:
      bestStart >= 0
        ? `Done. Min length = ${resultLen} for subarray [${bestStart}, ${bestEnd}].`
        : 'No subarray with sum >= target.',
    activeLine: 10,
    variables: { minLen: resultLen, bestStart, bestEnd },
    comparisons: n,
    phase: 'found',
  })

  return frames
}
