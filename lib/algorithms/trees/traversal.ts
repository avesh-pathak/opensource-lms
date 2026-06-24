import { VisualizerFrame } from '@/lib/types/visualizer'
import { TreeNode } from '@/lib/store/tree-visualizer-store'

type TraversalType = 'inorder' | 'preorder' | 'postorder'

export function generateTraversalFrames(
  nodes: TreeNode[],
  type: TraversalType
): VisualizerFrame<TreeNode>[] {
  const frames: VisualizerFrame<TreeNode>[] = []
  const root = nodes.find((n) => n.parentId === null)
  if (!root) return []

  const visited: string[] = []
  const recursionStack: string[] = []

  function traverse(nodeId: string | null) {
    if (!nodeId) return
    const node = nodes.find((n) => n.id === nodeId)!
    const nodeIdx = nodes.findIndex((n) => n.id === nodeId)

    // Add current node to recursion stack before processing
    recursionStack.push(nodeId)

    // Pre-order Visit
    if (type === 'preorder') {
      visited.push(nodeId)
      const leftEdge = node.leftId ? [node.id, node.leftId] : undefined
      frames.push({
        array: [...nodes],
        highlights: [nodeIdx],
        secondaryHighlights: [],
        visited: visited.map((id) => nodes.findIndex((n) => n.id === id)),
        pointers: { curr: nodeIdx },
        explanation: `Visiting node ${node.value} (Pre-order)`,
        activeLine: 3,
        variables: {
          stack: [...recursionStack],
          visited: [...visited],
          activeEdge: leftEdge,
        },
        comparisons: visited.length,
        phase: 'found',
      })
    } else {
      frames.push({
        array: [...nodes],
        highlights: [nodeIdx],
        secondaryHighlights: [],
        visited: visited.map((id) => nodes.findIndex((n) => n.id === id)),
        pointers: { curr: nodeIdx },
        explanation: `Exploring node ${node.value}`,
        activeLine: 1,
        variables: {
          stack: [...recursionStack],
        },
        comparisons: visited.length,
        phase: 'search',
      })
    }

    // Left Subtree
    traverse(node.leftId)

    // In-order Visit
    if (type === 'inorder') {
      visited.push(nodeId)
      const rightEdge = node.rightId ? [node.id, node.rightId] : undefined
      frames.push({
        array: [...nodes],
        highlights: [nodeIdx],
        secondaryHighlights: [],
        visited: visited.map((id) => nodes.findIndex((n) => n.id === id)),
        pointers: { curr: nodeIdx },
        explanation: `Visiting node ${node.value} (In-order)`,
        activeLine: 5,
        variables: { stack: [...recursionStack], visited: [...visited] },
        comparisons: visited.length,
        phase: 'found',
      })
    }

    // Right Subtree
    traverse(node.rightId)

    // Post-order Visit
    if (type === 'postorder') {
      visited.push(nodeId)
      frames.push({
        array: [...nodes],
        highlights: [nodeIdx],
        secondaryHighlights: [],
        visited: visited.map((id) => nodes.findIndex((n) => n.id === id)),
        pointers: { curr: nodeIdx },
        explanation: `Visiting node ${node.value} (Post-order)`,
        activeLine: 7,
        variables: { stack: [...recursionStack], visited: [...visited] },
        comparisons: visited.length,
        phase: 'found',
      })
    }

    // Remove current node from recursion stack after processing
    recursionStack.pop()
  }

  traverse(root.id)

  frames.push({
    array: [...nodes],
    highlights: [],
    secondaryHighlights: [],
    visited: visited.map((id) => nodes.findIndex((n) => n.id === id)),
    pointers: {},
    explanation: `${type.charAt(0).toUpperCase() + type.slice(1)} traversal completed.`,
    activeLine: 9,
    variables: {
      finalOrder: visited.map((id) => nodes.find((n) => n.id === id)?.value),
    },
    comparisons: visited.length,
    phase: 'search',
  })

  return frames
}
