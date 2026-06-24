import { VisualizerFrame } from '@/lib/types/visualizer'

export function generateBubbleSortFrames(arr: number[]): VisualizerFrame[] {
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
    explanation: 'Bubble Sort: Starting sort...',
    activeLine: 1,
    variables: { n },
    comparisons: 0,
  })

  for (let i = 0; i < n - 1; i++) {
    let swapped = false

    for (let j = 0; j < n - i - 1; j++) {
      comparisons++

      // Compare Frame
      frames.push({
        array: [...array],
        highlights: [j, j + 1],
        secondaryHighlights: [],
        visited: [],
        sortedIndices: [...sorted],
        pointers: { j: j, 'j+1': j + 1 },
        phase: 'compare',
        explanation: `Comparing indices ${j} (${array[j]}) and ${j + 1} (${array[j + 1]})`,
        activeLine: 3,
        variables: { i, j, 'arr[j]': array[j], 'arr[j+1]': array[j + 1] },
        comparisons,
      })

      if (array[j] > array[j + 1]) {
        // Swap Frame (Pre-swap highlight)
        frames.push({
          array: [...array],
          highlights: [],
          secondaryHighlights: [],
          swappedIndices: [j, j + 1],
          visited: [],
          sortedIndices: [...sorted],
          pointers: { j: j, 'j+1': j + 1 },
          phase: 'compare',
          explanation: `${array[j]} > ${array[j + 1]}, swapping...`,
          activeLine: 4,
          variables: { i, j },
          comparisons,
        })

        // Algorithm Swap
        const temp = array[j]
        array[j] = array[j + 1]
        array[j + 1] = temp
        swapped = true

        // Post-Swap Frame
        frames.push({
          array: [...array],
          highlights: [],
          secondaryHighlights: [],
          swappedIndices: [j, j + 1],
          visited: [],
          sortedIndices: [...sorted],
          pointers: { j: j, 'j+1': j + 1 },
          phase: 'compare',
          explanation: `Swapped!`,
          activeLine: 5,
          variables: { i, j },
          comparisons,
        })
      }
    }

    // Element at end is sorted
    sorted.push(n - 1 - i)
    frames.push({
      array: [...array],
      highlights: [],
      secondaryHighlights: [],
      visited: [],
      sortedIndices: [...sorted],
      pointers: {},
      phase: 'found',
      explanation: `Pass ${i + 1} complete. Largest element bubbled to end.`,
      activeLine: 6,
      variables: { i },
      comparisons,
    })

    if (!swapped) break // Optimization
  }

  // Final Sorted Frame
  frames.push({
    array: [...array],
    highlights: [],
    secondaryHighlights: [],
    swappedIndices: [],
    sortedIndices: Array.from({ length: n }, (_, i) => i), // All sorted
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
