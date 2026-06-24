import type { VisualizerFrame } from '@/lib/types/visualizer'

function swap(arr: number[], i: number, j: number) {
  const t = arr[i]
  arr[i] = arr[j]
  arr[j] = t
}

/**
 * Generate frames for heapify-down (sift down) at index i in a min-heap.
 */
export function generateHeapifyFrames(
  arr: number[],
  isMinHeap: boolean
): VisualizerFrame[] {
  const frames: VisualizerFrame[] = []
  const heap = [...arr]
  const n = heap.length

  const compare = (parent: number, child: number) =>
    isMinHeap ? parent > child : parent < child

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    let idx = i
    frames.push({
      array: [...heap],
      highlights: [idx],
      secondaryHighlights: [],
      visited: [],
      pointers: { i: idx },
      explanation: `Heapify at index ${idx} (value ${heap[idx]}).`,
      activeLine: 1,
      variables: { heap: [...heap], i: idx },
      comparisons: 0,
      phase: 'search',
    })

    while (true) {
      let smallest = idx
      const left = 2 * idx + 1
      const right = 2 * idx + 2

      if (left < n && compare(heap[smallest], heap[left])) smallest = left
      if (right < n && compare(heap[smallest], heap[right])) smallest = right
      if (smallest === idx) break

      swap(heap, idx, smallest)
      frames.push({
        array: [...heap],
        highlights: [smallest],
        secondaryHighlights: [idx],
        visited: [],
        pointers: { i: smallest },
        explanation: `Swap ${heap[idx]} with child at ${smallest}. Sift down.`,
        activeLine: 2,
        variables: { heap: [...heap], i: smallest },
        comparisons: frames.length,
        phase: 'compare',
      })
      idx = smallest
    }
  }

  frames.push({
    array: [...heap],
    highlights: [],
    secondaryHighlights: [],
    visited: [...Array(n).keys()],
    pointers: {},
    explanation: 'Heapify complete. Heap property satisfied.',
    activeLine: 3,
    variables: { heap: [...heap] },
    comparisons: frames.length,
    phase: 'found',
  })

  return frames
}
