import { VisualizerFrame } from '@/lib/types/visualizer'

export const generateValidParenthesesFrames = (
  input: string
): VisualizerFrame[] => {
  const frames: VisualizerFrame[] = []
  const stack: string[] = []
  const charArray = input.split('')
  const matchingBrackets: Record<string, string> = {
    ')': '(',
    '}': '{',
    ']': '[',
  }

  // Initial Frame
  frames.push({
    array: [...charArray],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    explanation: 'Starting Valid Parentheses check. Initializing empty stack.',
    activeLine: 2,
    variables: { stack: [], currentChar: '' },
    comparisons: 0,
    phase: 'search',
    trace: '[Init] Stack is empty. Starting to iterate through input.',
  })

  for (let i = 0; i < charArray.length; i++) {
    const char = charArray[i]

    // 1. Current Char Frame
    frames.push({
      array: [...charArray],
      highlights: [i],
      secondaryHighlights: [],
      visited: Array.from({ length: i }, (_, k) => k),
      pointers: { i },
      explanation: `Processing character: '${char}'`,
      activeLine: 3,
      variables: { stack: [...stack], currentChar: char, i },
      comparisons: 0,
      phase: 'search',
      trace: `[Iter] i=${i}, char='${char}'.`,
    })

    if (['(', '{', '['].includes(char)) {
      stack.push(char)
      // 2. Push Frame
      frames.push({
        array: [...charArray],
        highlights: [i],
        secondaryHighlights: [],
        visited: Array.from({ length: i + 1 }, (_, k) => k),
        pointers: { i },
        explanation: `'${char}' is an opening bracket. Pushing to stack.`,
        activeLine: 5,
        variables: { stack: [...stack], currentChar: char, i },
        comparisons: 0,
        phase: 'compare',
        trace: `[Push] '${char}' added to stack. Stack now: [${stack.join(', ')}]`,
      })
    } else {
      // It's a closing bracket
      const top = stack[stack.length - 1]
      const isMatch = top === matchingBrackets[char]

      // 3. Compare with Top Frame
      frames.push({
        array: [...charArray],
        highlights: [i],
        secondaryHighlights: stack.length > 0 ? [stack.length - 1] : [], // Visualizing stack top comparison
        visited: Array.from({ length: i }, (_, k) => k),
        pointers: { i },
        explanation: `'${char}' is a closing bracket. Comparing with stack top: '${top || 'empty'}'`,
        activeLine: 7,
        variables: { stack: [...stack], currentChar: char, top, i },
        comparisons: 1,
        phase: 'compare',
        trace: `[Check] Closing '${char}'. Stack top is '${top || 'none'}'.`,
      })

      if (stack.length === 0 || !isMatch) {
        // 4. Mismatch/Error Frame
        frames.push({
          array: [...charArray],
          highlights: [i],
          secondaryHighlights: [],
          visited: Array.from({ length: i }, (_, k) => k),
          pointers: { i },
          explanation:
            stack.length === 0
              ? 'Stack is empty! No matching opening bracket.'
              : `Mismatch! '${char}' does not match '${top}'.`,
          activeLine: 8,
          variables: {
            stack: [...stack],
            currentChar: char,
            top,
            i,
            error: true,
          },
          comparisons: 1,
          phase: 'not-found',
          trace:
            stack.length === 0
              ? '[Fail] Empty stack on closing char.'
              : `[Fail] '${char}' != '${top}'.`,
        })
        return frames
      }

      stack.pop()
      // 5. Pop/Match Frame
      frames.push({
        array: [...charArray],
        highlights: [i],
        secondaryHighlights: [],
        visited: Array.from({ length: i + 1 }, (_, k) => k),
        pointers: { i },
        explanation: `Match found! Popping '${top}' from stack.`,
        activeLine: 9,
        variables: { stack: [...stack], currentChar: char, top, i },
        comparisons: 1,
        phase: 'found',
        trace: `[Pop] Matched '${char}' with '${top}'.`,
      })
    }
  }

  // Final Frame
  const isValid = stack.length === 0
  frames.push({
    array: [...charArray],
    highlights: [],
    secondaryHighlights: [],
    visited: charArray.map((_, i) => i),
    pointers: {},
    explanation: isValid
      ? 'Iteration complete. Stack is empty. Input is VALID.'
      : 'Iteration complete. Stack is NOT empty. Input is INVALID.',
    activeLine: 10,
    variables: { stack: [...stack], isValid },
    comparisons: 0,
    phase: isValid ? 'found' : 'not-found',
    trace: isValid
      ? '[Success] All brackets matched.'
      : `[Fail] Unmatched brackets left: [${stack.join(', ')}]`,
  })

  return frames
}
