import { VisualizerFrame, HashBucket } from '@/lib/types/visualizer'

export function generateConsecutiveFrames(
  nums: number[]
): VisualizerFrame<HashBucket | number>[] {
  const frames: VisualizerFrame<HashBucket | number>[] = []
  const set = new Set(nums)
  let longestStreak = 0

  frames.push({
    array: [...nums],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    explanation:
      "Starting Longest Consecutive Sequence. We'll use a Hash Set for O(1) lookups.",
    activeLine: 1,
    variables: { nums, set: Array.from(set), longestStreak: 0 },
    comparisons: 0,
    phase: 'search',
  })

  for (const num of nums) {
    const numIdx = nums.indexOf(num)

    frames.push({
      array: [...nums],
      highlights: [numIdx],
      secondaryHighlights: [],
      visited: [],
      pointers: { curr: numIdx },
      explanation: `Checking if ${num} is the start of a sequence (i.e., ${num}-1 exists in set).`,
      activeLine: 4,
      variables: { num, check: num - 1, exists: set.has(num - 1) },
      comparisons: 0,
      phase: 'compare',
    })

    if (!set.has(num - 1)) {
      let currentNum = num
      let currentStreak = 1

      frames.push({
        array: [...nums],
        highlights: [numIdx],
        secondaryHighlights: [],
        visited: [],
        pointers: { start: numIdx },
        explanation: `${num} is the start of a possible sequence.`,
        activeLine: 6,
        variables: { currentStreak, longestStreak },
        comparisons: 0,
        phase: 'search',
      })

      while (set.has(currentNum + 1)) {
        currentNum += 1
        currentStreak += 1

        frames.push({
          array: [...nums],
          highlights: [numIdx],
          secondaryHighlights: [],
          visited: [],
          pointers: { current: numIdx },
          explanation: `Sequence continues: found ${currentNum}. Streak: ${currentStreak}`,
          activeLine: 8,
          variables: { currentStreak, longestStreak, found: currentNum },
          comparisons: 0,
          phase: 'search',
        })
      }

      longestStreak = Math.max(longestStreak, currentStreak)

      frames.push({
        array: [...nums],
        highlights: [numIdx],
        secondaryHighlights: [],
        visited: [],
        pointers: { curr: numIdx },
        explanation: `Sequence ended. Max streak updated to ${longestStreak}.`,
        activeLine: 10,
        variables: { currentStreak, longestStreak },
        comparisons: 0,
        phase: 'found',
      })
    }
  }

  frames.push({
    array: [...nums],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    explanation: `Done! Longest consecutive sequence length is ${longestStreak}.`,
    activeLine: 12,
    variables: { finalLongestStreak: longestStreak },
    comparisons: 0,
    phase: 'found',
  })

  return frames
}
