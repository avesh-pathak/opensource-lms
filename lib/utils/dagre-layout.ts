import dagre from 'dagre'

export const DEFAULT_NODE_WIDTH = 140
export const DEFAULT_NODE_HEIGHT = 72

export interface DagreLayoutInput {
  nodes: Array<{ id: string; width?: number; height?: number }>
  edges: Array<{ source: string; target: string }>
  direction?: 'TB' | 'BT' | 'LR' | 'RL'
  rankSep?: number
  nodeSep?: number
}

export interface Position {
  x: number
  y: number
}

/**
 * Compute positions for nodes using dagre. Returns a map of node id -> { x, y } (top-left for React Flow).
 */
export function getLayoutedPositions({
  nodes,
  edges,
  direction = 'TB',
  rankSep = 80,
  nodeSep = 60,
}: DagreLayoutInput): Map<string, Position> {
  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir: direction, ranksep: rankSep, nodesep: nodeSep })
  g.setDefaultEdgeLabel(() => ({}))

  nodes.forEach((node) => {
    const w = node.width ?? DEFAULT_NODE_WIDTH
    const h = node.height ?? DEFAULT_NODE_HEIGHT
    g.setNode(node.id, { width: w, height: h })
  })

  edges.forEach((e) => {
    g.setEdge(e.source, e.target)
  })

  dagre.layout(g)

  const positions = new Map<string, Position>()
  g.nodes().forEach((id) => {
    const n = g.node(id)
    if (n) {
      positions.set(id, {
        x: n.x - (n.width ?? DEFAULT_NODE_WIDTH) / 2,
        y: n.y - (n.height ?? DEFAULT_NODE_HEIGHT) / 2,
      })
    }
  })
  return positions
}
