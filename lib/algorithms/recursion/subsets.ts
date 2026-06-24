import { VisualizerFrame } from '@/lib/types/visualizer'

export function generateSubsetsFrames(
  nums: number[]
): VisualizerFrame<number[]>[] {
  const frames: VisualizerFrame<number[]>[] = []
  const results: number[][] = []
  const current: number[] = []

  frames.push({
    array: [],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    explanation: 'Starting Subsets (Power Set) backtracking.',
    activeLine: 1,
    variables: { nums, results: [] },
    comparisons: 0,
    phase: 'search',
  })

  function backtrack(index: number) {
    if (index === nums.length) {
      results.push([...current])
      frames.push({
        array: [...results] as any,
        highlights: [results.length - 1],
        secondaryHighlights: [],
        visited: [],
        pointers: {},
        explanation: `Found subset: [${current.join(', ')}]`,
        activeLine: 3,
        variables: { current: [...current], results: [...results] },
        comparisons: 0,
        phase: 'found',
      })
      return
    }

    // Include current element
    current.push(nums[index])
    frames.push({
      array: [...results] as any,
      highlights: [],
      secondaryHighlights: [],
      visited: [],
      pointers: { index },
      explanation: `Including nums[${index}] = ${nums[index]} in current subset.`,
      activeLine: 5,
      variables: { current: [...current], index },
      comparisons: 0,
      phase: 'search',
    })
    backtrack(index + 1)

    // Exclude current element
    current.pop()
    frames.push({
      array: [...results] as any,
      highlights: [],
      secondaryHighlights: [],
      visited: [],
      pointers: { index },
      explanation: `Backtracking: excluding nums[${index}] = ${nums[index]} from subset.`,
      activeLine: 7,
      variables: { current: [...current], index },
      comparisons: 0,
      phase: 'search',
    })
    backtrack(index + 1)
  }

  backtrack(0)

  frames.push({
    array: [...results] as any,
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    explanation: `Done! Found ${results.length} subsets.`,
    activeLine: 9,
    variables: { finalCount: results.length, results },
    comparisons: 0,
    phase: 'found',
  })

  return frames
}
