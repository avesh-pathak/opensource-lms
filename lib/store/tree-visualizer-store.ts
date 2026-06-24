import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { AlgorithmType, VisualizerFrame } from '@/lib/types/visualizer'
import { generateTraversalFrames } from '@/lib/algorithms/trees/traversal'
import { generateBFSFrames } from '@/lib/algorithms/trees/bfs'
import { generateLCAFrames } from '@/lib/algorithms/trees/lowest-common-ancestor'
import { generateBSTOpsFrames } from '@/lib/algorithms/trees/bst-ops'

export interface TreeNode {
  id: string
  value: number
  leftId: string | null
  rightId: string | null
  parentId: string | null
}

interface TreeState {
  algorithm: AlgorithmType
  isPlaying: boolean
  currentFrame: number
  playbackSpeed: number
  frames: VisualizerFrame<TreeNode>[]
  treeData: TreeNode[] // Flat array of tree nodes
  bstOperationType: 'insert' | 'delete'
  bstOperationValue: number
  manualEditMode: boolean

  // Actions
  setAlgorithm: (algo: AlgorithmType) => void
  setIsPlaying: (isPlaying: boolean) => void
  setCurrentFrame: (frame: number) => void
  setPlaybackSpeed: (speed: number) => void
  nextStep: () => void
  previousStep: () => void
  reset: () => void
  generateInput: () => void
  setBSTOperationType: (type: 'insert' | 'delete') => void
  setBSTOperationValue: (value: number) => void
  setManualEditMode: (enabled: boolean) => void
  addNodeManual: (value: number) => void
  deleteNodeManual: (value: number) => void
}

export const useTreeStore = create<TreeState>((set, get) => ({
  algorithm: 'TREE_TRAVERSAL',
  isPlaying: false,
  currentFrame: 0,
  playbackSpeed: 1,
  frames: [],
  treeData: [],
  bstOperationType: 'insert',
  bstOperationValue: 45,
  manualEditMode: false,

  setAlgorithm: (algo) => {
    set({ algorithm: algo, currentFrame: 0, isPlaying: false })
    get().generateInput()
  },

  setIsPlaying: (playing) => set({ isPlaying: playing }),

  setCurrentFrame: (frame) => set({ currentFrame: frame }),

  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

  setBSTOperationType: (type) => set({ bstOperationType: type }),

  setBSTOperationValue: (value) => set({ bstOperationValue: value }),

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

  setManualEditMode: (enabled) => set({ manualEditMode: enabled }),

  addNodeManual: (value) => {
    const { treeData } = get()
    const newId = `${value}-${Date.now()}`
    const newNode: TreeNode = {
      id: newId,
      value: value,
      leftId: null,
      rightId: null,
      parentId: null,
    }
    set({ treeData: [...treeData, newNode] })
    // Reset frames to reflect the new tree
    get().generateInput()
  },

  deleteNodeManual: (value) => {
    const { treeData } = get()
    const nodeToDelete = treeData.find((n) => n.value === value)
    if (!nodeToDelete) return

    // Simple deletion - just remove the node (doesn't handle BST properties)
    // For a proper BST deletion, we'd need more complex logic
    const updatedTreeData = treeData.filter((n) => n.value !== value)
    // Also need to update parent references
    const finalTreeData = updatedTreeData.map((node) => {
      if (node.leftId && !updatedTreeData.some((n) => n.id === node.leftId)) {
        return { ...node, leftId: null }
      }
      if (node.rightId && !updatedTreeData.some((n) => n.id === node.rightId)) {
        return { ...node, rightId: null }
      }
      return node
    })

    set({ treeData: finalTreeData })
    // Reset frames to reflect the new tree
    get().generateInput()
  },

  generateInput: () => {
    const { algorithm, bstOperationType, bstOperationValue } = get()

    // Generate a balanced-ish BST as a starting point
    const _values = [50, 30, 70, 20, 40, 60, 80]
    const initialTree: TreeNode[] = [
      { id: '50', value: 50, leftId: '30', rightId: '70', parentId: null },
      { id: '30', value: 30, leftId: '20', rightId: '40', parentId: '50' },
      { id: '70', value: 70, leftId: '60', rightId: '80', parentId: '50' },
      { id: '20', value: 20, leftId: null, rightId: null, parentId: '30' },
      { id: '40', value: 40, leftId: null, rightId: null, parentId: '30' },
      { id: '60', value: 60, leftId: null, rightId: null, parentId: '70' },
      { id: '80', value: 80, leftId: null, rightId: null, parentId: '70' },
    ]

    let frames: VisualizerFrame<TreeNode>[] = []

    switch (algorithm) {
      case 'TREE_TRAVERSAL':
        frames = generateTraversalFrames(initialTree, 'inorder')
        break
      case 'TREE_BFS':
        frames = generateBFSFrames(initialTree)
        break
      case 'TREE_LCA':
        frames = generateLCAFrames(initialTree, '20', '40')
        break
      case 'BST_OPERATIONS':
        frames = generateBSTOpsFrames(
          initialTree,
          bstOperationType,
          bstOperationValue
        )
        break
      default:
        frames = [
          {
            array: initialTree,
            highlights: [],
            secondaryHighlights: [],
            visited: [],
            pointers: {},
            explanation: 'Starting Tree visualization...',
            activeLine: 0,
            variables: {},
            comparisons: 0,
            phase: 'search',
          },
        ]
    }

    set({ treeData: initialTree, frames, currentFrame: 0, isPlaying: false })
  },
}))

export { useShallow }
