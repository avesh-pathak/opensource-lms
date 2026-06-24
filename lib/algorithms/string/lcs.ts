import { VisualizerFrame } from '@/lib/types/visualizer'

export function generateLCSFrames(combinedArray: string[]): VisualizerFrame[] {
  const frames: VisualizerFrame[] = []

  // 1. Separate the two strings
  const separatorIndex = combinedArray.indexOf('|')
  if (separatorIndex === -1) return [] // Should not happen if generated correctly

  const s1 = combinedArray.slice(0, separatorIndex)
  const s2 = combinedArray.slice(separatorIndex + 1)
  const n = s1.length
  const m = s2.length
  let comparisons = 0

  // 2. Compute LCS using standard DP (not visualized step-by-step to save time/clutter, only result reconstruction)
  // We visualize the "Result Construction" which is easier to follow on 1D View
  const dp = Array(n + 1)
    .fill(0)
    .map(() => Array(m + 1).fill(0))

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  // 3. Backtrack to find the actual characters
  let i = n,
    j = m
  const path: { s1Idx: number; s2Idx: number; char: string }[] = []

  while (i > 0 && j > 0) {
    if (s1[i - 1] === s2[j - 1]) {
      path.push({ s1Idx: i - 1, s2Idx: j - 1, char: s1[i - 1] })
      i--
      j--
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--
    } else {
      j--
    }
  }
  path.reverse() // Now we have the LCS in order

  // 4. GENERATE FRAMES

  // Initial State
  frames.push({
    array: [...combinedArray],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    ranges: [
      { start: 0, end: separatorIndex - 1, type: 'active' }, // String 1
      {
        start: separatorIndex + 1,
        end: combinedArray.length - 1,
        type: 'active',
      }, // String 2
    ],
    phase: 'search',
    explanation:
      'Longest Common Subsequence (LCS). We look for the longest sequence of characters that appear in both strings in the same order.',
    activeLine: 3,
    variables: {},
    comparisons,
  })

  // Animate finding/matching
  for (let k = 0; k < path.length; k++) {
    const item = path[k]
    const globalS1Idx = item.s1Idx // First part of array
    const globalS2Idx = separatorIndex + 1 + item.s2Idx // Second part after separator

    comparisons++

    // Highlight the comparison/match
    frames.push({
      array: [...combinedArray],
      highlights: [globalS1Idx, globalS2Idx],
      secondaryHighlights: [],
      visited: path
        .slice(0, k)
        .map((p) => {
          return [p.s1Idx, separatorIndex + 1 + p.s2Idx]
        })
        .flat(),
      pointers: { p1: globalS1Idx, p2: globalS2Idx },
      ranges: [
        { start: 0, end: separatorIndex - 1, type: 'active' },
        {
          start: separatorIndex + 1,
          end: combinedArray.length - 1,
          type: 'active',
        },
      ],
      phase: 'compare',
      explanation: `Found common character '${item.char}'!`,
      activeLine: 8,
      variables: { match: item.char },
      comparisons,
    })
  }

  // Final Result
  const lcsResultIndices = path
    .map((p) => [p.s1Idx, separatorIndex + 1 + p.s2Idx])
    .flat()

  frames.push({
    array: [...combinedArray],
    highlights: [],
    secondaryHighlights: [],
    visited: lcsResultIndices, // Mark LCS as visited/found
    pointers: {},
    ranges: [],
    phase: 'found',
    explanation: `LCS Found! The longest common subsequence is length ${path.length}.`,
    activeLine: 12,
    variables: { lcsLength: path.length },
    comparisons,
  })

  return frames
}
