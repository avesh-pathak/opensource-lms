'use client'

import { useEffect } from 'react'
import { useBacktrackingStore } from '@/lib/store/backtracking-visualizer-store'
import { BacktrackingCanvas } from '@/components/student/visualizer/backtracking/backtracking-canvas'
import { BacktrackingControlDeck } from '@/components/student/visualizer/backtracking/backtracking-control-deck'
import { BacktrackingCodeViewer } from '@/components/student/visualizer/backtracking/backtracking-code-viewer'
import { BacktrackingExplanationPanel } from '@/components/student/visualizer/backtracking/backtracking-explanation-panel'
import { BacktrackingComplexityCard } from '@/components/student/visualizer/backtracking/backtracking-complexity-card'
import { BacktrackingInputControls } from '@/components/student/visualizer/backtracking/backtracking-input-controls'
import { VisualizerShell } from '@/components/student/visualizer/shared/visualizer-shell'
import { RotateCcw } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function BacktrackingVisualizerPage() {
  const {
    algorithm,
    setAlgorithm,
    generateInput,
    isPlaying,
    playbackSpeed,
    nextStep,
    currentFrame,
    frames,
  } = useBacktrackingStore()

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
      title="Backtracking Visualizer"
      titleShort="Backtrack Vis"
      subtitle="Subsets • Permutations • N-Queens"
      icon={<RotateCcw className="h-3 w-3 text-white" />}
      themeColor="red"
      selectionBg="selection:bg-red-500/20"
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
              <SelectItem value="BT_SUBSETS">Subsets</SelectItem>
              <SelectItem value="BT_PERMUTATIONS">Permutations</SelectItem>
              <SelectItem value="BT_N_QUEENS">N-Queens</SelectItem>
            </SelectContent>
          </Select>
          <BacktrackingInputControls />
        </>
      }
      controlDeck={<BacktrackingControlDeck />}
      explanationPanel={<BacktrackingExplanationPanel />}
      sidebar={
        <>
          <BacktrackingExplanationPanel />
          <BacktrackingComplexityCard />
          <div className="flex-1 min-h-[300px] flex flex-col">
            <BacktrackingCodeViewer />
          </div>
        </>
      }
      statusBar={
        frames.length > 0
          ? `Step ${currentFrame + 1} / ${frames.length}`
          : 'Ready'
      }
    >
      <BacktrackingCanvas />
    </VisualizerShell>
  )
}
