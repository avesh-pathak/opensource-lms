import type { Node, Edge } from '@xyflow/react'

export interface FrameLikeWithElements {
  nodes?: Node[]
  edges?: Edge[]
}

/**
 * Extracts React Flow nodes and edges from a frame that may contain them.
 * Use when your algorithm attaches nodes/edges to the frame (e.g. tree, graph, trie).
 */
export function frameToReactFlowElements(
  frame: FrameLikeWithElements | null | undefined
): { nodes: Node[]; edges: Edge[] } {
  if (!frame) {
    return { nodes: [], edges: [] }
  }
  return {
    nodes: Array.isArray(frame.nodes) ? frame.nodes : [],
    edges: Array.isArray(frame.edges) ? frame.edges : [],
  }
}
