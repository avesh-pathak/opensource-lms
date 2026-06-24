import { VisualizerFrame } from '@/lib/types/visualizer'
import { LinkedListNode } from '@/lib/store/linked-list-visualizer-store'

export function generateDetectCycleFrames(
  nodes: LinkedListNode[]
): VisualizerFrame<LinkedListNode>[] {
  const frames: VisualizerFrame<LinkedListNode>[] = []

  // 1. Check if cycle exists, if not, create one for demonstration
  const currentNodes = [...nodes]
  const visited = new Set<string>()
  let hasCycle = false
  let tempCurr: string | null = currentNodes[0]?.id

  while (tempCurr) {
    if (visited.has(tempCurr)) {
      hasCycle = true
      break
    }
    visited.add(tempCurr)
    const node = currentNodes.find((n) => n.id === tempCurr)
    tempCurr = node?.nextId || null
  }

  if (!hasCycle && currentNodes.length > 3) {
    // Link last node to a middle node only if no cycle exists
    const lastIdx = currentNodes.length - 1
    const targetIdx = Math.floor(currentNodes.length / 2)
    currentNodes[lastIdx] = {
      ...currentNodes[lastIdx],
      nextId: currentNodes[targetIdx].id,
    }
  }

  // Initial Frame
  frames.push({
    array: [...currentNodes],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: { slow: 0, fast: 0 },
    explanation:
      "Starting Floyd's Cycle-Finding Algorithm (Tortoise and Hare).",
    activeLine: 1,
    variables: { slow: currentNodes[0]?.id, fast: currentNodes[0]?.id },
    comparisons: 0,
    phase: 'search',
  })

  let slowIdx = 0
  let fastIdx = 0
  let found = false

  // Loop for max nodes to prevent infinite if something breaks
  for (let step = 0; step < 20; step++) {
    // Move Slow by 1
    const slowNode = currentNodes[slowIdx]
    if (!slowNode || !slowNode.nextId) break
    slowIdx = currentNodes.findIndex((n) => n.id === slowNode.nextId)

    // Move Fast by 2
    const fastNode = currentNodes[fastIdx]
    if (!fastNode || !fastNode.nextId) break
    const middleIdx = currentNodes.findIndex((n) => n.id === fastNode.nextId)
    const middleNode = currentNodes[middleIdx]
    if (!middleNode || !middleNode.nextId) {
      fastIdx = middleIdx
      break
    }
    fastIdx = currentNodes.findIndex((n) => n.id === middleNode.nextId)

    frames.push({
      array: [...currentNodes],
      highlights: [slowIdx],
      secondaryHighlights: [fastIdx],
      visited: [],
      pointers: { slow: slowIdx, fast: fastIdx },
      explanation: `Slow moves to node ${currentNodes[slowIdx].value}, Fast moves to node ${currentNodes[fastIdx].value}.`,
      activeLine: 4,
      variables: {
        slow: currentNodes[slowIdx].id,
        fast: currentNodes[fastIdx].id,
      },
      comparisons: step + 1,
      phase: 'compare',
    })

    if (slowIdx === fastIdx) {
      found = true
      frames.push({
        array: [...currentNodes],
        highlights: [slowIdx],
        secondaryHighlights: [],
        visited: [],
        pointers: { slow: slowIdx, fast: fastIdx },
        explanation:
          'Cycle detected! Slow and Fast pointers met at node ' +
          currentNodes[slowIdx].value,
        activeLine: 5,
        variables: { meetingPoint: currentNodes[slowIdx].id },
        comparisons: step + 1,
        phase: 'found',
      })
      break
    }
  }

  if (!found) {
    frames.push({
      array: [...currentNodes],
      highlights: [],
      secondaryHighlights: [],
      visited: [],
      pointers: {},
      explanation: 'Fast pointer reached the end. No cycle detected.',
      activeLine: 7,
      variables: { cycleFound: false },
      comparisons: 0,
      phase: 'not-found',
    })
  }

  return frames
}
