import { VisualizerFrame } from '@/lib/types/visualizer'

export function generateContainerFrames(
  heights: number[]
): VisualizerFrame<number>[] {
  const frames: VisualizerFrame<number>[] = []
  const n = heights.length
  let left = 0
  let right = n - 1
  let maxArea = 0
  let bestLeft = 0
  let bestRight = 0

  frames.push({
    array: [...heights],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: { left: 0, right: n - 1 },
    explanation: 'Container With Most Water. Area = min(h[l], h[r]) * (r - l).',
    activeLine: 1,
    variables: { left: 0, right: n - 1, maxArea: 0 },
    comparisons: 0,
    phase: 'search',
  })

  while (left < right) {
    const w = right - left
    const h = Math.min(heights[left]!, heights[right]!)
    const area = w * h

    frames.push({
      array: [...heights],
      highlights: [left, right],
      secondaryHighlights: [],
      visited: [],
      pointers: { left, right },
      explanation: `Width=${w}, height=min(${heights[left]}, ${heights[right]})=${h}. Area=${area}.`,
      activeLine: 3,
      variables: { left, right, area, maxArea },
      comparisons: left + (n - right),
      phase: 'compare',
    })

    if (area > maxArea) {
      maxArea = area
      bestLeft = left
      bestRight = right
      frames.push({
        array: [...heights],
        highlights: [left, right],
        secondaryHighlights: [],
        visited: [],
        pointers: { left, right },
        explanation: `New max area = ${maxArea}.`,
        activeLine: 5,
        variables: { left, right, maxArea },
        comparisons: left + (n - right),
        phase: 'found',
      })
    }

    if (heights[left]! < heights[right]!) {
      left++
      frames.push({
        array: [...heights],
        highlights: [left, right],
        secondaryHighlights: [],
        visited: [],
        pointers: { left, right },
        explanation: 'Left is shorter; move left forward.',
        activeLine: 8,
        variables: { left, right },
        comparisons: left + (n - right),
        phase: 'compare',
      })
    } else {
      right--
      frames.push({
        array: [...heights],
        highlights: [left, right],
        secondaryHighlights: [],
        visited: [],
        pointers: { left, right },
        explanation: 'Right is shorter or equal; move right backward.',
        activeLine: 10,
        variables: { left, right },
        comparisons: left + (n - right),
        phase: 'compare',
      })
    }
  }

  frames.push({
    array: [...heights],
    highlights: [],
    secondaryHighlights: [],
    visited: Array.from({ length: n }, (_, i) => i),
    pointers: {},
    explanation: `Done. Max area = ${maxArea} (indices ${bestLeft}, ${bestRight}).`,
    activeLine: 12,
    variables: { maxArea, bestLeft, bestRight },
    comparisons: n,
    phase: 'found',
  })
  return frames
}
