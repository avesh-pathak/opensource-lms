'use client'

import React, { useMemo } from 'react'
import { ReactFlow, Background, Controls, Node, Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { useRecursionStore } from '@/lib/store/recursion-visualizer-store'
import { RecursionNode } from '@/lib/types/visualizer'
import { RecursionNodeComponent } from '@/components/student/visualizer/shared/nodes/recursion-node'
import {
  getLayoutedPositions,
  DEFAULT_NODE_WIDTH,
  DEFAULT_NODE_HEIGHT,
} from '@/lib/utils/dagre-layout'

const nodeTypes = { recursionNode: RecursionNodeComponent }

/**
 * React Flow canvas for recursion tree (Fibonacci, Factorial, etc.) with dagre auto-layout.
 */
export function RecursionFlowCanvas() {
  const { frames, currentFrame } = useRecursionStore()
  const frame = frames[currentFrame]

  const { nodes: flowNodes, edges: flowEdges } = useMemo(() => {
    if (!frame) return { nodes: [], edges: [] }
    const array = frame.array as RecursionNode[]
    if (!Array.isArray(array) || array.length === 0)
      return { nodes: [], edges: [] }

    const nodeWidth = DEFAULT_NODE_WIDTH
    const nodeHeight = DEFAULT_NODE_HEIGHT

    const layoutNodes = array.map((n) => ({
      id: n.id,
      width: nodeWidth,
      height: nodeHeight,
    }))
    const layoutEdges = array
      .filter((n) => n.parentId != null && n.parentId !== '')
      .map((n) => ({ source: n.parentId!, target: n.id }))

    const positions = getLayoutedPositions({
      nodes: layoutNodes,
      edges: layoutEdges,
      direction: 'TB',
      rankSep: 70,
      nodeSep: 50,
    })

    const nodes: Node[] = array.map((node, idx) => ({
      id: node.id,
      type: 'recursionNode',
      position: positions.get(node.id) ?? { x: idx * 180, y: 0 },
      data: {
        id: node.id,
        name: node.name,
        params: node.params,
        returnValue: node.returnValue,
        depth: node.depth,
        status: node.status,
        subset: (node as unknown as { subset?: unknown[] }).subset,
      },
      draggable: false,
      selectable: true,
    }))

    const edges: Edge[] = layoutEdges.map((e, _i) => ({
      id: `e-${e.source}-${e.target}`,
      source: e.source,
      target: e.target,
      type: 'smoothstep',
      animated: array.find((n) => n.id === e.target)?.status === 'active',
      style: {
        stroke: '#f43f5e',
        strokeWidth: 2,
        opacity:
          array.find((n) => n.id === e.target)?.status === 'active' ? 1 : 0.5,
      },
    }))

    return { nodes, edges }
  }, [frame])

  if (!frame) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-zinc-500 animate-pulse text-sm font-black uppercase tracking-[0.2em]">
          Initializing Recursion Canvas...
        </p>
      </div>
    )
  }

  const array = frame.array as RecursionNode[]
  if (!Array.isArray(array) || array.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-zinc-500 text-sm font-black uppercase tracking-[0.2em]">
          No call trace yet
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
        defaultViewport={{ x: 20, y: 20, zoom: 0.9 }}
        className="bg-transparent"
        minZoom={0.2}
        maxZoom={2}
        panOnDrag
        zoomOnScroll
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          color="#f43f5e"
          gap={24}
          size={1}
          className="opacity-[0.06]"
        />
        <Controls className="bg-white/80 dark:bg-black/80 backdrop-blur-md border-zinc-200 dark:border-white/10 text-zinc-500 rounded-xl overflow-hidden shadow-lg" />
      </ReactFlow>
    </div>
  )
}
