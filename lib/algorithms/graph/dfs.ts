import type { VisualizerFrame } from '@/lib/types/visualizer'

export interface GraphNode {
  id: string
  label: string
  x: number
  y: number
}

export interface GraphEdge {
  from: string
  to: string
  weight?: number
}

export function generateDFSFrames(
  nodes: GraphNode[],
  edges: GraphEdge[],
  startId: string
): VisualizerFrame[] {
  const frames: VisualizerFrame[] = []
  const adj: Record<string, string[]> = {}
  nodes.forEach((n) => (adj[n.id] = []))
  edges.forEach((e) => {
    if (!adj[e.from].includes(e.to)) adj[e.from].push(e.to)
  })

  const visited = new Set<string>()
  const stack: string[] = [startId]
  const order: string[] = []

  const startIdx = nodes.findIndex((n) => n.id === startId)
  frames.push({
    array: [],
    highlights: startIdx >= 0 ? [startIdx] : [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    explanation: `Start DFS from node ${startId}.`,
    activeLine: 1,
    variables: { stack: [...stack], visited: [], order: [] },
    comparisons: 0,
    phase: 'search',
  })

  while (stack.length > 0) {
    const nodeId = stack.pop()!
    if (visited.has(nodeId)) continue
    visited.add(nodeId)
    order.push(nodeId)

    const nodeIdx = nodes.findIndex((n) => n.id === nodeId)
    const visitedIndices = order
      .map((id) => nodes.findIndex((n) => n.id === id))
      .filter((i) => i >= 0)

    frames.push({
      array: [],
      highlights: [nodeIdx],
      secondaryHighlights: [],
      visited: visitedIndices,
      pointers: {},
      explanation: `Visit ${nodeId}. Stack: [${stack.join(', ')}]. Order: [${order.join(', ')}].`,
      activeLine: 2,
      variables: {
        stack: [...stack],
        visited: [...visited],
        order: [...order],
      },
      comparisons: frames.length,
      phase: 'compare',
    })

    // Push neighbors in reverse order to maintain correct DFS order
    for (const neighbor of [...(adj[nodeId] ?? [])].reverse()) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor)
      }
    }
  }

  const allVisited = order
    .map((id) => nodes.findIndex((n) => n.id === id))
    .filter((i) => i >= 0)
  frames.push({
    array: [],
    highlights: [],
    secondaryHighlights: [],
    visited: allVisited,
    pointers: {},
    explanation: `DFS complete. Order: [${order.join(', ')}].`,
    activeLine: 3,
    variables: { order: [...order] },
    comparisons: frames.length,
    phase: 'found',
  })

  return frames
}
