import { VisualizerFrame } from '@/lib/types/visualizer'

export const generateSlidingWindowMaxFrames = (
  nums: number[],
  k: number
): VisualizerFrame[] => {
  const frames: VisualizerFrame[] = []
  const n = nums.length
  const deque: number[] = [] // Stores indices
  const res: number[] = []

  // Initial Frame
  frames.push({
    array: [...nums],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    explanation: `Starting Sliding Window Maximum (k=${k}). Initializing empty Deque.`,
    activeLine: 2,
    variables: { deque: [], res: [], k },
    comparisons: 0,
    phase: 'search',
    trace: '[Init] Deque = []. Ready to process window.',
  })

  for (let i = 0; i < n; i++) {
    const left = i - k + 1

    // 1. Processing Element Frame
    frames.push({
      array: [...nums],
      highlights: [i],
      secondaryHighlights: deque.map((idx) => idx),
      visited: Array.from({ length: i }, (_, j) => j),
      pointers: { i, windowLeft: Math.max(0, left) },
      explanation: `Processing element ${nums[i]} at index ${i}.`,
      activeLine: 5,
      variables: {
        deque: deque.map((idx) => nums[idx]),
        res: [...res],
        i,
        left,
      },
      comparisons: 0,
      phase: 'search',
      trace: `[Iter] i=${i}, val=${nums[i]}.`,
    })

    // 2. Remove elements out of window
    if (deque.length > 0 && deque[0] === i - k) {
      const removed = deque.shift()!
      frames.push({
        array: [...nums],
        highlights: [i],
        secondaryHighlights: deque.map((idx) => idx),
        visited: Array.from({ length: i }, (_, j) => j),
        pointers: { i, removedIdx: removed },
        explanation: `Index ${removed} is out of window range [${left}, ${i}]. Removing from front of Deque.`,
        activeLine: 7,
        variables: {
          deque: deque.map((idx) => nums[idx]),
          res: [...res],
          removed,
        },
        comparisons: 1,
        phase: 'compare',
        trace: `[PopFront] ${removed} is out of window.`,
      })
    }

    // 3. Maintain monotonic property
    while (deque.length > 0 && nums[deque[deque.length - 1]] < nums[i]) {
      const popped = deque.pop()!
      frames.push({
        array: [...nums],
        highlights: [i],
        secondaryHighlights: deque.map((idx) => idx),
        visited: Array.from({ length: i }, (_, j) => j),
        pointers: { i, poppedIdx: popped },
        explanation: `${nums[popped]} at Deque tail is < ${nums[i]}. Removing from back to maintain monotonic property.`,
        activeLine: 9,
        variables: {
          deque: deque.map((idx) => nums[idx]),
          res: [...res],
          popped,
        },
        comparisons: 1,
        phase: 'compare',
        trace: `[PopBack] ${nums[popped]} < ${nums[i]}.`,
      })
    }

    deque.push(i)
    // 4. Push Current Frame
    frames.push({
      array: [...nums],
      highlights: [i],
      secondaryHighlights: deque.map((idx) => idx),
      visited: Array.from({ length: i + 1 }, (_, j) => j),
      pointers: { i },
      explanation: `Pushing index ${i} to back of Deque.`,
      activeLine: 11,
      variables: { deque: deque.map((idx) => nums[idx]), res: [...res], i },
      comparisons: 0,
      phase: 'compare',
      trace: `[PushBack] ${i} added.`,
    })

    // 5. Add to result if window is full
    if (i >= k - 1) {
      res.push(nums[deque[0]])
      frames.push({
        array: [...nums],
        highlights: Array.from({ length: k }, (_, j) => i - k + 1 + j),
        secondaryHighlights: deque.map((idx) => idx),
        visited: Array.from({ length: i + 1 }, (_, j) => j),
        pointers: { i, maxIdx: deque[0] },
        explanation: `Window fully formed. Maximum element in window [${left}, ${i}] is ${nums[deque[0]]}. Adding to result.`,
        activeLine: 13,
        variables: {
          deque: deque.map((idx) => nums[idx]),
          res: [...res],
          currentMax: nums[deque[0]],
        },
        comparisons: 0,
        phase: 'found',
        trace: `[Result] Window Max = ${nums[deque[0]]}`,
      })
    }
  }

  // Final Frame
  frames.push({
    array: [...nums],
    highlights: [],
    secondaryHighlights: [],
    visited: nums.map((_, j) => j),
    pointers: {},
    explanation: 'Algorithm complete. Final result array generated.',
    activeLine: 14,
    variables: { res: [...res], final: true },
    comparisons: 0,
    phase: 'found',
    trace: `[End] res = [${res.join(', ')}]`,
  })

  return frames
}
