'use client'

import { useEffect } from 'react'
import { useGraphStore } from '@/lib/store/graph-visualizer-store'
import { GraphFlowCanvas } from '@/components/student/visualizer/graphs/graph-flow-canvas'
import { GraphControlDeck } from '@/components/student/visualizer/graphs/graph-control-deck'
import { GraphCodeViewer } from '@/components/student/visualizer/graphs/graph-code-viewer'
import { GraphExplanationPanel } from '@/components/student/visualizer/graphs/graph-explanation-panel'
import { GraphComplexityCard } from '@/components/student/visualizer/graphs/graph-complexity-card'
import { GraphInputControls } from '@/components/student/visualizer/graphs/graph-input-controls'
import { VisualizerShell } from '@/components/student/visualizer/shared/visualizer-shell'
import { GitBranch } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function GraphVisualizerPage() {
  const {
    algorithm,
    setAlgorithm,
    generateInput,
    isPlaying,
    playbackSpeed,
    nextStep,
    prevStep,
    togglePlay,
    setSpeed,
    currentFrame,
    frames,
  } = useGraphStore()

  useEffect(() => {
    generateInput()
  }, [generateInput])

  // Keyboard accessibility: navigation shortcuts for graphs
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase() || ''
      if (tag === 'input' || tag === 'textarea') return
      switch (e.code) {
        case 'Space':
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowRight':
          nextStep()
          break
        case 'ArrowLeft':
          // @ts-ignore
          if (typeof prevStep === 'function') prevStep()
          break
        case 'ArrowUp':
          setSpeed(Math.min(3, playbackSpeed + 0.5))
          break
        case 'ArrowDown':
          setSpeed(Math.max(0.5, playbackSpeed - 0.5))
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isPlaying, playbackSpeed, nextStep, prevStep, togglePlay, setSpeed])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (isPlaying) {
      interval = setInterval(() => nextStep(), 800 / playbackSpeed)
    }
    return () => clearInterval(interval)
  }, [isPlaying, playbackSpeed, nextStep])

  return (
    <VisualizerShell
      title="Graph Visualizer"
      titleShort="Graph Vis"
      subtitle="BFS • DFS • Shortest Path"
      icon={<GitBranch className="h-3 w-3 text-white" />}
      themeColor="fuchsia"
      selectionBg="selection:bg-fuchsia-500/20"
      headerRight={
        <>
          <Select
            value={algorithm}
            onValueChange={(v) => setAlgorithm(v as any)}
          >
            <SelectTrigger className="w-[160px] h-9 bg-white/60 dark:bg-zinc-900/80 border-zinc-200 dark:border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GRAPH_BFS">BFS</SelectItem>
              <SelectItem value="GRAPH_DFS">DFS</SelectItem>
              <SelectItem value="GRAPH_DIJKSTRA">Dijkstra</SelectItem>
            </SelectContent>
          </Select>
          <GraphInputControls />
        </>
      }
      controlDeck={<GraphControlDeck />}
      explanationPanel={<GraphExplanationPanel />}
      sidebar={
        <>
          <GraphExplanationPanel />
          <GraphComplexityCard />
          <div className="flex-1 min-h-[300px] flex flex-col">
            <GraphCodeViewer />
          </div>
        </>
      }
      statusBar={
        frames.length > 0
          ? `Step ${currentFrame + 1} / ${frames.length}`
          : 'Ready'
      }
    >
      <GraphFlowCanvas />
    </VisualizerShell>
  )
}
