import { VisualizerFrame } from '@/lib/types/visualizer'

export const generatePriorityQueueFrames = (
  elements: { val: string | number; priority: number }[]
): VisualizerFrame[] => {
  const frames: VisualizerFrame[] = []
  const heap: { val: string | number; priority: number }[] = []

  // Initial Frame
  frames.push({
    array: [],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    explanation:
      'Initializing Min-Priority Queue. Smaller priority numbers have higher priority.',
    activeLine: 1,
    variables: { heap: [], size: 0 },
    comparisons: 0,
    phase: 'search',
    trace: '[Init] Empty PQ.',
  })

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i]
    heap.push(element)

    // 1. Insert Frame
    frames.push({
      array: heap.map((h) => h.priority),
      highlights: [heap.length - 1],
      secondaryHighlights: [],
      visited: [],
      pointers: { insertIdx: heap.length - 1 },
      explanation: `Inserting ${element.val} with priority ${element.priority} at end of heap.`,
      activeLine: 4,
      variables: {
        heap: heap.map((h) => `${h.val}(P${h.priority})`),
        size: heap.length,
      },
      comparisons: 0,
      phase: 'compare',
      trace: `[Insert] Added ${element.val} at end.`,
    })

    // Heapify Up (Simplified for visualization)
    let curr = heap.length - 1
    while (curr > 0) {
      const parent = Math.floor((curr - 1) / 2)

      // 2. Compare with Parent Frame
      frames.push({
        array: heap.map((h) => h.priority),
        highlights: [curr, parent],
        secondaryHighlights: [],
        visited: [],
        pointers: { current: curr, parent },
        explanation: `Comparing child priority ${heap[curr].priority} with parent priority ${heap[parent].priority}.`,
        activeLine: 6,
        variables: {
          heap: heap.map((h) => `${h.val}(P${h.priority})`),
          parentIdx: parent,
          currentIdx: curr,
        },
        comparisons: 1,
        phase: 'compare',
        trace: `[HeapifyUp] P${heap[curr].priority} vs P${heap[parent].priority}`,
      })

      if (heap[curr].priority < heap[parent].priority) {
        // Swap
        const temp = heap[curr]
        heap[curr] = heap[parent]
        heap[parent] = temp

        // 3. Swap Frame
        frames.push({
          array: heap.map((h) => h.priority),
          highlights: [curr, parent],
          secondaryHighlights: [],
          visited: [],
          pointers: { current: curr, parent },
          explanation: `Child has higher priority. Swapping with parent.`,
          activeLine: 8,
          variables: {
            heap: heap.map((h) => `${h.val}(P${h.priority})`),
            swapped: true,
          },
          comparisons: 1,
          phase: 'found',
          trace: '[HeapifyUp] Swapped.',
        })
        curr = parent
      } else {
        break
      }
    }
  }

  return frames
}
