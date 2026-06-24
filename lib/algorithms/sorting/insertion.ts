import { VisualizerFrame } from '@/lib/types/visualizer'

export function generateInsertionSortFrames(arr: number[]): VisualizerFrame[] {
  const frames: VisualizerFrame[] = []
  const array = [...arr]
  const n = array.length
  let comparisons = 0

  // Initial Frame
  frames.push({
    array: [...array],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    sortedIndices: [0], // First element is considered sorted
    pointers: {},
    phase: 'search',
    explanation: 'Insertion Sort: First element is already sorted',
    activeLine: 1,
    variables: { n },
    comparisons: 0,
  })

  for (let i = 1; i < n; i++) {
    const key = array[i]
    let j = i - 1
    const currentSorted = Array.from({ length: i }, (_, idx) => idx)

    // Pick element to insert
    frames.push({
      array: [...array],
      highlights: [i],
      secondaryHighlights: [],
      visited: [],
      sortedIndices: [...currentSorted],
      pointers: { key: i },
      phase: 'search',
      explanation: `Inserting element ${key} into sorted portion`,
      activeLine: 2,
      variables: { i, key, j },
      comparisons,
    })

    // Shift elements
    while (j >= 0 && array[j] > key) {
      comparisons++

      // Compare Frame
      frames.push({
        array: [...array],
        highlights: [j],
        secondaryHighlights: [j + 1],
        visited: [],
        sortedIndices: [...currentSorted],
        pointers: { j: j, key: i },
        phase: 'compare',
        explanation: `${array[j]} > ${key}, shifting ${array[j]} to the right`,
        activeLine: 4,
        variables: { i, j, key, 'arr[j]': array[j] },
        comparisons,
      })

      array[j + 1] = array[j]

      // Shift Frame
      frames.push({
        array: [...array],
        highlights: [j, j + 1],
        secondaryHighlights: [],
        visited: [],
        sortedIndices: [...currentSorted],
        pointers: { j: j },
        phase: 'compare',
        explanation: `Shifted ${array[j + 1]} to position ${j + 1}`,
        activeLine: 5,
        variables: { i, j, key },
        comparisons,
      })

      j--
    }

    if (j >= 0) {
      comparisons++
      // Final comparison that breaks the loop
      frames.push({
        array: [...array],
        highlights: [j],
        secondaryHighlights: [],
        visited: [],
        sortedIndices: [...currentSorted],
        pointers: { j: j },
        phase: 'compare',
        explanation: `${array[j]} ≤ ${key}, found insertion position`,
        activeLine: 4,
        variables: { i, j, key, 'arr[j]': array[j] },
        comparisons,
      })
    }

    // Insert key
    array[j + 1] = key

    frames.push({
      array: [...array],
      highlights: [j + 1],
      secondaryHighlights: [],
      visited: [],
      sortedIndices: Array.from({ length: i + 1 }, (_, idx) => idx),
      pointers: {},
      phase: 'found',
      explanation: `Inserted ${key} at position ${j + 1}`,
      activeLine: 6,
      variables: { i },
      comparisons,
    })
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
    activeLine: 7,
    variables: {},
    comparisons,
  })

  return frames
}
