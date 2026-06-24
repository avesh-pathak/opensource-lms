'use client'

import { useEffect } from 'react'
import { useHeapStore } from '@/lib/store/heap-visualizer-store'
import { HeapCanvas } from '@/components/student/visualizer/heaps/heap-canvas'
import { HeapControlDeck } from '@/components/student/visualizer/heaps/heap-control-deck'
import { HeapCodeViewer } from '@/components/student/visualizer/heaps/heap-code-viewer'
import { HeapExplanationPanel } from '@/components/student/visualizer/heaps/heap-explanation-panel'
import { HeapComplexityCard } from '@/components/student/visualizer/heaps/heap-complexity-card'
import { HeapInputControls } from '@/components/student/visualizer/heaps/heap-input-controls'
import { VisualizerShell } from '@/components/student/visualizer/shared/visualizer-shell'
import { Layers } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function HeapVisualizerPage() {
  const {
    algorithm,
    setAlgorithm,
    generateInput,
    isPlaying,
    playbackSpeed,
    nextStep,
    currentFrame,
    frames,
  } = useHeapStore()

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
      title="Heap Visualizer"
      titleShort="Heap Vis"
      subtitle="Min-Heap • Max-Heap • Priority"
      icon={<Layers className="h-3 w-3 text-white" />}
      themeColor="amber"
      selectionBg="selection:bg-amber-500/20"
      headerRight={
        <>
          <Select
            value={algorithm}
            onValueChange={(v) => setAlgorithm(v as any)}
          >
            <SelectTrigger className="w-[180px] h-9 bg-white/60 dark:bg-zinc-900/80 border-zinc-200 dark:border-white/10">
              <SelectValue placeholder="Operation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HEAP_INSERT">Insert</SelectItem>
              <SelectItem value="HEAP_HEAPIFY">Heapify</SelectItem>
              <SelectItem value="HEAP_BUILD">Build Heap</SelectItem>
            </SelectContent>
          </Select>
          <HeapInputControls />
        </>
      }
      controlDeck={<HeapControlDeck />}
      explanationPanel={<HeapExplanationPanel />}
      sidebar={
        <>
          <HeapExplanationPanel />
          <HeapComplexityCard />
          <div className="flex-1 min-h-[300px] flex flex-col">
            <HeapCodeViewer />
          </div>
        </>
      }
      statusBar={
        frames.length > 0
          ? `Step ${currentFrame + 1} / ${frames.length}`
          : 'Ready'
      }
    >
      <HeapCanvas />
    </VisualizerShell>
  )
}
