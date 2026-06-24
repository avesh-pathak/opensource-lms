import { VisualizerFrame } from '@/lib/types/visualizer'

export const generateMergeSortFrames = (array: number[]): VisualizerFrame[] => {
  const frames: VisualizerFrame[] = []
  let comparisons = 0
  const arr = [...array]
  const n = arr.length

  // Initial Frame
  frames.push({
    array: [...arr],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    explanation: 'Starting Merge Sort. A Divide and Conquer algorithm.',
    activeLine: 1,
    variables: { n },
    comparisons: 0,
    phase: 'search',
    sortedIndices: [],
  })

  const merge = (start: number, mid: number, end: number) => {
    const leftArr = arr.slice(start, mid + 1)
    const rightArr = arr.slice(mid + 1, end + 1)
    let i = 0,
      j = 0,
      k = start

    frames.push({
      array: [...arr],
      highlights: [],
      secondaryHighlights: [],
      visited: [], // Could mark current range as active?
      ranges: [{ start, end, type: 'active' }],
      pointers: { left: start, mid, right: end },
      explanation: `Merging subarrays: [${start}...${mid}] and [${mid + 1}...${end}].`,
      activeLine: 6,
      variables: { start, mid, end },
      comparisons,
      phase: 'search',
      sortedIndices: [], // Merge sort doesn't really have "sorted indices" until the very end or per chunk
    })

    while (i < leftArr.length && j < rightArr.length) {
      comparisons++

      // Compare elements from left and right arrays
      // Note: In visualizer, we can't easily show "auxiliary" arrays without a lot of UI work.
      // We usually just highlight the indices k corresponds to, but since values are overwritten, it's tricky.
      // For now, we'll highlight 'k' as the position being filled.

      frames.push({
        array: [...arr],
        highlights: [start + i],
        secondaryHighlights: [mid + 1 + j], // Hard to map back to original indices since we made copies
        visited: [],
        ranges: [{ start, end, type: 'active' }],
        pointers: { k },
        explanation: `Comparing ${leftArr[i]} (Left) vs ${rightArr[j]} (Right).`,
        activeLine: 9,
        variables: { i, j, k, leftVal: leftArr[i], rightVal: rightArr[j] },
        comparisons,
        phase: 'compare',
      })

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i]
        i++
        frames.push({
          array: [...arr],
          highlights: [k],
          secondaryHighlights: [start + i - 1],
          visited: [],
          pointers: { k, i: start + i - 1 }, // Approximating i relative to original if needed, but simple is fine
          explanation: `Taking ${arr[k]} from Left side.`,
          activeLine: 10,
          variables: { k, val: arr[k] },
          comparisons,
          phase: 'compare',
          swappedIndices: [k, k], // Just to trigger a pulse
        })
      } else {
        arr[k] = rightArr[j]
        j++
        frames.push({
          array: [...arr],
          highlights: [k],
          secondaryHighlights: [mid + j],
          visited: [],
          pointers: { k, j: mid + j },
          explanation: `Taking ${arr[k]} from Right side.`,
          activeLine: 12,
          variables: { k, val: arr[k] },
          comparisons,
          phase: 'compare',
          swappedIndices: [k, k],
        })
      }
      k++
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i]
      i++
      k++
      frames.push({
        array: [...arr],
        highlights: [k - 1],
        secondaryHighlights: [start + i - 1],
        visited: [],
        pointers: { k },
        explanation: `Taking remaining ${arr[k - 1]} from Left side.`,
        activeLine: 14,
        variables: { k },
        comparisons,
        phase: 'search',
      })
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j]
      j++
      k++
      frames.push({
        array: [...arr],
        highlights: [k - 1],
        secondaryHighlights: [mid + j],
        visited: [],
        pointers: { k },
        explanation: `Taking remaining ${arr[k - 1]} from Right side.`,
        activeLine: 15,
        variables: { k },
        comparisons,
        phase: 'search',
      })
    }

    // Mark this range as temporarily sorted/merged
    // Logic to track *confirmed* sorted (only fully sorted at end) or show visited color
  }

  const mergeSort = (start: number, end: number) => {
    if (start < end) {
      const mid = Math.floor((start + end) / 2)

      frames.push({
        array: [...arr],
        highlights: [],
        secondaryHighlights: [],
        visited: [],
        ranges: [{ start, end, type: 'active' }],
        pointers: { mid },
        explanation: `Splitting [${start}...${end}] at index ${mid}.`,
        activeLine: 3,
        variables: { start, mid, end },
        comparisons,
        phase: 'search',
      })

      mergeSort(start, mid)
      mergeSort(mid + 1, end)
      merge(start, mid, end)
    }
  }

  mergeSort(0, n - 1)

  const finalSorted = Array.from({ length: n }, (_, k) => k)
  frames.push({
    array: [...arr],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    explanation: 'Merge Sort Complete!',
    activeLine: 20,
    variables: {},
    comparisons,
    phase: 'found',
    sortedIndices: finalSorted,
  })

  return frames
}

