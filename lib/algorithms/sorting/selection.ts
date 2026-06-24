import { VisualizerFrame } from '@/lib/types/visualizer'

export function generateSelectionSortFrames(arr: number[]): VisualizerFrame[] {
  const frames: VisualizerFrame[] = []
  const array = [...arr]
  const n = array.length
  let comparisons = 0
  const sorted: number[] = []

  // Initial Frame
  frames.push({
    array: [...array],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    sortedIndices: [...sorted],
    pointers: {},
    phase: 'search',
    explanation: 'Selection Sort: Starting sort...',
    activeLine: 1,
    variables: { n },
    comparisons: 0,
  })

  for (let i = 0; i < n - 1; i++) {
    let min_idx = i

    // Mark current position
    frames.push({
      array: [...array],
      highlights: [i],
      secondaryHighlights: [],
      visited: [],
      sortedIndices: [...sorted],
      pointers: { i: i },
      phase: 'search',
      explanation: `Finding minimum element from index ${i} to ${n - 1}`,
      activeLine: 2,
      variables: { i, min_idx: i },
      comparisons,
    })

    for (let j = i + 1; j < n; j++) {
      comparisons++

      // Compare Frame
      frames.push({
        array: [...array],
        highlights: [min_idx],
        secondaryHighlights: [j],
        visited: [],
        sortedIndices: [...sorted],
        pointers: { min: min_idx, j: j },
        phase: 'compare',
        explanation: `Comparing arr[${j}] (${array[j]}) with current min arr[${min_idx}] (${array[min_idx]})`,
        activeLine: 4,
        variables: {
          i,
          j,
          min_idx,
          'arr[j]': array[j],
          'arr[min]': array[min_idx],
        },
        comparisons,
      })

      if (array[j] < array[min_idx]) {
        min_idx = j

        // Update minimum
        frames.push({
          array: [...array],
          highlights: [min_idx],
          secondaryHighlights: [],
          visited: [],
          sortedIndices: [...sorted],
          pointers: { min: min_idx },
          phase: 'found',
          explanation: `New minimum found at index ${min_idx} (${array[min_idx]})`,
          activeLine: 5,
          variables: { i, j, min_idx },
          comparisons,
        })
      }
    }

    if (min_idx !== i) {
      // Swap Frame (Pre-swap highlight)
      frames.push({
        array: [...array],
        highlights: [],
        secondaryHighlights: [],
        swappedIndices: [i, min_idx],
        visited: [],
        sortedIndices: [...sorted],
        pointers: { i: i, min: min_idx },
        phase: 'compare',
        explanation: `Swapping arr[${i}] (${array[i]}) with arr[${min_idx}] (${array[min_idx]})`,
        activeLine: 7,
        variables: { i, min_idx },
        comparisons,
      })

      // Algorithm Swap
      const temp = array[i]
      array[i] = array[min_idx]
      array[min_idx] = temp

      // Post-Swap Frame
      sorted.push(i)
      frames.push({
        array: [...array],
        highlights: [],
        secondaryHighlights: [],
        sortedIndices: [...sorted],
        visited: [],
        pointers: {},
        phase: 'found',
        explanation: `Element ${array[i]} is now in its correct position`,
        activeLine: 8,
        variables: { i },
        comparisons,
      })
    } else {
      // Element already in correct position
      sorted.push(i)
      frames.push({
        array: [...array],
        highlights: [],
        secondaryHighlights: [],
        sortedIndices: [...sorted],
        visited: [],
        pointers: {},
        phase: 'found',
        explanation: `Element ${array[i]} is already in correct position`,
        activeLine: 8,
        variables: { i },
        comparisons,
      })
    }
  }

  // Final Sorted Frame
  frames.push({
    array: [...array],
    highlights: [],
    secondaryHighlights: [],
    sortedIndices: Array.from({ length: n }, (_, i) => i),
    visited: [],
    pointers: {},
    phase: 'found',
    explanation: 'Array is fully sorted!',
    activeLine: 9,
    variables: {},
    comparisons,
  })

  return frames
}
