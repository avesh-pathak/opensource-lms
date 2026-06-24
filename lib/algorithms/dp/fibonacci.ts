import type { VisualizerFrame } from '@/lib/types/visualizer'

export function generateFibonacciDPFrames(n: number): VisualizerFrame[] {
  const frames: VisualizerFrame[] = []
  const dp: number[] = []

  for (let i = 0; i <= n; i++) {
    if (i <= 1) dp[i] = i
    else dp[i] = dp[i - 1]! + dp[i - 2]!
    frames.push({
      array: [...dp],
      highlights: [i],
      secondaryHighlights: i >= 2 ? [i - 1, i - 2] : [],
      visited: [...Array(i + 1).keys()],
      pointers: {},
      explanation:
        i <= 1
          ? `Base: dp[${i}] = ${i}`
          : `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`,
      activeLine: i <= 1 ? 1 : 2,
      variables: { dp: [...dp], i },
      comparisons: 0,
      phase: i === n ? 'found' : 'compare',
    })
  }
  return frames
}
