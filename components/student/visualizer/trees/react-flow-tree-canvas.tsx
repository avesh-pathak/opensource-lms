'use client'

import React, { useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { useTreeStore } from '@/lib/store/tree-visualizer-store'
import { TreeValueNodeComponent as TreeValueNode } from '@/components/student/visualizer/shared/nodes/tree-value-node'

const nodeTypes = { treeNode: TreeValueNode }

/**
 * Calculate tree layout using Reingold-Tilford algorithm for clean hierarchical layout
 */
function calculateTreeLayout(
  nodes: any[]
): Record<string, { x: number; y: number }> {
  const root = nodes.find((n) => n.parentId === null)
  if (!root) return {}

  const positions: Record<string, { x: number; y: number }> = {}
  const NODE_WIDTH = 60
  const NODE_HEIGHT = 50
  const LEVEL_SEPARATION = 80
  const SIBLING_SEPARATION = 20

  // First pass: compute preliminary x positions
  function firstWalk(v: any, depth: number, offset: number): number {
    const leftSibling = v.leftId ? nodes.find((n) => n.id === v.leftId) : null
    const rightSibling = v.rightId
      ? nodes.find((n) => n.id === v.rightId)
      : null

    if (!leftSibling && !rightSibling) {
      // Leaf node
      return offset
    }

    let leftOffset = offset
    let rightOffset = offset

    if (leftSibling) {
      leftOffset = firstWalk(leftSibling, depth + 1, offset)
    }

    if (rightSibling) {
      rightOffset = firstWalk(
        rightSibling,
        depth + 1,
        leftOffset + SIBLING_SEPARATION + NODE_WIDTH
      )
    }

    // Position this node midway between children
    const childrenCenter = (leftOffset + rightOffset) / 2
    positions[v.id] = { x: childrenCenter, y: depth * LEVEL_SEPARATION }

    return childrenCenter
  }

  // Second pass: adjust positions to prevent overlap
  function secondWalk(v: any, depth: number, offset: number) {
    const nodePos = positions[v.id]
    if (!nodePos) return

    nodePos.x += offset

    const leftChild = v.leftId ? nodes.find((n) => n.id === v.leftId) : null
    const rightChild = v.rightId ? nodes.find((n) => n.id === v.rightId) : null

    if (leftChild) {
      secondWalk(leftChild, depth + 1, offset)
    }

    if (rightChild) {
      secondWalk(rightChild, depth + 1, offset)
    }
  }

  firstWalk(root, 0, 0)

  // Center the tree
  const allXValues = Object.values(positions).map((pos) => pos.x)
  const minX = Math.min(...allXValues)
  const maxX = Math.max(...allXValues)
  const treeWidth = maxX - minX
  const centerOffset = -(minX + treeWidth / 2)

  Object.keys(positions).forEach((id) => {
    positions[id].x += centerOffset
  })

  return positions
}

/**
 * React Flow infinite canvas for tree visualization.
 * Pan/zoom and node positions calculated dynamically.
 */
function ReactFlowTreeCanvas() {
  const { frames, currentFrame, treeData } = useTreeStore()
  const frame = frames[currentFrame]

  const { nodes: flowNodes, edges: flowEdges } = useMemo(() => {
    const highlights = frame?.highlights ?? []
    const secondaryHighlights = frame?.secondaryHighlights ?? []
    const visited = frame?.visited ?? []
    const pointers = frame?.pointers || {}

    // Use current frame data if available, otherwise use treeData
    const currentNodes = frame?.array?.length ? frame.array : treeData

    // Calculate layout
    const layout = calculateTreeLayout(currentNodes)

    const nodes: Node[] = currentNodes.map((node, idx) => ({
      id: node.id,
      type: 'treeNode',
      data: {
        label: node.value.toString(),
        isCurrent: highlights.includes(idx),
        isSecondary: secondaryHighlights.includes(idx),
        isVisited: visited.includes(idx),
        nodePointers: Object.entries(pointers)
          .filter(([_, pIdx]) => pIdx === idx)
          .map(([name]) => name),
      },
      position: layout[node.id] || { x: 0, y: 0 },
      draggable: false,
      selectable: true,
    }))

    const edges: Edge[] = currentNodes
      .filter((node) => node.leftId || node.rightId)
      .flatMap((node) => {
        const edges: Edge[] = []
        if (node.leftId) {
          edges.push({
            id: `edge-${node.id}-${node.leftId}-left`,
            source: node.id,
            target: node.leftId,
            type: 'smoothstep',
            animated: true,
            style: {
              stroke: 'currentColor',
              strokeWidth: 2,
              opacity: 0.5,
            },
            markerEnd: {
              type: 'arrow',
              width: 20,
              height: 20,
            },
          })
        }
        if (node.rightId) {
          edges.push({
            id: `edge-${node.id}-${node.rightId}-right`,
            source: node.id,
            target: node.rightId,
            type: 'smoothstep',
            animated: true,
            style: {
              stroke: 'currentColor',
              strokeWidth: 2,
              opacity: 0.5,
            },
            markerEnd: {
              type: 'arrow',
              width: 20,
              height: 20,
            },
          })
        }
        return edges
      })

    return { nodes, edges }
  }, [
    frame?.array,
    frame?.highlights,
    frame?.secondaryHighlights,
    frame?.visited,
    frame?.pointers,
    treeData,
  ])

  if (flowNodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-zinc-500 text-sm font-black uppercase tracking-[0.2em]">
          Initializing Tree Canvas...
        </p>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        className="bg-transparent"
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        panOnScroll
        zoomOnScroll
        panOnDrag
        zoomOnPinch
      >
        <Background
          gap={16}
          size={1}
          className="text-zinc-200 dark:text-zinc-700"
        />
        <Controls className="bg-white/80 dark:bg-black/80 backdrop-blur-md border-zinc-200 dark:border-white/10 text-zinc-500 rounded-xl overflow-hidden shadow-lg" />
      </ReactFlow>
    </div>
  )
}
export default ReactFlowTreeCanvas
export const MemoizedReactFlowTreeCanvas = React.memo(ReactFlowTreeCanvas)
