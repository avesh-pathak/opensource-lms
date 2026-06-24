import { VisualizerFrame } from '@/lib/types/visualizer'
import { LinkedListNode } from '@/lib/store/linked-list-visualizer-store'

export function generateMiddleNodeFrames(
  nodes: LinkedListNode[]
): VisualizerFrame<LinkedListNode>[] {
  const frames: VisualizerFrame<LinkedListNode>[] = []
  const currentNodes = [...nodes]

  // Initial Frame
  frames.push({
    array: [...currentNodes],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: { slow: 0, fast: 0 },
    explanation: 'Finding the middle node using Slow and Fast pointers.',
    activeLine: 1,
    variables: { slow: currentNodes[0]?.id, fast: currentNodes[0]?.id },
    comparisons: 0,
    phase: 'search',
  })

  let slowIdx = 0
  let fastIdx = 0

  while (true) {
    const fastNode = currentNodes[fastIdx]
    if (!fastNode || !fastNode.nextId) break

    const nextFastIdx = currentNodes.findIndex((n) => n.id === fastNode.nextId)
    const nextFastNode = currentNodes[nextFastIdx]
    if (!nextFastNode || !nextFastNode.nextId) {
      // Can move fast once more if we want to follow standard "fast = fast.next.next"
      // but let's just move slow by 1 and fast by 2 if possible
      break
    }

    // Move Slow by 1
    slowIdx = currentNodes.findIndex(
      (n) => n.id === currentNodes[slowIdx].nextId
    )
    // Move Fast by 2
    fastIdx = currentNodes.findIndex((n) => n.id === nextFastNode.nextId)

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
      comparisons: slowIdx,
      phase: 'search',
    })
  }

  frames.push({
    array: [...currentNodes],
    highlights: [slowIdx],
    secondaryHighlights: [],
    visited: [],
    pointers: { middle: slowIdx },
    explanation: `Middle node found: ${currentNodes[slowIdx].value}`,
    activeLine: 6,
    variables: { middle: currentNodes[slowIdx].id },
    comparisons: slowIdx,
    phase: 'found',
  })

  return frames
}
