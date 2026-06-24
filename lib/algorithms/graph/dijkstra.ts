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

export function generateDijkstraFrames(
  nodes: GraphNode[],
  edges: GraphEdge[],
  startId: string
): VisualizerFrame[] {
  const frames: VisualizerFrame[] = []

  // Build adjacency list with weights
  const adj: Record<string, Array<{ node: string; weight: number }>> = {}
  nodes.forEach((n) => (adj[n.id] = []))

  edges.forEach((e) => {
    const weight = e.weight ?? 1
    adj[e.from].push({ node: e.to, weight })
    // For undirected graph, also add reverse edge
    adj[e.to].push({ node: e.from, weight })
  })

  const distances: Record<string, number> = {}
  const previous: Record<string, string | null> = {}
  const unvisited = new Set<string>()

  // Initialize
  nodes.forEach((node) => {
    distances[node.id] = node.id === startId ? 0 : Infinity
    previous[node.id] = null
    unvisited.add(node.id)
  })

  const startIdx = nodes.findIndex((n) => n.id === startId)
  frames.push({
    array: [],
    highlights: startIdx >= 0 ? [startIdx] : [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    explanation: `Start Dijkstra from node ${startId}.`,
    activeLine: 1,
    variables: {
      unvisited: [...unvisited],
      distances: { ...distances },
      previous: { ...previous },
      current: null,
    },
    comparisons: 0,
    phase: 'search',
  })

  while (unvisited.size > 0) {
    // Find the unvisited node with the smallest distance
    let currentNodeId: string | null = null
    let minDistance = Infinity

    for (const nodeId of unvisited) {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId]
        currentNodeId = nodeId
      }
    }

    if (currentNodeId === null) break

    unvisited.delete(currentNodeId!)

    const currentIdx = nodes.findIndex((n) => n.id === currentNodeId)

    frames.push({
      array: [],
      highlights: [currentIdx],
      secondaryHighlights: [],
      visited: nodes
        .filter((n) => !unvisited.has(n.id))
        .map((n) => nodes.findIndex((nn) => nn.id === n.id)),
      pointers: { current: currentIdx },
      explanation: `Visit node ${currentNodeId} (distance: ${distances[currentNodeId]}).`,
      activeLine: 2,
      variables: {
        unvisited: [...unvisited],
        distances: { ...distances },
        previous: { ...previous },
        current: currentNodeId,
      },
      comparisons: frames.length,
      phase: 'compare',
    })

    // Update distances to neighbors
    for (const neighbor of adj[currentNodeId!]) {
      if (!unvisited.has(neighbor.node)) continue

      const alt = distances[currentNodeId!] + neighbor.weight
      if (alt < distances[neighbor.node]) {
        distances[neighbor.node] = alt
        previous[neighbor.node] = currentNodeId!

        const neighborIdx = nodes.findIndex((n) => n.id === neighbor.node)
        frames.push({
          array: [],
          highlights: [currentIdx],
          secondaryHighlights: [neighborIdx],
          visited: nodes
            .filter((n) => !unvisited.has(n.id))
            .map((n) => nodes.findIndex((nn) => nn.id === n.id)),
          pointers: { current: currentIdx, neighbor: neighborIdx },
          explanation: `Update distance to ${neighbor.node} to ${alt} (via ${currentNodeId}).`,
          activeLine: 4,
          variables: {
            unvisited: [...unvisited],
            distances: { ...distances },
            previous: { ...previous },
            current: currentNodeId,
          },
          comparisons: frames.length,
          phase: 'compare',
        })
      }
    }
  }

  // Build shortest paths
  const paths: Record<string, string[]> = {}
  nodes.forEach((node) => {
    const path: string[] = []
    let current: string | null = node.id
    while (current !== null) {
      path.unshift(current)
      current = previous[current]
    }
    paths[node.id] = path
  })

  frames.push({
    array: [],
    highlights: [],
    secondaryHighlights: [],
    visited: nodes.map((n, i) => i),
    pointers: {},
    explanation: `Dijkstra complete. Shortest paths from ${startId}: ${Object.entries(
      paths
    )
      .map(
        ([node, path]) =>
          `${node}: ${path.join(' → ')} (dist: ${distances[node]})`
      )
      .join('; ')}.`,
    activeLine: 5,
    variables: {
      distances: { ...distances },
      previous: { ...previous },
      paths,
    },
    comparisons: frames.length,
    phase: 'found',
  })

  return frames
}
