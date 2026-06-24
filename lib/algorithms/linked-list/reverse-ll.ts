import { VisualizerFrame } from '@/lib/types/visualizer'
import { LinkedListNode } from '@/lib/store/linked-list-visualizer-store'

export function generateReverseLinkedListFrames(
  nodes: LinkedListNode[]
): VisualizerFrame<LinkedListNode>[] {
  const frames: VisualizerFrame<LinkedListNode>[] = []
  let currentNodes = [...nodes]

  // Initial Frame
  frames.push({
    array: [...currentNodes],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: { curr: 0 },
    explanation: 'Starting the iterative reversal of the linked list.',
    activeLine: 1,
    variables: { prev: 'null', curr: currentNodes[0]?.id },
    comparisons: 0,
    phase: 'search',
  })

  let prev: string | null = null
  let curr: string | null = currentNodes[0]?.id
  let next: string | null = null

  let _idx = 0
  let steps = 0
  const MAX_STEPS = 1000 // Protection against infinite loops

  while (curr) {
    if (steps++ > MAX_STEPS) {
      console.warn('Cycle detected or max steps reached. Stopping generation.')
      frames.push({
        array: [...currentNodes],
        highlights: [],
        secondaryHighlights: [],
        visited: [],
        pointers: {},
        explanation: '⚠️ MAX STEPS REACHED: Possible cycle detected. Stopping.',
        activeLine: 0,
        variables: {},
        comparisons: 0,
        phase: 'found',
      })
      break
    }

    const currNodeIndex = currentNodes.findIndex((n) => n.id === curr)
    if (currNodeIndex === -1) break

    // Step 1: Save next
    next = currentNodes[currNodeIndex].nextId
    frames.push({
      array: [...currentNodes],
      highlights: [currNodeIndex],
      secondaryHighlights: [],
      visited: [],
      pointers: {
        prev: prev ? -2 : -1,
        curr: currNodeIndex,
        next: next ? -2 : -1,
      }, // Simplified pointers for visualization
      explanation: `Saving the next node: ${next || 'null'}`,
      activeLine: 4,
      variables: { prev: prev || 'null', curr, next: next || 'null' },
      comparisons: 0,
      phase: 'compare',
    })

    // Step 2: Reverse pointer
    currentNodes = currentNodes.map((n) =>
      n.id === curr ? { ...n, nextId: prev } : n
    )
    frames.push({
      array: [...currentNodes],
      highlights: [currNodeIndex],
      secondaryHighlights: [],
      visited: [],
      pointers: { prev: -1, curr: currNodeIndex, next: -1 },
      explanation: `Reversing the current node's pointer to point to ${prev || 'null'}.`,
      activeLine: 5,
      variables: { prev: prev || 'null', curr, next: next || 'null' },
      comparisons: 0,
      phase: 'found',
    })

    // Step 3: Move prev
    prev = curr
    frames.push({
      array: [...currentNodes],
      highlights: [currNodeIndex],
      secondaryHighlights: [],
      visited: [],
      pointers: { prev: currNodeIndex, curr: currNodeIndex },
      explanation: `Moving 'prev' to 'curr' (${curr})`,
      activeLine: 6,
      variables: { prev: prev || 'null', curr, next: next || 'null' },
      comparisons: 0,
      phase: 'search',
    })

    // Step 4: Move curr
    curr = next
    const nextIdx = currentNodes.findIndex((n) => n.id === curr)
    frames.push({
      array: [...currentNodes],
      highlights: [],
      secondaryHighlights: nextIdx !== -1 ? [nextIdx] : [],
      visited: [],
      pointers: { prev: currNodeIndex, curr: nextIdx },
      explanation: `Moving 'curr' to 'next' (${curr || 'null'})`,
      activeLine: 7,
      variables: {
        prev: prev || 'null',
        curr: curr || 'null',
        next: next || 'null',
      },
      comparisons: 0,
      phase: 'search',
    })

    _idx++
  }

  frames.push({
    array: [...currentNodes],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    explanation: 'LinkedList successfully reversed.',
    activeLine: 9,
    variables: { head: prev || 'null' },
    comparisons: 0,
    phase: 'found',
  })

  return frames
}
