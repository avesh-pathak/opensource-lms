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

import { useGraphStore } from '@/lib/store/graph-visualizer-store'
import { GraphNodeComponent } from '@/components/student/visualizer/shared/nodes/graph-node'

const nodeTypes = { graphNode: GraphNodeComponent }

/**
 * React Flow infinite canvas for graph visualization (BFS, DFS, Dijkstra).
 * Pan/zoom and node positions from store.
 */
export function GraphFlowCanvas() {
  const {
    nodes: storeNodes,
    edges: storeEdges,
    frames,
    currentFrame,
  } = useGraphStore()
  const frame = frames[currentFrame]

  const { nodes: flowNodes, edges: flowEdges } = useMemo(() => {
    const highlights = frame?.highlights ?? []
    const visited = frame?.visited ?? []
    const nodes: Node[] = storeNodes.map((n, idx) => ({
      id: n.id,
      type: 'graphNode',
      position: { x: n.x, y: n.y },
      data: {
        label: n.label,
        isCurrent: highlights.includes(idx),
        isVisited: visited.includes(idx),
      },
      draggable: false,
      selectable: true,
    }))

    const edges: Edge[] = storeEdges.map((e, i) => ({
      id: `e-${e.from}-${e.to}-${i}`,
      source: e.from,
      target: e.to,
      type: 'smoothstep',
      style: {
        stroke: 'currentColor',
        strokeWidth: 2,
        opacity: 0.5,
      },
    }))

    return { nodes, edges }
  }, [storeNodes, storeEdges, frame?.highlights, frame?.visited])

  if (flowNodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-zinc-500 text-sm font-black uppercase tracking-[0.2em]">
          Click Generate to run the algorithm
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
