import { VisualizerFrame } from '@/lib/types/visualizer'

interface HanoiState {
  A: number[]
  B: number[]
  C: number[]
}

export function generateTowerOfHanoiFrames(
  n: number
): VisualizerFrame<HanoiState>[] {
  const frames: VisualizerFrame<HanoiState>[] = []
  const state: HanoiState = {
    A: Array.from({ length: n }, (_, i) => n - i),
    B: [],
    C: [],
  }

  frames.push({
    array: [{ ...state }] as any,
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    explanation: `Starting Tower of Hanoi with ${n} disks on Peg A.`,
    activeLine: 1,
    variables: { n, A: [...state.A], B: [...state.B], C: [...state.C] },
    comparisons: 0,
    phase: 'search',
  })

  function move(
    n: number,
    from: keyof HanoiState,
    to: keyof HanoiState,
    aux: keyof HanoiState
  ) {
    if (n === 0) return

    move(n - 1, from, aux, to)

    const disk = state[from].pop()!
    state[to].push(disk)

    frames.push({
      array: [{ ...state }] as any,
      highlights: [],
      secondaryHighlights: [],
      visited: [],
      pointers: { from: from as any, to: to as any },
      explanation: `Move disk ${disk} from ${from} to ${to}.`,
      activeLine: 4,
      variables: {
        n,
        moving: disk,
        A: [...state.A],
        B: [...state.B],
        C: [...state.C],
      },
      comparisons: 0,
      phase: 'found',
    })

    move(n - 1, aux, to, from)
  }

  move(n, 'A', 'C', 'B')

  frames.push({
    array: [{ ...state }] as any,
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    explanation: 'All disks moved to Peg C successfully!',
    activeLine: 6,
    variables: { A: [...state.A], B: [...state.B], C: [...state.C] },
    comparisons: 0,
    phase: 'search',
  })

  return frames
}
