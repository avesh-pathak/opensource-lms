import { VisualizerFrame } from '@/lib/types/visualizer'
import { LinkedListNode } from '@/lib/store/linked-list-visualizer-store'

export function generateMergeSortedListsFrames(
  nodes: LinkedListNode[]
): VisualizerFrame<LinkedListNode>[] {
  const frames: VisualizerFrame<LinkedListNode>[] = []

  // Split input into two sorted lists for simulation
  const mid = Math.floor(nodes.length / 2)
  let list1: LinkedListNode[] = nodes
    .slice(0, mid)
    .sort((a, b) => a.value - b.value)
  let list2: LinkedListNode[] = nodes
    .slice(mid)
    .sort((a, b) => a.value - b.value)

  // Re-link them
  list1 = list1.map((n, i) => ({
    ...n,
    id: `l1-${i}`,
    nextId: i < list1.length - 1 ? `l1-${i + 1}` : null,
  }))
  list2 = list2.map((n, i) => ({
    ...n,
    id: `l2-${i}`,
    nextId: i < list2.length - 1 ? `l2-${i + 1}` : null,
  }))

  const initialNodes = [...list1, ...list2]

  frames.push({
    array: [...initialNodes],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: { p1: 0, p2: list1.length },
    explanation: 'Merging two sorted linked lists starting from the heads.',
    activeLine: 1,
    variables: { l1: list1[0].id, l2: list2[0].id },
    comparisons: 0,
    phase: 'search',
  })

  let p1: string | null = list1[0].id
  let p2: string | null = list2[0].id
  const dummyId = 'dummy'
  let currTail: string | null = dummyId

  let currentNodes: LinkedListNode[] = [
    { id: dummyId, value: -1, nextId: null },
    ...initialNodes,
  ]

  let step = 0
  while (p1 && p2) {
    const p1Node = currentNodes.find((n) => n.id === p1)!
    const p2Node = currentNodes.find((n) => n.id === p2)!
    const p1Idx = currentNodes.findIndex((n) => n.id === p1)
    const p2Idx = currentNodes.findIndex((n) => n.id === p2)

    frames.push({
      array: [...currentNodes],
      highlights: [p1Idx],
      secondaryHighlights: [p2Idx],
      visited: [],
      pointers: { p1: p1Idx, p2: p2Idx },
      explanation: `Comparing ${p1Node.value} and ${p2Node.value}.`,
      activeLine: 4,
      variables: { val1: p1Node.value, val2: p2Node.value },
      comparisons: ++step,
      phase: 'compare',
    })

    if (p1Node.value <= p2Node.value) {
      currentNodes = currentNodes.map((n) =>
        n.id === currTail ? { ...n, nextId: p1 } : n
      )
      currTail = p1
      p1 = p1Node.nextId
      frames.push({
        array: [...currentNodes],
        highlights: [p1Idx],
        secondaryHighlights: [],
        visited: [],
        pointers: {
          tail: currentNodes.findIndex((n) => n.id === currTail),
          next_p1: currentNodes.findIndex((n) => n.id === p1),
        },
        explanation: `${p1Node.value} is smaller. Appending to merged list.`,
        activeLine: 5,
        variables: { appended: p1Node.value },
        comparisons: step,
        phase: 'found',
      })
    } else {
      currentNodes = currentNodes.map((n) =>
        n.id === currTail ? { ...n, nextId: p2 } : n
      )
      currTail = p2
      p2 = p2Node.nextId
      frames.push({
        array: [...currentNodes],
        highlights: [p2Idx],
        secondaryHighlights: [],
        visited: [],
        pointers: {
          tail: currentNodes.findIndex((n) => n.id === currTail),
          next_p2: currentNodes.findIndex((n) => n.id === p2),
        },
        explanation: `${p2Node.value} is smaller. Appending to merged list.`,
        activeLine: 7,
        variables: { appended: p2Node.value },
        comparisons: step,
        phase: 'found',
      })
    }
  }

  // Attach remainder
  const remaining = p1 || p2
  if (remaining) {
    currentNodes = currentNodes.map((n) =>
      n.id === currTail ? { ...n, nextId: remaining } : n
    )
    frames.push({
      array: [...currentNodes],
      highlights: [],
      secondaryHighlights: [],
      visited: [],
      pointers: { tail: currentNodes.findIndex((n) => n.id === currTail) },
      explanation: 'Appending the remaining nodes to the merged list.',
      activeLine: 9,
      variables: { remaining: remaining },
      comparisons: step,
      phase: 'found',
    })
  }

  return frames
}
