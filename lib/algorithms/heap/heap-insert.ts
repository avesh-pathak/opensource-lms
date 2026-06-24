import type { VisualizerFrame } from '@/lib/types/visualizer'

function swap(arr: number[], i: number, j: number) {
  const t = arr[i]
  arr[i] = arr[j]
  arr[j] = t
}

/**
 * Min-heap: bubble up at index i.
 * Returns frames for each step.
 */
export function generateHeapInsertFrames(
  initialHeap: number[],
  valueToInsert: number,
  isMinHeap: boolean
): VisualizerFrame[] {
  const frames: VisualizerFrame[] = []
  const heap = [...initialHeap]
  heap.push(valueToInsert)
  let i = heap.length - 1

  const compare = (child: number, parent: number) =>
    isMinHeap ? child < parent : child > parent

  frames.push({
    array: [...heap],
    highlights: [i],
    secondaryHighlights: [],
    visited: [],
    pointers: { i: i },
    explanation: `Insert ${valueToInsert}. Place at end (index ${i}).`,
    activeLine: 1,
    variables: { heap: [...heap], i },
    comparisons: 0,
    phase: 'search',
  })

  while (i > 0) {
    const parentIdx = Math.floor((i - 1) / 2)
    const parent = heap[parentIdx]
    const child = heap[i]

    if (!compare(child, parent)) break

    swap(heap, i, parentIdx)
    frames.push({
      array: [...heap],
      highlights: [parentIdx],
      secondaryHighlights: [i],
      visited: [],
      pointers: { i: parentIdx },
      explanation: `${child} < ${parent}: swap with parent. Bubble up.`,
      activeLine: 2,
      variables: { heap: [...heap], i: parentIdx },
      comparisons: frames.length,
      phase: 'compare',
    })
    i = parentIdx
  }

  frames.push({
    array: [...heap],
    highlights: [],
    secondaryHighlights: [],
    visited: [...Array(heap.length).keys()],
    pointers: {},
    explanation: `Heap property restored. Insert complete.`,
    activeLine: 3,
    variables: { heap: [...heap] },
    comparisons: frames.length,
    phase: 'found',
  })

  return frames
}
