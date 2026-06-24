import { VisualizerFrame } from '@/lib/types/visualizer'

export const generateMinStackFrames = (
  operations: { op: 'push' | 'pop'; val?: number }[]
): VisualizerFrame[] => {
  const frames: VisualizerFrame[] = []
  const mainStack: number[] = []
  const minStack: number[] = []

  // Initial Frame
  frames.push({
    array: [],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    explanation:
      'Initializing Min Stack. Both main stack and min stack are empty.',
    activeLine: 2,
    variables: { mainStack: [], minStack: [] },
    comparisons: 0,
    phase: 'search',
    trace: '[Init] main = [], min = [].',
  })

  for (let i = 0; i < operations.length; i++) {
    const { op, val } = operations[i]

    if (op === 'push') {
      const value = val!
      mainStack.push(value)

      // 1. Push to Main Frame
      frames.push({
        array: [value], // Just showing current op value
        highlights: [0],
        secondaryHighlights: [],
        visited: [],
        pointers: { op: i },
        explanation: `Pushing ${value} to main stack.`,
        activeLine: 7,
        variables: {
          mainStack: [...mainStack],
          minStack: [...minStack],
          currentVal: value,
        },
        comparisons: 0,
        phase: 'compare',
        trace: `[Push] main.push(${value})`,
      })

      const isNewMin =
        minStack.length === 0 || value <= minStack[minStack.length - 1]

      // 2. Check Min Frame
      frames.push({
        array: [value],
        highlights: [0],
        secondaryHighlights: minStack.length > 0 ? [minStack.length - 1] : [],
        visited: [],
        pointers: { op: i },
        explanation: isNewMin
          ? `${value} is <= current min. Pushing to min stack.`
          : `${value} is > current min. No change to min stack.`,
        activeLine: 8,
        variables: {
          mainStack: [...mainStack],
          minStack: [...minStack],
          currentVal: value,
          isNewMin,
        },
        comparisons: 1,
        phase: 'compare',
        trace: `[Check] ${value} <= ${minStack[minStack.length - 1] ?? 'inf'}?`,
      })

      if (isNewMin) {
        minStack.push(value)
        // 3. Push to Min Frame
        frames.push({
          array: [value],
          highlights: [0],
          secondaryHighlights: [],
          visited: [],
          pointers: { op: i },
          explanation: `Pushed ${value} to min stack.`,
          activeLine: 9,
          variables: { mainStack: [...mainStack], minStack: [...minStack] },
          comparisons: 0,
          phase: 'found',
          trace: `[Push] min.push(${value})`,
        })
      }
    } else if (op === 'pop' && mainStack.length > 0) {
      const popped = mainStack[mainStack.length - 1]
      const isMinPopped = popped === minStack[minStack.length - 1]

      // 1. Pop Check Frame
      frames.push({
        array: [],
        highlights: [],
        secondaryHighlights: [mainStack.length - 1],
        visited: [],
        pointers: { op: i },
        explanation: `Popping from main stack. Value is ${popped}. Checking if it's the current min.`,
        activeLine: 12,
        variables: {
          mainStack: [...mainStack],
          minStack: [...minStack],
          popped,
          isMinPopped,
        },
        comparisons: 1,
        phase: 'compare',
        trace: `[Pop] Checking if ${popped} is min.`,
      })

      if (isMinPopped) {
        minStack.pop()
        // 2. Pop Min Frame
        frames.push({
          array: [],
          highlights: [],
          secondaryHighlights: [],
          visited: [],
          pointers: { op: i },
          explanation: `${popped} was the current min. Popping from min stack too.`,
          activeLine: 13,
          variables: {
            mainStack: [...mainStack],
            minStack: [...minStack],
            popped,
          },
          comparisons: 0,
          phase: 'found',
          trace: `[Pop] min.pop()`,
        })
      }

      mainStack.pop()
      // 3. Pop Final Frame
      frames.push({
        array: [],
        highlights: [],
        secondaryHighlights: [],
        visited: [],
        pointers: { op: i },
        explanation: `Popped ${popped} from main stack.`,
        activeLine: 14,
        variables: {
          mainStack: [...mainStack],
          minStack: [...minStack],
          popped,
        },
        comparisons: 0,
        phase: 'search',
        trace: `[Pop] main.pop()`,
      })
    }
  }

  return frames
}
