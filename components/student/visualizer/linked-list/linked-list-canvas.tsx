'use client'

import React, { useCallback } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  Connection,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { useLinkedListStore } from '@/lib/store/linked-list-visualizer-store'
import { LinkedListNodeComponent } from './react-flow-node'

// Register custom node types
const nodeTypes = {
  linkedListNode: LinkedListNodeComponent,
}

export function LinkedListCanvas() {
  const { frames, currentFrame, updateNodeConnection } = useLinkedListStore()
  const frame = frames[currentFrame]

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        updateNodeConnection(params.source, params.target)
      }
    },
    [updateNodeConnection]
  )

  if (!frame)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-zinc-500 animate-pulse text-sm font-black uppercase tracking-[0.2em]">
          Initializing LinkedList Canvas...
        </p>
      </div>
    )

  const { array: structNodes, pointers } = frame

  // Transform to React Flow Nodes
  const nodes: Node[] = structNodes.map((node, idx) => ({
    id: node.id,
    type: 'linkedListNode',
    position: { x: 50 + idx * 250, y: 100 },
    data: {
      value: node.value,
      index: idx,
      pointers: pointers,
      isCurrent: Object.values(pointers).includes(idx),
    },
    draggable: true,
    connectable: true,
  }))

  // Transform to React Flow Edges
  const edges: Edge[] = structNodes
    .filter((node) => node.nextId)
    .map((node) => {
      return {
        id: `e-${node.id}-${node.nextId}`,
        source: node.id,
        target: node.nextId!,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#a855f7', strokeWidth: 2, opacity: 0.6 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#a855f7',
        },
      }
    })

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        fitView
        fitViewOptions={{ padding: 0.3, maxZoom: 1.2 }}
        className="bg-transparent"
        minZoom={0.4}
        maxZoom={1.5}
        defaultEdgeOptions={{ type: 'smoothstep', animated: true }}
        proOptions={{ hideAttribution: true }}
        panOnScroll={false}
        zoomOnScroll={false}
      >
        <Background
          color="#a855f7"
          gap={24}
          size={1}
          className="opacity-[0.05]"
        />
        <Controls className="bg-white/80 dark:bg-black/80 backdrop-blur-md border-zinc-200 dark:border-white/10 text-zinc-500 rounded-xl overflow-hidden shadow-lg" />
      </ReactFlow>
    </div>
  )
}
