import { VisualizerFrame } from '@/lib/types/visualizer'

export const generateLargestRectangleFrames = (
  heights: number[]
): VisualizerFrame[] => {
  const frames: VisualizerFrame[] = []
  const n = heights.length
  const stack: number[] = []
  let maxArea = 0

  // Initial Frame
  frames.push({
    array: [...heights],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    explanation:
      'Starting Largest Rectangle calculation. Initializing empty stack.',
    activeLine: 2,
    variables: { maxArea, stack: [] },
    comparisons: 0,
    phase: 'search',
    trace: '[Init] stack = []. Ready to iterate heights.',
  })

  for (let i = 0; i <= n; i++) {
    const h = i === n ? 0 : heights[i]

    // 1. Current Element Frame
    frames.push({
      array: [...heights],
      highlights: i < n ? [i] : [],
      secondaryHighlights: stack.map((idx) => idx),
      visited: Array.from({ length: i }, (_, k) => k),
      pointers: { i },
      explanation:
        i === n
          ? 'Reached end of histogram. Using height 0 to clear stack.'
          : `Processing bar ${heights[i]} at index ${i}`,
      activeLine: 5,
      variables: {
        maxArea,
        stack: stack.map((idx) => heights[idx]),
        currentH: h,
      },
      comparisons: 0,
      phase: 'search',
      trace: `[Iter] i=${i}, h=${h}.`,
    })

    while (stack.length > 0 && heights[stack[stack.length - 1]] > h) {
      const height = heights[stack.pop()!]
      const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1
      const currentArea = height * width
      maxArea = Math.max(maxArea, currentArea)

      // 2. Calculation Frame
      frames.push({
        array: [...heights],
        highlights: [i < n ? i : -1],
        secondaryHighlights: stack.map((idx) => idx),
        visited: Array.from({ length: i }, (_, k) => k),
        pointers: {
          i,
          heightIdx: i - (i - (stack[stack.length - 1] ?? -1)) + 1,
        },
        explanation: `Height popped: ${height}. Width calculated: ${width}. Area: ${currentArea}. New Max Area: ${maxArea}`,
        activeLine: 7,
        variables: {
          maxArea,
          stack: stack.map((idx) => heights[idx]),
          currentArea,
          rect: {
            start: stack.length === 0 ? 0 : stack[stack.length - 1] + 1,
            end: i - 1,
            height,
          },
        },
        comparisons: 1,
        phase: 'found',
        trace: `[Calc] h=${height}, w=${width}, area=${currentArea}.`,
      })
    }

    if (i < n) {
      stack.push(i)
      // 3. Push to Stack Frame
      frames.push({
        array: [...heights],
        highlights: [i],
        secondaryHighlights: stack.map((idx) => idx),
        visited: Array.from({ length: i + 1 }, (_, k) => k),
        pointers: { i },
        explanation: `Height ${h} is >= stack top. Pushing index ${i} to stack.`,
        activeLine: 11,
        variables: { maxArea, stack: stack.map((idx) => heights[idx]), i },
        comparisons: 1,
        phase: 'compare',
        trace: `[Push] Index ${i} added.`,
      })
    }
  }

  // Final Frame
  frames.push({
    array: [...heights],
    highlights: [],
    secondaryHighlights: [],
    visited: heights.map((_, idx) => idx),
    pointers: {},
    explanation: `Calculation complete. The largest rectangle area found is ${maxArea}.`,
    activeLine: 12,
    variables: { maxArea, final: true },
    comparisons: 0,
    phase: 'found',
    trace: `[End] maxArea = ${maxArea}`,
  })

  return frames
}
