'use client'

import { useEffect } from 'react'
import { useGreedyStore } from '@/lib/store/greedy-visualizer-store'
import { GreedyCanvas } from '@/components/student/visualizer/greedy/greedy-canvas'
import { GreedyControlDeck } from '@/components/student/visualizer/greedy/greedy-control-deck'
import { GreedyCodeViewer } from '@/components/student/visualizer/greedy/greedy-code-viewer'
import { GreedyExplanationPanel } from '@/components/student/visualizer/greedy/greedy-explanation-panel'
import { GreedyComplexityCard } from '@/components/student/visualizer/greedy/greedy-complexity-card'
import { GreedyInputControls } from '@/components/student/visualizer/greedy/greedy-input-controls'
import { VisualizerShell } from '@/components/student/visualizer/shared/visualizer-shell'
import { Zap } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function GreedyVisualizerPage() {
  const {
    algorithm,
    setAlgorithm,
    generateInput,
    isPlaying,
    playbackSpeed,
    nextStep,
    currentFrame,
    frames,
  } = useGreedyStore()

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
      title="Greedy Visualizer"
      titleShort="Greedy Vis"
      subtitle="Activity • Knapsack • Intervals"
      icon={<Zap className="h-3 w-3 text-white" />}
      themeColor="teal"
      selectionBg="selection:bg-teal-500/20"
      headerRight={
        <>
          <Select
            value={algorithm}
            onValueChange={(v) => setAlgorithm(v as any)}
          >
            <SelectTrigger className="w-[200px] h-9 bg-white/60 dark:bg-zinc-900/80 border-zinc-200 dark:border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GR_ACTIVITY_SELECTION">
                Activity selection
              </SelectItem>
              <SelectItem value="GR_FRACTIONAL_KNAPSACK">
                Fractional knapsack
              </SelectItem>
              <SelectItem value="GR_JUMP_GAME">Jump game</SelectItem>
            </SelectContent>
          </Select>
          <GreedyInputControls />
        </>
      }
      controlDeck={<GreedyControlDeck />}
      explanationPanel={<GreedyExplanationPanel />}
      sidebar={
        <>
          <GreedyExplanationPanel />
          <GreedyComplexityCard />
          <div className="flex-1 min-h-[300px] flex flex-col">
            <GreedyCodeViewer />
          </div>
        </>
      }
      statusBar={
        frames.length > 0
          ? `Step ${currentFrame + 1} / ${frames.length}`
          : 'Ready'
      }
    >
      <GreedyCanvas />
    </VisualizerShell>
  )
}
