import { VisualizerFrame } from '@/lib/types/visualizer'
import { TreeNode } from '@/lib/store/tree-visualizer-store'

export function generateBFSFrames(
  nodes: TreeNode[]
): VisualizerFrame<TreeNode>[] {
  const frames: VisualizerFrame<TreeNode>[] = []
  const root = nodes.find((n) => n.parentId === null)
  if (!root) return []

  const queue: string[] = [root.id]
  const visited: string[] = []

  frames.push({
    array: [...nodes],
    highlights: [nodes.findIndex((n) => n.id === root.id)],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    explanation: 'Starting Level-order Traversal (BFS) using a Queue.',
    activeLine: 1,
    variables: { queue: [root.value], visited: [] },
    comparisons: 0,
    phase: 'search',
  })

  while (queue.length > 0) {
    const nodeId = queue.shift()!
    const node = nodes.find((n) => n.id === nodeId)!
    const nodeIdx = nodes.findIndex((n) => n.id === nodeId)

    visited.push(nodeId)

    frames.push({
      array: [...nodes],
      highlights: [nodeIdx],
      secondaryHighlights: [],
      visited: visited.map((id) => nodes.findIndex((n) => n.id === id)),
      pointers: { curr: nodeIdx },
      explanation: `De-queueing node ${node.value} and marking as visited.`,
      activeLine: 4,
      variables: {
        queue: queue.map((id) => nodes.find((n) => n.id === id)?.value),
        visited: visited.map((id) => nodes.find((n) => n.id === id)?.value),
      },
      comparisons: visited.length,
      phase: 'found',
    })

    const children = [node.leftId, node.rightId].filter(
      (id) => id !== null
    ) as string[]
    for (const childId of children) {
      queue.push(childId)
      const childNode = nodes.find((n) => n.id === childId)!
      const childIdx = nodes.findIndex((n) => n.id === childId)

      frames.push({
        array: [...nodes],
        highlights: [nodeIdx],
        secondaryHighlights: [childIdx],
        visited: visited.map((id) => nodes.findIndex((n) => n.id === id)),
        pointers: { curr: nodeIdx, child: childIdx },
        explanation: `Adding child node ${childNode.value} to the queue.`,
        activeLine: 6,
        variables: {
          queue: queue.map((id) => nodes.find((n) => n.id === id)?.value),
          visited: visited.map((id) => nodes.find((n) => n.id === id)?.value),
          activeEdge: [node.id, childNode.id],
        },
        comparisons: visited.length,
        phase: 'compare',
      })
    }
  }

  frames.push({
    array: [...nodes],
    highlights: [],
    secondaryHighlights: [],
    visited: visited.map((id) => nodes.findIndex((n) => n.id === id)),
    pointers: {},
    explanation: 'Level-order traversal completed.',
    activeLine: 9,
    variables: {
      finalOrder: visited.map((id) => nodes.find((n) => n.id === id)?.value),
    },
    comparisons: visited.length,
    phase: 'search',
  })

  return frames
}
