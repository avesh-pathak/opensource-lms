import { VisualizerFrame, RecursionNode } from '@/lib/types/visualizer'

export function generateFactorialFrames(
  n: number
): VisualizerFrame<RecursionNode>[] {
  const frames: VisualizerFrame<RecursionNode>[] = []
  const nodes: RecursionNode[] = []
  let idCounter = 0

  function fact(n: number, parentId: string | null, depth: number): number {
    const id = (idCounter++).toString()
    const node: RecursionNode = {
      id,
      name: `fact(${n})`,
      params: { n },
      depth,
      parentId,
      status: 'active',
    }
    nodes.push(node)

    frames.push({
      array: [...nodes],
      highlights: [nodes.length - 1],
      secondaryHighlights: [],
      visited: [],
      pointers: {},
      explanation: `Calling fact(${n})...`,
      activeLine: 1,
      variables: { n, depth },
      comparisons: 0,
      phase: 'search',
    })

    if (n <= 1) {
      node.status = 'completed'
      node.returnValue = 1
      frames.push({
        array: [...nodes],
        highlights: [nodes.findIndex((nn) => nn.id === id)],
        secondaryHighlights: [],
        visited: [],
        pointers: {},
        explanation: `Base case reached: fact(${n}) = 1`,
        activeLine: 2,
        variables: { n, result: 1 },
        comparisons: 0,
        phase: 'found',
      })
      return 1
    }

    const res = fact(n - 1, id, depth + 1)
    const result = n * res

    node.status = 'completed'
    node.returnValue = result
    frames.push({
      array: [...nodes],
      highlights: [nodes.findIndex((nn) => nn.id === id)],
      secondaryHighlights: [],
      visited: [],
      pointers: {},
      explanation: `Returning from fact(${n}): ${n} * ${res} = ${result}`,
      activeLine: 4,
      variables: { n, multiplier: n, subResult: res, result },
      comparisons: 0,
      phase: 'found',
    })

    return result
  }

  fact(n, null, 0)
  return frames
}
