import { VisualizerFrame } from '@/lib/types/visualizer'

export function generateQuickSortFrames(arr: number[]): VisualizerFrame[] {
  const frames: VisualizerFrame[] = []
  const array = [...arr]
  let comparisons = 0

  // Initial Frame
  frames.push({
    array: [...array],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    phase: 'search',
    explanation: 'Quick Sort: Starting partitioning...',
    activeLine: 1,
    variables: { n: array.length },
    comparisons: 0,
  })

  const sortedPivots = new Set<number>()

  function quickSort(arr: number[], low: number, high: number) {
    if (low < high) {
      const pi = partition(arr, low, high)
      sortedPivots.add(pi)
      quickSort(arr, low, pi - 1)
      quickSort(arr, pi + 1, high)
    } else if (low === high) {
      sortedPivots.add(low)
    }
  }

  function partition(arr: number[], low: number, high: number): number {
    const randomIndex = Math.floor(Math.random() * (high - low + 1)) + low
    if (randomIndex !== high) {
      const temp = arr[randomIndex]
      arr[randomIndex] = arr[high]
      arr[high] = temp
      array[randomIndex] = arr[randomIndex]
      array[high] = arr[high]
    }
    const pivot = arr[high]

    // Select Pivot Frame
    frames.push({
      array: [...array],
      highlights: [high],
      secondaryHighlights: [],
      visited: [],
      sortedIndices: Array.from(sortedPivots),
      ranges: [{ start: low, end: high, type: 'active' }],
      pointers: { pivot: high },
      phase: 'search',
      explanation: `Selected pivot: ${pivot} at index ${high} (randomized)`,
      activeLine: 2,
      variables: { low, high, pivot },
      comparisons,
    })

    let i = low - 1

    for (let j = low; j < high; j++) {
      comparisons++

      // Compare with Pivot
      frames.push({
        array: [...array],
        highlights: [high],
        secondaryHighlights: [j],
        visited: [],
        sortedIndices: Array.from(sortedPivots),
        ranges: [{ start: low, end: high, type: 'active' }],
        pointers: { pivot: high, j: j, i: Math.max(low, i + 1) },
        phase: 'compare',
        explanation: `Comparing ${arr[j]} with pivot ${pivot}`,
        activeLine: 3,
        variables: { i, j, 'arr[j]': arr[j], pivot },
        comparisons,
      })

      if (arr[j] < pivot) {
        i++

        // Swap Frame (if needed)
        if (i !== j) {
          frames.push({
            array: [...array],
            highlights: [],
            secondaryHighlights: [],
            swappedIndices: [i, j],
            visited: [],
            sortedIndices: Array.from(sortedPivots),
            ranges: [{ start: low, end: high, type: 'active' }],
            pointers: { i: i, j: j },
            phase: 'compare',
            explanation: `${arr[j]} < ${pivot}, swapping arr[${i}] (${arr[i]}) and arr[${j}] (${arr[j]})`,
            activeLine: 4,
            variables: { i, j },
            comparisons,
          })

          const temp = arr[i]
          arr[i] = arr[j]
          arr[j] = temp
          array[i] = arr[i]
          array[j] = arr[j]

          frames.push({
            array: [...array],
            highlights: [i, j],
            secondaryHighlights: [],
            visited: [],
            sortedIndices: Array.from(sortedPivots),
            pointers: {},
            phase: 'found',
            explanation: `Swapped!`,
            activeLine: 5,
            variables: { i, j },
            comparisons,
          })
        }
      }
    }

    // Place pivot in correct position
    const pivotIndex = i + 1

    if (pivotIndex !== high) {
      frames.push({
        array: [...array],
        highlights: [],
        secondaryHighlights: [],
        swappedIndices: [pivotIndex, high],
        visited: [],
        sortedIndices: Array.from(sortedPivots),
        pointers: { pivot_pos: pivotIndex },
        phase: 'compare',
        explanation: `Placing pivot ${pivot} in its correct position (index ${pivotIndex})`,
        activeLine: 6,
        variables: { pivotIndex, high },
        comparisons,
      })

      const temp = arr[pivotIndex]
      arr[pivotIndex] = arr[high]
      arr[high] = temp
      array[pivotIndex] = arr[pivotIndex]
      array[high] = arr[high]
    }

    return pivotIndex
  }

  quickSort(array, 0, array.length - 1)

  // Final Sorted Frame
  frames.push({
    array: [...array],
    highlights: [],
    secondaryHighlights: [],
    sortedIndices: Array.from({ length: array.length }, (_, i) => i),
    visited: [],
    pointers: {},
    phase: 'found',
    explanation: 'Array is fully sorted!',
    activeLine: 8,
    variables: {},
    comparisons,
  })

  return frames
}
