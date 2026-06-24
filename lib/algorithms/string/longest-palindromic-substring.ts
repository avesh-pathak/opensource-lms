import { VisualizerFrame } from '@/lib/types/visualizer'

export const generateLongestPalindromicSubstringFrames = (
  text: string
): VisualizerFrame<string>[] => {
  const frames: VisualizerFrame<string>[] = []
  const arr = text.split('')
  const n = arr.length
  let comparisons = 0

  let maxLen = 0
  let startIdx = 0

  // Initial Frame
  frames.push({
    array: [...arr],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    explanation:
      'Starting Longest Palindromic Substring. We will expand around every center.',
    activeLine: 1,
    variables: { maxLen: 0, best: '' },
    comparisons: 0,
    phase: 'search',
  })

  const expandAroundCenter = (left: number, right: number) => {
    frames.push({
      array: [...arr],
      highlights: [left, right].filter((i) => i >= 0 && i < n), // Highlight center
      secondaryHighlights: [],
      visited: [],
      pointers: { left, right },
      ranges: [{ start: startIdx, end: startIdx + maxLen - 1, type: 'active' }], // Show current best
      explanation: `Checking center between indices ${left} and ${right}.`,
      activeLine: 3,
      variables: { left, right },
      comparisons,
      phase: 'search',
    })

    while (left >= 0 && right < n && arr[left] === arr[right]) {
      comparisons++
      frames.push({
        array: [...arr],
        highlights: [left, right], // Match
        secondaryHighlights: [],
        visited: [],
        pointers: { left, right },
        ranges: [
          { start: startIdx, end: startIdx + maxLen - 1, type: 'active' },
        ],
        explanation: `Match! '${arr[left]}' === '${arr[right]}'. Expanding outwards.`,
        activeLine: 5,
        variables: { left, right, char: arr[left] },
        comparisons,
        phase: 'compare',
      })

      if (right - left + 1 > maxLen) {
        maxLen = right - left + 1
        startIdx = left
        frames.push({
          array: [...arr],
          highlights: [],
          secondaryHighlights: [],
          visited: [], // Could highlight the new best range specifically
          pointers: { left, right },
          ranges: [
            { start: startIdx, end: startIdx + maxLen - 1, type: 'active' },
          ],
          explanation: `New Longest Palindrome Found! Length: ${maxLen}, ("${text.substring(left, right + 1)}")`,
          activeLine: 8,
          variables: { maxLen, startIdx },
          comparisons,
          phase: 'found',
        })
      }

      left--
      right++
    }

    // Mismatch or out of bounds
    if (left >= 0 && right < n) {
      frames.push({
        array: [...arr],
        highlights: [left, right],
        secondaryHighlights: [],
        visited: [],
        pointers: { left, right },
        ranges: [
          { start: startIdx, end: startIdx + maxLen - 1, type: 'active' },
        ],
        explanation: `Mismatch or End. '${arr[left]}' != '${arr[right]}'. Stopping expansion.`,
        activeLine: 10,
        variables: { left, right },
        comparisons,
        phase: 'not-found',
      })
    }
  }

  for (let i = 0; i < n; i++) {
    // Odd length center (single char)
    expandAroundCenter(i, i)
    // Even length center (between chars)
    expandAroundCenter(i, i + 1)
  }

  // Final Result
  const bestRange = Array.from({ length: maxLen }, (_, k) => startIdx + k)
  frames.push({
    array: [...arr],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    sortedIndices: bestRange, // reuse sortedIndices to show green permanent highlight
    pointers: {},
    explanation: `Done! Longest Palindromic Substring is "${text.substring(startIdx, startIdx + maxLen)}" with length ${maxLen}.`,
    activeLine: 15,
    variables: { maxLen, result: text.substring(startIdx, startIdx + maxLen) },
    comparisons,
    phase: 'found',
  })

  return frames
}
