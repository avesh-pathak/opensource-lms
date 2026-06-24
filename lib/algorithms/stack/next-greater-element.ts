import { VisualizerFrame } from '@/lib/types/visualizer'

export const generateNextGreaterElementFrames = (
  array: number[]
): VisualizerFrame[] => {
  const frames: VisualizerFrame[] = []
  const n = array.length
  const res: number[] = new Array(n).fill(-1)
  const stack: number[] = [] // Stores indices

  // Initial Frame
  frames.push({
    array: [...array],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    explanation:
      'Starting Next Greater Element check. Initializing result array with -1.',
    activeLine: 2,
    variables: { res: [...res], stack: [], i: -1 },
    comparisons: 0,
    phase: 'search',
    trace: '[Init] res = [-1...], stack = []. Starting loop.',
  })

  for (let i = 0; i < n; i++) {
    // 1. Current Element Frame
    frames.push({
      array: [...array],
      highlights: [i],
      secondaryHighlights: stack.map((idx) => idx), // Highlight indices currently in stack
      visited: Array.from({ length: i }, (_, k) => k),
      pointers: { i },
      explanation: `Processing element ${array[i]} at index ${i}`,
      activeLine: 5,
      variables: { res: [...res], stack: stack.map((idx) => array[idx]), i },
      comparisons: 0,
      phase: 'search',
      trace: `[Iter] i=${i}, val=${array[i]}.`,
    })

    while (stack.length > 0 && array[stack[stack.length - 1]] < array[i]) {
      const idx = stack.pop()!
      res[idx] = array[i]

      // 2. Found Greater Element Frame
      frames.push({
        array: [...array],
        highlights: [i, idx],
        secondaryHighlights: stack.map((sIdx) => sIdx),
        visited: Array.from({ length: i }, (_, k) => k),
        pointers: { i, stackTop: idx },
        explanation: `${array[i]} is greater than stack top ${array[idx]}. Found NGE for index ${idx}!`,
        activeLine: 6,
        variables: {
          res: [...res],
          stack: stack.map((sIdx) => array[sIdx]),
          i,
          poppedIdx: idx,
        },
        comparisons: 1,
        phase: 'found',
        trace: `[Pop] ${array[i]} > ${array[idx]}. res[${idx}] = ${array[i]}.`,
      })
    }

    stack.push(i)
    // 3. Push Current to Stack Frame
    frames.push({
      array: [...array],
      highlights: [i],
      secondaryHighlights: stack.map((idx) => idx),
      visited: Array.from({ length: i + 1 }, (_, k) => k),
      pointers: { i },
      explanation: `Pushing index ${i} (${array[i]}) to stack.`,
      activeLine: 9,
      variables: { res: [...res], stack: stack.map((idx) => array[idx]), i },
      comparisons: 0,
      phase: 'compare',
      trace: `[Push] Index ${i} added to stack.`,
    })
  }

  // Final Frame
  frames.push({
    array: [...array],
    highlights: [],
    secondaryHighlights: [],
    visited: array.map((_, idx) => idx),
    pointers: {},
    explanation:
      'Iteration complete. Final Next Greater Element result calculated.',
    activeLine: 10,
    variables: { res: [...res], stack: stack.map((idx) => array[idx]) },
    comparisons: 0,
    phase: 'found',
    trace: '[End] All elements processed.',
  })

  return frames
}
