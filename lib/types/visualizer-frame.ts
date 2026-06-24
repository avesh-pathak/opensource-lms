import type { Node, Edge } from '@xyflow/react'

/**
 * Extended frame model for React Flow–based and grid-based visualizers.
 * Algorithms can attach nodes/edges (for tree/graph/trie) or keep using array + highlights.
 */
export interface VisualizerFrameMeta {
  nodes?: Node[]
  edges?: Edge[]
  viewport?: { x: number; y: number; zoom: number }
  /** For DP/table: 2D grid of cell values */
  grid?: unknown[][]
  /** For bit viz: binary strings and operation result */
  binary?: { a: string; b?: string; result: string; op?: string }
  /** Optional annotations (e.g. labels on edges) */
  annotations?: Record<string, string>
}

export interface PlaybackState {
  isPlaying: boolean
  currentFrame: number
  totalFrames: number
  playbackSpeed: number
}

export interface PlaybackActions {
  togglePlay: () => void
  nextStep: () => void
  previousStep: () => void
  reset: () => void
  setSpeed: (speed: number) => void
  setCurrentFrame: (frame: number) => void
}

export type VisualizerThemeColor =
  | 'orange'
  | 'indigo'
  | 'rose'
  | 'purple'
  | 'amber'
  | 'emerald'
  | 'lime'
  | 'fuchsia'
  | 'teal'
  | 'violet'
  | 'red'
  | 'sky'
  | 'green'