export const generateInsertionSortFrames = (
  array: number[]
): VisualizerFrame[] => {
  const frames: VisualizerFrame[] = []
  let comparisons = 0
  const arr = [...array]
  const n = arr.length
  const sortedIndices: number[] = [0] // First element is always 'sorted' relative to itself

  // Initial Frame
  frames.push({
    array: [...arr],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    explanation:
      'Starting Insertion Sort. We split the array into sorted (left) and unsorted (right) parts. Initially, the first element is sorted.',
    activeLine: 1,
    variables: { n },
    comparisons: 0,
    phase: 'search',
    sortedIndices: [...sortedIndices],
  })

  for (let i = 1; i < n; i++) {
    const key = arr[i]
    let j = i - 1

    frames.push({
      array: [...arr],
      highlights: [i],
      secondaryHighlights: [],
      visited: [],
      pointers: { i, key: i },
      explanation: `Taking ${key} (at index ${i}) to insert into the sorted portion...`,
      activeLine: 2,
      variables: { i, key, j },
      comparisons,
      phase: 'search',
      sortedIndices: [...sortedIndices],
    })

    while (j >= 0 && arr[j] > key) {
      comparisons++

      frames.push({
        array: [...arr],
        highlights: [j, j + 1],
        secondaryHighlights: [],
        visited: [],
        pointers: { i, key: i, j },
        explanation: `Comparing ${arr[j]} > ${key}. True! Shift ${arr[j]} to the right.`,
        activeLine: 4,
        variables: { i, key, j, 'arr[j]': arr[j] },
        comparisons,
        phase: 'compare',
        sortedIndices: [...sortedIndices], // Keep visually sorted
      })

      arr[j + 1] = arr[j]

      frames.push({
        array: [...arr],
        highlights: [j + 1],
        secondaryHighlights: [j], // Old position
        visited: [],
        pointers: { i, key: i, j },
        explanation: `Shifted.`,
        activeLine: 5,
        variables: { i, key, j },
        comparisons,
        phase: 'compare',
        sortedIndices: [...sortedIndices],
      })

      j = j - 1
    }

    // Final assignment
    arr[j + 1] = key
    sortedIndices.push(i) // Now up to i is sorted

    frames.push({
      array: [...arr],
      highlights: [j + 1],
      secondaryHighlights: [],
      visited: [],
      pointers: { inserted: j + 1 },
      explanation: `Inserted ${key} at index ${j + 1}.`,
      activeLine: 7,
      variables: { i, key },
      comparisons,
      phase: 'search',
      sortedIndices: Array.from({ length: i + 1 }, (_, k) => k), // 0 to i is sorted
    })
  }

  const finalSorted = Array.from({ length: n }, (_, k) => k)
  frames.push({
    array: [...arr],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    explanation: 'Insertion Sort Complete!',
    activeLine: 10,
    variables: {},
    comparisons,
    phase: 'found',
    sortedIndices: finalSorted,
  })

  return frames
}

