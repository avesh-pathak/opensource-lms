import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import type { VisualizerFrame } from '@/lib/types/visualizer'
import {
  generateBFSFrames,
  type GraphNode,
  type GraphEdge,
} from '@/lib/algorithms/graph/bfs'
import { generateDFSFrames } from '@/lib/algorithms/graph/dfs'
import { generateDijkstraFrames } from '@/lib/algorithms/graph/dijkstra'

export type GraphAlgorithmType = 'GRAPH_BFS' | 'GRAPH_DFS' | 'GRAPH_DIJKSTRA'

const DEFAULT_NODES: GraphNode[] = [
  { id: 'A', label: 'A', x: 100, y: 50 },
  { id: 'B', label: 'B', x: 50, y: 120 },
  { id: 'C', label: 'C', x: 150, y: 120 },
  { id: 'D', label: 'D', x: 20, y: 190 },
  { id: 'E', label: 'E', x: 80, y: 190 },
  { id: 'F', label: 'F', x: 120, y: 190 },
  { id: 'G', label: 'G', x: 180, y: 190 },
]
const DEFAULT_EDGES: GraphEdge[] = [
  { from: 'A', to: 'B' },
  { from: 'A', to: 'C' },
  { from: 'B', to: 'D' },
  { from: 'B', to: 'E' },
  { from: 'C', to: 'F' },
  { from: 'C', to: 'G' },
]

interface GraphState {
  algorithm: GraphAlgorithmType
  isPlaying: boolean
  currentFrame: number
  playbackSpeed: number
  frames: VisualizerFrame[]
  nodes: GraphNode[]
  edges: GraphEdge[]
  startNodeId: string
  manualEditMode: boolean

  setAlgorithm: (a: GraphAlgorithmType) => void
  setCurrentFrame: (f: number) => void
  togglePlay: () => void
  setSpeed: (s: number) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
  generateInput: () => void
  setStartNodeId: (id: string) => void
  setManualEditMode: (enabled: boolean) => void
  addNode: (node: GraphNode) => void
  removeNode: (nodeId: string) => void
  addEdge: (edge: GraphEdge) => void
  removeEdge: (from: string, to: string) => void
}

export const useGraphStore = create<GraphState>((set, get) => ({
  algorithm: 'GRAPH_BFS',
  isPlaying: false,
  currentFrame: 0,
  playbackSpeed: 1,
  frames: [],
  nodes: DEFAULT_NODES,
  edges: DEFAULT_EDGES,
  startNodeId: 'A',
  manualEditMode: false,

  setAlgorithm: (algorithm) => {
    set({ algorithm, currentFrame: 0, isPlaying: false })
    get().generateInput()
  },

  setCurrentFrame: (f) => {
    const { frames } = get()
    if (f >= 0 && f < frames.length) set({ currentFrame: f })
  },

  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

  setSpeed: (playbackSpeed) => set({ playbackSpeed }),

  nextStep: () => {
    const { currentFrame, frames } = get()
    if (currentFrame < frames.length - 1)
      set({ currentFrame: currentFrame + 1 })
    else set({ isPlaying: false })
  },

  prevStep: () => {
    const { currentFrame } = get()
    if (currentFrame > 0) set({ currentFrame: currentFrame - 1 })
  },

  reset: () => set({ currentFrame: 0, isPlaying: false }),

  setManualEditMode: (enabled) => set({ manualEditMode: enabled }),

  addNode: (node) => {
    set({ nodes: [...get().nodes, node] })
    get().generateInput()
  },

  removeNode: (nodeId) => {
    const { nodes, edges } = get()
    const filteredNodes = nodes.filter((n) => n.id !== nodeId)
    const filteredEdges = edges.filter(
      (e) => e.from !== nodeId && e.to !== nodeId
    )
    set({ nodes: filteredNodes, edges: filteredEdges })
    get().generateInput()
  },

  addEdge: (edge) => {
    set({ edges: [...get().edges, edge] })
    get().generateInput()
  },

  removeEdge: (from, to) => {
    const { edges } = get()
    const filteredEdges = edges.filter((e) => !(e.from === from && e.to === to))
    set({ edges: filteredEdges })
    get().generateInput()
  },

  generateInput: () => {
    const { nodes, edges, startNodeId, algorithm } = get()
    let frames: VisualizerFrame[] = []
    if (algorithm === 'GRAPH_BFS') {
      frames = generateBFSFrames(nodes, edges, startNodeId)
    } else if (algorithm === 'GRAPH_DFS') {
      frames = generateDFSFrames(nodes, edges, startNodeId)
    } else if (algorithm === 'GRAPH_DIJKSTRA') {
      frames = generateDijkstraFrames(nodes, edges, startNodeId)
    }
    set({ frames, currentFrame: 0, isPlaying: false })
  },

  setStartNodeId: (startNodeId) => {
    set({ startNodeId })
    get().generateInput()
  },
}))

export { useShallow }
