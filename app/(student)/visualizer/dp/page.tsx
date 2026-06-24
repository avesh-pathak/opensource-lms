'use client'

import { useEffect } from 'react'
import { useDPStore } from '@/lib/store/dp-visualizer-store'
import { DPCanvas } from '@/components/student/visualizer/dp/dp-canvas'
import { DPControlDeck } from '@/components/student/visualizer/dp/dp-control-deck'
import { DPCodeViewer } from '@/components/student/visualizer/dp/dp-code-viewer'
import { DPExplanationPanel } from '@/components/student/visualizer/dp/dp-explanation-panel'
import { DPComplexityCard } from '@/components/student/visualizer/dp/dp-complexity-card'
import { DPInputControls } from '@/components/student/visualizer/dp/dp-input-controls'
import { VisualizerShell } from '@/components/student/visualizer/shared/visualizer-shell'
import { Layers } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function DPVisualizerPage() {
  const {
    algorithm,
    setAlgorithm,
    generateInput,
    isPlaying,
    playbackSpeed,
    nextStep,
    currentFrame,
    frames,
  } = useDPStore()

  useEffect(() => {
    generateInput()
  }, [generateInput])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (isPlaying) {
      interval = setInterval(() => nextStep(), 800 / playbackSpeed)
    }
    return () => clearInterval(interval)
  }, [isPlaying, playbackSpeed, nextStep])

  return (
    <VisualizerShell
      title="DP Visualizer"
      titleShort="DP Vis"
      subtitle="Memoization • Tabulation"
      icon={<Layers className="h-3 w-3 text-white" />}
      themeColor="violet"
      selectionBg="selection:bg-violet-500/20"
      headerRight={
        <>
          <Select
            value={algorithm}
            onValueChange={(v) => setAlgorithm(v as any)}
          >
            <SelectTrigger className="w-[180px] h-9 bg-white/60 dark:bg-zinc-900/80 border-zinc-200 dark:border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DP_FIBONACCI">Fibonacci</SelectItem>
              <SelectItem value="DP_CLIMB_STAIRS">Climbing Stairs</SelectItem>
              <SelectItem value="DP_KNAPSACK">Knapsack</SelectItem>
            </SelectContent>
          </Select>
          <DPInputControls />
        </>
      }
      controlDeck={<DPControlDeck />}
      explanationPanel={<DPExplanationPanel />}
      sidebar={
        <>
          <DPExplanationPanel />
          <DPComplexityCard />
          <div className="flex-1 min-h-[300px] flex flex-col">
            <DPCodeViewer />
          </div>
        </>
      }
      statusBar={
        frames.length > 0
          ? `Step ${currentFrame + 1} / ${frames.length}`
          : 'Ready'
      }
    >
      <DPCanvas />
    </VisualizerShell>
  )
}
