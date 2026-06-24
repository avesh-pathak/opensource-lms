import { VisualizerFrame } from '@/lib/types/visualizer'

export const generateCircularQueueFrames = (
  size: number,
  operations: { op: 'enqueue' | 'dequeue'; val?: number | string }[]
): VisualizerFrame[] => {
  const frames: VisualizerFrame[] = []
  const queue: (number | string | null)[] = new Array(size).fill(null)
  let head = -1
  let tail = -1

  // Initial Frame
  frames.push({
    array: [...queue],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: { head, tail },
    explanation: `Initializing Circular Queue of size ${size}. Head and Tail are -1.`,
    activeLine: 1,
    variables: { queue: [...queue], head, tail, size },
    comparisons: 0,
    phase: 'search',
    trace: '[Init] head=-1, tail=-1',
  })

  for (let i = 0; i < operations.length; i++) {
    const { op, val } = operations[i]

    if (op === 'enqueue') {
      const isFull = (tail + 1) % size === head

      // 1. Check Full Frame
      frames.push({
        array: [...queue],
        highlights: [],
        secondaryHighlights: [],
        visited: [],
        pointers: { head, tail },
        explanation: `Checking if queue is full before enqueuing ${val}.`,
        activeLine: 5,
        variables: { queue: [...queue], head, tail, full: isFull },
        comparisons: 1,
        phase: 'compare',
        trace: `[CheckFull] (tail+1)%size == head?`,
      })

      if (isFull) {
        frames.push({
          array: [...queue],
          highlights: [],
          secondaryHighlights: [],
          visited: [],
          pointers: { head, tail },
          explanation: `Queue is full! Cannot enqueue ${val}.`,
          activeLine: 6,
          variables: { queue: [...queue], head, tail, error: true },
          comparisons: 0,
          phase: 'not-found',
          trace: '[Error] Queue Full.',
        })
        continue
      }

      if (head === -1) head = 0
      tail = (tail + 1) % size
      queue[tail] = val!

      // 2. Enqueue Success Frame
      frames.push({
        array: [...queue],
        highlights: [tail],
        secondaryHighlights: [],
        visited: [],
        pointers: { head, tail },
        explanation: `Enqueued ${val} at index ${tail}. Tail moved to ${tail}.`,
        activeLine: 8,
        variables: { queue: [...queue], head, tail },
        comparisons: 0,
        phase: 'found',
        trace: `[Enqueue] queue[${tail}] = ${val}`,
      })
    } else if (op === 'dequeue') {
      const isEmpty = head === -1

      // 1. Check Empty Frame
      frames.push({
        array: [...queue],
        highlights: [],
        secondaryHighlights: [],
        visited: [],
        pointers: { head, tail },
        explanation: 'Checking if queue is empty before dequeuing.',
        activeLine: 12,
        variables: { queue: [...queue], head, tail, empty: isEmpty },
        comparisons: 1,
        phase: 'compare',
        trace: '[CheckEmpty] head == -1?',
      })

      if (isEmpty) {
        frames.push({
          array: [...queue],
          highlights: [],
          secondaryHighlights: [],
          visited: [],
          pointers: { head, tail },
          explanation: 'Queue is empty! Nothing to dequeue.',
          activeLine: 13,
          variables: { queue: [...queue], head, tail, error: true },
          comparisons: 0,
          phase: 'not-found',
          trace: '[Error] Queue Empty.',
        })
        continue
      }

      const valPopped = queue[head]
      queue[head] = null

      // 2. Dequeue Success Frame
      frames.push({
        array: [...queue],
        highlights: [head],
        secondaryHighlights: [],
        visited: [],
        pointers: { head, tail },
        explanation: `Dequeued ${valPopped} from index ${head}.`,
        activeLine: 15,
        variables: { queue: [...queue], head, tail, valPopped },
        comparisons: 0,
        phase: 'found',
        trace: `[Dequeue] Removed ${valPopped}`,
      })

      if (head === tail) {
        head = -1
        tail = -1
      } else {
        head = (head + 1) % size
      }

      // 3. Move Head Frame
      frames.push({
        array: [...queue],
        highlights: [],
        secondaryHighlights: [],
        visited: [],
        pointers: { head, tail },
        explanation:
          head === -1
            ? 'Queue is now empty. Resetting pointers.'
            : `Head moved to ${head}.`,
        activeLine: 16,
        variables: { queue: [...queue], head, tail },
        comparisons: 0,
        phase: 'search',
        trace: '[MoveHead] Done.',
      })
    }
  }

  return frames
}
