'use client'

import { useEffect } from 'react'
import { useBitStore } from '@/lib/store/bit-visualizer-store'
import { BitCanvas } from '@/components/student/visualizer/bit/bit-canvas'
import { BitControlDeck } from '@/components/student/visualizer/bit/bit-control-deck'
import { BitCodeViewer } from '@/components/student/visualizer/bit/bit-code-viewer'
import { BitExplanationPanel } from '@/components/student/visualizer/bit/bit-explanation-panel'
import { BitComplexityCard } from '@/components/student/visualizer/bit/bit-complexity-card'
import { BitInputControls } from '@/components/student/visualizer/bit/bit-input-controls'
import { VisualizerShell } from '@/components/student/visualizer/shared/visualizer-shell'
import { Binary } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function BitManipulationVisualizerPage() {
  const {
    algorithm,
    setAlgorithm,
    generateInput,
    isPlaying,
    playbackSpeed,
    nextStep,
    currentFrame,
    frames,
  } = useBitStore()

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
      title="Bit Manipulation"
      titleShort="Bit Vis"
      subtitle="AND • OR • XOR • Shifts"
      icon={<Binary className="h-3 w-3 text-white" />}
      themeColor="sky"
      selectionBg="selection:bg-sky-500/20"
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
              <SelectItem value="BIT_AND_OR_XOR">AND / OR / XOR</SelectItem>
              <SelectItem value="BIT_SHIFTS">Shifts</SelectItem>
              <SelectItem value="BIT_MASK">Mask</SelectItem>
            </SelectContent>
          </Select>
          <BitInputControls />
        </>
      }
      controlDeck={<BitControlDeck />}
      explanationPanel={<BitExplanationPanel />}
      sidebar={
        <>
          <BitExplanationPanel />
          <BitComplexityCard />
          <div className="flex-1 min-h-[300px] flex flex-col">
            <BitCodeViewer />
          </div>
        </>
      }
      statusBar={
        frames.length > 0
          ? `Step ${currentFrame + 1} / ${frames.length}`
          : 'Ready'
      }
    >
      <BitCanvas />
    </VisualizerShell>
  )
}
