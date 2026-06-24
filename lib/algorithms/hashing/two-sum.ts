import { VisualizerFrame, HashBucket } from '@/lib/types/visualizer'

export function generateTwoSumFrames(
  nums: number[],
  target: number
): VisualizerFrame<HashBucket | number>[] {
  const frames: VisualizerFrame<HashBucket | number>[] = []
  const map = new Map<number, number>()
  const buckets: HashBucket[] = Array.from({ length: 8 }, (_, i) => ({
    index: i,
    items: [],
  }))

  frames.push({
    array: [...nums],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    explanation: `Starting Two Sum for target ${target}. We'll use a Hash Map to store seen numbers.`,
    activeLine: 1,
    variables: { target, map: {} },
    comparisons: 0,
    phase: 'search',
  })

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i]
    const complement = target - num

    frames.push({
      array: [...nums],
      highlights: [i],
      secondaryHighlights: [],
      visited: Array.from(map.values()),
      pointers: { curr: i },
      explanation: `Checking if complement (${target} - ${num} = ${complement}) exists in the map.`,
      activeLine: 4,
      variables: {
        target,
        curr: num,
        complement,
        map: Object.fromEntries(map),
      },
      comparisons: i + 1,
      phase: 'compare',
    })

    if (map.has(complement)) {
      const complementIdx = map.get(complement)!
      frames.push({
        array: [...nums],
        highlights: [i, complementIdx],
        secondaryHighlights: [],
        visited: Array.from(map.values()),
        pointers: { curr: i, found: complementIdx },
        explanation: `Complement ${complement} found at index ${complementIdx}!`,
        activeLine: 6,
        variables: { target, result: [complementIdx, i] },
        comparisons: i + 1,
        phase: 'found',
      })
      return frames
    }

    map.set(num, i)

    // Visualizing the map growth in buckets (simple mod hashing)
    const bucketIdx = num % 8
    buckets[bucketIdx].items.push({
      key: num.toString(),
      value: i,
      isNew: true,
    })

    frames.push({
      array: [...nums], // Keep showing the array even as we explain the map
      highlights: [i],
      secondaryHighlights: [],
      visited: Array.from(map.values()),
      pointers: { curr: i },
      explanation: `Adding ${num} to the map at index ${i}.`,
      activeLine: 8,
      variables: { map: Object.fromEntries(map) },
      comparisons: i + 1,
      phase: 'search',
    })
  }

  return frames
}