export const generateSelectionSortFrames = (
  array: number[]
): VisualizerFrame[] => {
  const frames: VisualizerFrame[] = []
  let comparisons = 0
  const arr = [...array]
  const n = arr.length
  const sortedIndices: number[] = []

  // Initial Frame
  frames.push({
    array: [...arr],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    explanation:
      'Starting Selection Sort. We will repeatedly find the minimum element from the unsorted part and put it at the beginning.',
    activeLine: 1,
    variables: { n },
    comparisons: 0,
    phase: 'search',
    sortedIndices: [],
  })

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i

    // Visual: Highlight 'i' as current start and minIdx (initially same)
    frames.push({
      array: [...arr],
      highlights: [i],
      secondaryHighlights: [minIdx],
      visited: [],
      pointers: { i, min: minIdx },
      explanation: `Pass ${i + 1}. Assuming minimum is at index ${i} (${arr[i]}).`,
      activeLine: 2,
      variables: { i, minIdx },
      comparisons,
      phase: 'search',
      sortedIndices: [...sortedIndices],
    })

    for (let j = i + 1; j < n; j++) {
      comparisons++

      // Compare
      frames.push({
        array: [...arr],
        highlights: [j],
        secondaryHighlights: [minIdx],
        visited: [],
        pointers: { i, min: minIdx, j },
        explanation: `Checking if ${arr[j]} < ${arr[minIdx]} (current min)?`,
        activeLine: 4,
        variables: { i, j, minIdx, 'arr[j]': arr[j], min: arr[minIdx] },
        comparisons,
        phase: 'compare',
        sortedIndices: [...sortedIndices],
      })

      if (arr[j] < arr[minIdx]) {
        minIdx = j

        // Found new min
        frames.push({
          array: [...arr],
          highlights: [j],
          secondaryHighlights: [], // Clear old min highlight
          visited: [],
          pointers: { i, min: minIdx, j },
          explanation: `Found new minimum! ${arr[j]} is smaller. Update min to index ${j}.`,
          activeLine: 5,
          variables: { i, j, minIdx },
          comparisons,
          phase: 'compare',
          sortedIndices: [...sortedIndices],
        })
      }
    }

    // Swap if found new min
    if (minIdx !== i) {
      const temp = arr[i]
      arr[i] = arr[minIdx]
      arr[minIdx] = temp

      frames.push({
        array: [...arr],
        highlights: [i, minIdx],
        secondaryHighlights: [],
        visited: [],
        pointers: { i, min: minIdx },
        explanation: `Swapping minimum (${arr[i]}) to correct position ${i}.`,
        activeLine: 8,
        variables: { i, minIdx },
        comparisons,
        phase: 'search',
        swappedIndices: [i, minIdx],
        sortedIndices: [...sortedIndices],
      })
    } else {
      frames.push({
        array: [...arr],
        highlights: [i],
        secondaryHighlights: [],
        visited: [],
        pointers: { i },
        explanation: `Minimum was already at position ${i}. No swap needed.`,
        activeLine: 8,
        variables: { i },
        comparisons,
        phase: 'search',
        sortedIndices: [...sortedIndices],
      })
    }

    sortedIndices.push(i)

    frames.push({
      array: [...arr],
      highlights: [],
      secondaryHighlights: [],
      visited: [],
      pointers: {},
      explanation: `Index ${i} is now sorted.`,
      activeLine: 1,
      variables: {},
      comparisons,
      phase: 'search',
      sortedIndices: [...sortedIndices],
    })
  }

  // Final element is implicitly sorted
  sortedIndices.push(n - 1)
  const finalSorted = Array.from({ length: n }, (_, k) => k)

  frames.push({
    array: [...arr],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    explanation: 'Selection Sort Complete!',
    activeLine: 10,
    variables: {},
    comparisons,
    phase: 'found',
    sortedIndices: finalSorted,
  })

  return frames
}

export const generateBubbleSortFrames = (
  array: number[]
): VisualizerFrame[] => {
  const frames: VisualizerFrame[] = []
  let comparisons = 0
  const arr = [...array]
  const n = arr.length
  const sortedIndices: number[] = []

  // Initial Frame
  frames.push({
    array: [...arr],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    explanation:
      'Starting Bubble Sort. We will repeatedly step through the list, comparing adjacent elements and swapping them if they are in the wrong order.',
    activeLine: 1,
    variables: { n },
    comparisons: 0,
    phase: 'search',
    sortedIndices: [],
  })

  for (let i = 0; i < n - 1; i++) {
    let swapped = false

    for (let j = 0; j < n - i - 1; j++) {
      comparisons++

      // 1. Compare Frame
      frames.push({
        array: [...arr],
        highlights: [j, j + 1],
        secondaryHighlights: [],
        visited: [],
        pointers: { j: j, 'j+1': j + 1 },
        explanation: `Comparing indices ${j} and ${j + 1}: Is ${arr[j]} > ${arr[j + 1]}?`,
        activeLine: 3,
        variables: { i, j, 'arr[j]': arr[j], 'arr[j+1]': arr[j + 1] },
        comparisons,
        phase: 'compare',
        sortedIndices: [...sortedIndices],
      })

      if (arr[j] > arr[j + 1]) {
        // Swap
        const temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
        swapped = true

        // 2. Swap Frame
        frames.push({
          array: [...arr],
          highlights: [j, j + 1],
          secondaryHighlights: [],
          visited: [],
          pointers: { j: j, 'j+1': j + 1 },
          explanation: `${temp} > ${arr[j]}, so we SWAP them.`,
          activeLine: 4,
          variables: { i, j, temp },
          comparisons,
          phase: 'compare', // Reuse 'compare' or add 'swap' phase
          swappedIndices: [j, j + 1],
          sortedIndices: [...sortedIndices],
        })
      }
    }

    // Mark last element as sorted
    sortedIndices.push(n - i - 1)

    frames.push({
      array: [...arr],
      highlights: [],
      secondaryHighlights: [],
      visited: [],
      pointers: {},
      explanation: `Pass ${i + 1} complete. Element at index ${n - i - 1} is now in its correct sorted position.`,
      activeLine: 2, // Outer loop
      variables: { i },
      comparisons,
      phase: 'search',
      sortedIndices: [...sortedIndices],
    })

    // Optimization: Stop if no swaps occurred
    if (!swapped) {
      frames.push({
        array: [...arr],
        highlights: [],
        secondaryHighlights: [],
        visited: [],
        pointers: {},
        explanation:
          'No swaps detected in this pass. The array is fully sorted!',
        activeLine: 10,
        variables: {},
        comparisons,
        phase: 'found',
        sortedIndices: Array.from({ length: n }, (_, k) => k), // All sorted
      })
      return frames
    }
  }

  // Final "All Sorted" Frame (if loop finishes naturally)
  // Add the remaining elements to sorted (usually just index 0 remains)
  const finalSorted = Array.from({ length: n }, (_, k) => k)

  frames.push({
    array: [...arr],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    explanation: 'Bubble Sort Complete! The array is sorted.',
    activeLine: 12,
    variables: {},
    comparisons,
    phase: 'found',
    sortedIndices: finalSorted,
  })

  return frames
}

