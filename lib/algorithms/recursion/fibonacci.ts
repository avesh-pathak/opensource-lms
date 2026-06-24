import { VisualizerFrame, RecursionNode } from '@/lib/types/visualizer'

export function generateFibonacciFrames(
  n: number
): VisualizerFrame<RecursionNode>[] {
  const frames: VisualizerFrame<RecursionNode>[] = []
  const nodes: RecursionNode[] = []
  let idCounter = 0

  function fib(n: number, parentId: string | null, depth: number): number {
    const id = (idCounter++).toString()
    const node: RecursionNode = {
      id,
      name: `fib(${n})`,
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
      explanation: `Calling fib(${n})...`,
      activeLine: 1,
      variables: { n, depth },
      comparisons: 0,
      phase: 'search',
    })

    if (n <= 1) {
      node.status = 'completed'
      node.returnValue = n
      frames.push({
        array: [...nodes],
        highlights: [nodes.findIndex((nn) => nn.id === id)],
        secondaryHighlights: [],
        visited: [],
        pointers: {},
        explanation: `Base case reached: fib(${n}) = ${n}`,
        activeLine: 2,
        variables: { n, result: n },
        comparisons: 0,
        phase: 'found',
      })
      return n
    }

    const res1 = fib(n - 1, id, depth + 1)
    const res2 = fib(n - 2, id, depth + 1)
    const result = res1 + res2

    node.status = 'completed'
    node.returnValue = result
    frames.push({
      array: [...nodes],
      highlights: [nodes.findIndex((nn) => nn.id === id)],
      secondaryHighlights: [],
      visited: [],
      pointers: {},
      explanation: `Returning from fib(${n}): ${res1} + ${res2} = ${result}`,
      activeLine: 4,
      variables: { n, res1, res2, result },
      comparisons: 0,
      phase: 'found',
    })

    return result
  }

  fib(n, null, 0)

  return frames
}
