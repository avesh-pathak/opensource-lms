'use client'

import React from 'react'
import { ReactFlow, Background, Controls, Node, Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { useStackStore } from '@/lib/store/stack-visualizer-store'
import { StackNodeComponent } from '@/components/student/visualizer/shared/nodes/stack-node'

const nodeTypes = { stackNode: StackNodeComponent }

const NODE_HEIGHT = 56
const STACK_GAP = 16

/**
 * React Flow canvas for stack visualization (Valid Parentheses, Next Greater Element).
 * Stack is drawn bottom-to-top: index 0 at bottom, top of stack at top.
 */
export function StackFlowCanvas() {
  const { frames, currentFrame, algorithm: _algorithm } = useStackStore()
  const activeFrame = frames[currentFrame]

  const internalStack =
    (activeFrame?.variables?.stack as (string | number)[]) || []
  const stackTopIdx = internalStack.length - 1

  const nodes: Node[] = internalStack.map((value, idx) => ({
    id: `stack-${idx}`,
    type: 'stackNode',
    position: {
      x: 80,
      y: 60 + (internalStack.length - 1 - idx) * (NODE_HEIGHT + STACK_GAP),
    },
    data: {
      value,
      index: idx,
      isTop: idx === stackTopIdx,
      accent: 'indigo',
    },
    draggable: false,
    selectable: true,
  }))

  const edges: Edge[] = []
  for (let idx = 0; idx < internalStack.length - 1; idx++) {
    edges.push({
      id: `e-${idx}-${idx + 1}`,
      source: `stack-${idx}`,
      target: `stack-${idx + 1}`,
      type: 'smoothstep',
      animated: idx === stackTopIdx - 1,
      style: {
        stroke: '#6366f1',
        strokeWidth: 2,
        opacity: idx === stackTopIdx - 1 ? 1 : 0.4,
      },
    })
  }

  if (internalStack.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-zinc-500 text-sm font-black uppercase tracking-[0.2em]">
          Stack is empty
        </p>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        className="bg-transparent"
        minZoom={0.3}
        maxZoom={2}
        panOnDrag
        zoomOnScroll
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          color="#6366f1"
          gap={24}
          size={1}
          className="opacity-[0.06]"
        />
        <Controls className="bg-white/80 dark:bg-black/80 backdrop-blur-md border-zinc-200 dark:border-white/10 text-zinc-500 rounded-xl overflow-hidden shadow-lg" />
      </ReactFlow>
    </div>
  )
}