export const generateQuickSortFrames = (array: number[]): VisualizerFrame[] => {
  const frames: VisualizerFrame[] = []
  let comparisons = 0
  const arr = [...array]
  const n = arr.length

  // Initial Frame
  frames.push({
    array: [...arr],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    explanation:
      'Starting Quick Sort. Divide and conquer using a pivot element.',
    activeLine: 1,
    variables: { n },
    comparisons: 0,
    phase: 'search',
    sortedIndices: [],
  })

  const partition = (low: number, high: number): number => {
    const pivot = arr[high] // Choosing last element as pivot
    let i = low - 1 // Index of smaller element

    frames.push({
      array: [...arr],
      highlights: [high],
      secondaryHighlights: [],
      visited: [],
      ranges: [{ start: low, end: high, type: 'active' }],
      pointers: { pivot: high, low, high },
      explanation: `Partitioning range [${low}...${high}]. Pivot is ${pivot} at index ${high}.`,
      activeLine: 5,
      variables: { low, high, pivot },
      comparisons,
      phase: 'search',
    })

    for (let j = low; j < high; j++) {
      comparisons++

      frames.push({
        array: [...arr],
        highlights: [j],
        secondaryHighlights: [high],
        visited: [],
        ranges: [{ start: low, end: high, type: 'active' }],
        pointers: { pivot: high, j, i },
        explanation: `Comparing ${arr[j]} < ${pivot}?`,
        activeLine: 7,
        variables: { j, val: arr[j], pivot },
        comparisons,
        phase: 'compare',
      })

      if (arr[j] < pivot) {
        i++
        // Swap arr[i] and arr[j]
        const temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp

        frames.push({
          array: [...arr],
          highlights: [i, j],
          secondaryHighlights: [high],
          visited: [],
          ranges: [{ start: low, end: high, type: 'active' }],
          pointers: { pivot: high, j, i },
          explanation: `${arr[i]} is smaller than pivot. Swapping to index ${i}.`,
          activeLine: 9,
          variables: { i, j },
          comparisons,
          phase: 'compare',
          swappedIndices: [i, j],
        })
      }
    }

    // Swap arr[i+1] and arr[high] (or pivot)
    const temp = arr[i + 1]
    arr[i + 1] = arr[high]
    arr[high] = temp

    frames.push({
      array: [...arr],
      highlights: [i + 1, high],
      secondaryHighlights: [],
      visited: [],
      ranges: [{ start: low, end: high, type: 'active' }],
      pointers: { pivot: i + 1 },
      explanation: `Placing pivot ${arr[i + 1]} at correct position ${i + 1}.`,
      activeLine: 12,
      variables: { i, high },
      comparisons,
      phase: 'compare',
      swappedIndices: [i + 1, high],
    })

    return i + 1
  }

  const quickSort = (low: number, high: number) => {
    if (low < high) {
      const pi = partition(low, high)

      // pi is now at right place
      frames.push({
        array: [...arr],
        highlights: [pi],
        secondaryHighlights: [],
        visited: [],
        pointers: { pi },
        explanation: `Element ${arr[pi]} is sorted at index ${pi}.`,
        activeLine: 15,
        variables: { pi },
        comparisons,
        phase: 'search',
        sortedIndices: [], // Could accumulate sorted indices if we tracked them globally
      })

      quickSort(low, pi - 1)
      quickSort(pi + 1, high)
    }
  }

  quickSort(0, n - 1)

  const finalSorted = Array.from({ length: n }, (_, k) => k)
  frames.push({
    array: [...arr],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    explanation: 'Quick Sort Complete!',
    activeLine: 20,
    variables: {},
    comparisons,
    phase: 'found',
    sortedIndices: finalSorted,
  })

  return frames
}
