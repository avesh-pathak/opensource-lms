import { VisualizerFrame } from '@/lib/types/visualizer'
import { TreeNode } from '@/lib/store/tree-visualizer-store'

export function generateLCAFrames(
  nodes: TreeNode[],
  pId: string,
  qId: string
): VisualizerFrame<TreeNode>[] {
  const frames: VisualizerFrame<TreeNode>[] = []
  const root = nodes.find((n) => n.parentId === null)
  if (!root) return []

  const pValue = nodes.find((n) => n.id === pId)?.value
  const qValue = nodes.find((n) => n.id === qId)?.value

  function findLCA(nodeId: string | null): string | null {
    if (!nodeId) return null
    if (nodeId === pId || nodeId === qId) {
      const nodeIdx = nodes.findIndex((n) => n.id === nodeId)
      frames.push({
        array: [...nodes],
        highlights: [nodeIdx],
        secondaryHighlights: [],
        visited: [],
        pointers: { curr: nodeIdx },
        explanation: `Found target node ${nodes[nodeIdx].value}! Returning it up the stack.`,
        activeLine: 3,
        variables: { p: pValue, q: qValue, found: nodes[nodeIdx].value },
        comparisons: 0,
        phase: 'found',
      })
      return nodeId
    }

    const nodeIdx = nodes.findIndex((n) => n.id === nodeId)
    frames.push({
      array: [...nodes],
      highlights: [nodeIdx],
      secondaryHighlights: [],
      visited: [],
      pointers: { curr: nodeIdx },
      explanation: `Searching for ${pValue} and ${qValue} at node ${nodes[nodeIdx].value}...`,
      activeLine: 4,
      variables: { p: pValue, q: qValue },
      comparisons: 0,
      phase: 'search',
    })

    const leftLCA = findLCA(nodes[nodeIdx].leftId)
    const rightLCA = findLCA(nodes[nodeIdx].rightId)

    if (leftLCA && rightLCA) {
      frames.push({
        array: [...nodes],
        highlights: [nodeIdx],
        secondaryHighlights: [],
        visited: [],
        pointers: { lca: nodeIdx },
        explanation: `Both left and right subtrees returned nodes. This node ${nodes[nodeIdx].value} is the LCA!`,
        activeLine: 7,
        variables: {
          left: leftLCA,
          right: rightLCA,
          lca: nodes[nodeIdx].value,
        },
        comparisons: 0,
        phase: 'found',
      })
      return nodeId
    }

    const result = leftLCA || rightLCA
    if (result) {
      frames.push({
        array: [...nodes],
        highlights: [nodeIdx],
        secondaryHighlights: [],
        visited: [],
        pointers: { curr: nodeIdx },
        explanation: `Propagating result ${nodes.find((n) => n.id === result)?.value} upwards.`,
        activeLine: 9,
        variables: { result: nodes.find((n) => n.id === result)?.value },
        comparisons: 0,
        phase: 'search',
      })
    }

    return result
  }

  const finalLCA = findLCA(root.id)
  const lcaIdx = nodes.findIndex((n) => n.id === finalLCA)

  frames.push({
    array: [...nodes],
    highlights: [lcaIdx],
    secondaryHighlights: [],
    visited: [],
    pointers: { final_lca: lcaIdx },
    explanation: `Lowest Common Ancestor found: ${nodes[lcaIdx].value}`,
    activeLine: 11,
    variables: { lca: nodes[lcaIdx].value },
    comparisons: 0,
    phase: 'found',
  })

  return frames
}
