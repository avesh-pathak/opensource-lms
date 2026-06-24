import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import { AlgorithmType, VisualizerFrame } from '@/lib/types/visualizer'
import { generateReverseLinkedListFrames } from '@/lib/algorithms/linked-list/reverse-ll'
import { generateDetectCycleFrames } from '@/lib/algorithms/linked-list/detect-cycle'
import { generateMergeSortedListsFrames } from '@/lib/algorithms/linked-list/merge-lists'
import { generateMiddleNodeFrames } from '@/lib/algorithms/linked-list/middle-node'
export interface LinkedListNode {
  id: string
  value: number
  nextId: string | null
  prevId?: string | null
}
const MAX_NODES = 15
interface LinkedListState {
  algorithm: AlgorithmType
  isPlaying: boolean
  currentFrame: number
  playbackSpeed: number
  frames: VisualizerFrame<LinkedListNode>[]
  nodes: LinkedListNode[]
  // Actions
  setAlgorithm: (algo: AlgorithmType) => void
  setIsPlaying: (isPlaying: boolean) => void
  setCurrentFrame: (frame: number) => void
  setPlaybackSpeed: (speed: number) => void
  nextStep: () => void
  previousStep: () => void
  reset: () => void
  updateNodeConnection: (sourceId: string, targetId: string | null) => void
  generateInput: () => void
  recalculateFrames: () => void
  addNode: (value: number) => void
  clearNodes: () => void
}
export const useLinkedListStore = create<LinkedListState>()(
  persist(
    (set, get) => ({
      algorithm: 'LL_REVERSE',
      isPlaying: false,
      currentFrame: 0,
      playbackSpeed: 1,
      frames: [],
      nodes: [],
      recalculateFrames: () => {
        const { nodes, algorithm } = get()
        let frames: VisualizerFrame<LinkedListNode>[] = []
        switch (algorithm) {
          case 'LL_REVERSE':
            frames = generateReverseLinkedListFrames(nodes)
            break
          case 'LL_DETECT_CYCLE':
            frames = generateDetectCycleFrames(nodes)
            break
          case 'LL_MERGE_SORTED':
            frames = generateMergeSortedListsFrames(nodes)
            break
          case 'LL_MIDDLE_NODE':
            frames = generateMiddleNodeFrames(nodes)
            break
          default:
            frames = [
              {
                array: nodes,
                highlights: [],
                secondaryHighlights: [],
                visited: [],
                pointers: {},
                explanation: 'Ready.',
                activeLine: 0,
                variables: {},
                comparisons: 0,
                phase: 'search',
              },
            ]
        }
        set({ frames, isPlaying: false })
      },
      setAlgorithm: (algo) => {
        set({ algorithm: algo, currentFrame: 0, isPlaying: false })
        get().generateInput()
      },
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setCurrentFrame: (frame) => set({ currentFrame: frame }),
      setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
      nextStep: () => {
        const { currentFrame, frames } = get()
        if (currentFrame < frames.length - 1) {
          set({ currentFrame: currentFrame + 1 })
        } else {
          set({ isPlaying: false })
        }
      },
      previousStep: () => {
        const { currentFrame } = get()
        if (currentFrame > 0) {
          set({ currentFrame: currentFrame - 1 })
        }
      },
      reset: () => {
        set({ currentFrame: 0, isPlaying: false })
      },
      updateNodeConnection: (sourceId, targetId) => {
        const { nodes } = get()
        const newNodes = nodes.map((node) =>
          node.id === sourceId ? { ...node, nextId: targetId } : node
        )
        set({ nodes: newNodes })
        get().recalculateFrames()
      },
      addNode: (value) => {
        const { nodes } = get()
        if (nodes.length >= MAX_NODES) return
        const newNodeId = `node-${Date.now()}`
        const newNode: LinkedListNode = {
          id: newNodeId,
          value: value,
          nextId: null,
        }
        // If list is not empty, link the last node to this new one
        // We assume the last node in the array is the tail for simplicity in this random-gen context
        // But for robustness, let's find the node with nextId === null
        // actually, for the visualizer array, usually index-based order implies structure mostly.
        // But let's act on the array:
        const newNodes = [...nodes]
        if (newNodes.length > 0) {
          const lastNodeIndex = newNodes.length - 1
          newNodes[lastNodeIndex] = {
            ...newNodes[lastNodeIndex],
            nextId: newNodeId,
          }
        }
        newNodes.push(newNode)
        set({ nodes: newNodes })
        get().recalculateFrames()
      },
      generateInput: () => {
        const { algorithm: _algorithm } = get()
        const initialNodes: LinkedListNode[] = []
        // Default random linked list - Respect MAX_NODES
        // Random size between 5 and 8, strictly capped
        const size = Math.min(MAX_NODES, 5 + Math.floor(Math.random() * 3))
        const values = Array.from(
          { length: size },
          () => Math.floor(Math.random() * 99) + 1
        )
        for (let i = 0; i < size; i++) {
          initialNodes.push({
            id: `node-${i}`,
            value: values[i],
            nextId: i < size - 1 ? `node-${i + 1}` : null,
          })
        }
        set({ nodes: initialNodes, currentFrame: 0 })
        get().recalculateFrames()
      },
      clearNodes: () => {
        set({ nodes: [], currentFrame: 0 })
        get().recalculateFrames()
      },
    }),
    {
      name: 'linkedlist-visualizer-storage',
      partialize: (state) => ({
        nodes: state.nodes,
        currentFrame: state.currentFrame,
        algorithm: state.algorithm,
        playbackSpeed: state.playbackSpeed,
      }),
    }
  )
)
export { useShallow }
