import { VisualizerFrame } from '@/lib/types/visualizer'

export function generateSortColorsFrames(
  arr: number[]
): VisualizerFrame<number>[] {
  const frames: VisualizerFrame<number>[] = []
  const nums = [...arr]
  const n = nums.length
  let low = 0
  let mid = 0
  let high = n - 1

  frames.push({
    array: [...nums],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: { low: 0, mid: 0, high: n - 1 },
    explanation:
      'Dutch National Flag. 0=red, 1=white, 2=blue. low=0s, mid=1s, high=2s.',
    activeLine: 1,
    variables: { low: 0, mid: 0, high: n - 1 },
    comparisons: 0,
    phase: 'search',
  })

  while (mid <= high) {
    frames.push({
      array: [...nums],
      highlights: [mid],
      secondaryHighlights: [low, high],
      visited: [],
      pointers: { low, mid, high },
      explanation: `Inspecting nums[mid]=${nums[mid]}.`,
      activeLine: 3,
      variables: { low, mid, high },
      comparisons: mid + (n - high),
      phase: 'compare',
    })

    if (nums[mid] === 0) {
      ;[nums[low], nums[mid]] = [nums[mid]!, nums[low]!]
      frames.push({
        array: [...nums],
        highlights: [low, mid],
        secondaryHighlights: [],
        visited: [],
        pointers: { low, mid, high },
        explanation: `Swap 0 to left. low++.`,
        activeLine: 5,
        variables: { low, mid, high },
        comparisons: mid + (n - high),
        phase: 'found',
      })
      low++
      mid++
    } else if (nums[mid] === 1) {
      mid++
      frames.push({
        array: [...nums],
        highlights: [mid - 1],
        secondaryHighlights: [],
        visited: [],
        pointers: { low, mid, high },
        explanation: 'Keep 1 in middle. mid++.',
        activeLine: 8,
        variables: { low, mid, high },
        comparisons: mid + (n - high),
        phase: 'compare',
      })
    } else {
      ;[nums[mid], nums[high]] = [nums[high]!, nums[mid]!]
      frames.push({
        array: [...nums],
        highlights: [mid, high],
        secondaryHighlights: [],
        visited: [],
        pointers: { low, mid, high },
        explanation: 'Swap 2 to right. high--.',
        activeLine: 11,
        variables: { low, mid, high },
        comparisons: mid + (n - high),
        phase: 'found',
      })
      high--
    }
  }

  frames.push({
    array: [...nums],
    highlights: [],
    secondaryHighlights: [],
    visited: Array.from({ length: n }, (_, i) => i),
    pointers: {},
    explanation: 'Done. Array sorted in place: 0s, then 1s, then 2s.',
    activeLine: 14,
    variables: {},
    comparisons: n,
    phase: 'found',
  })
  return frames
}
