'use client'

import { useEffect } from 'react'
import { useTrieStore } from '@/lib/store/trie-visualizer-store'
import { TrieCanvas } from '@/components/student/visualizer/tries/trie-canvas'
import { TrieControlDeck } from '@/components/student/visualizer/tries/trie-control-deck'
import { TrieCodeViewer } from '@/components/student/visualizer/tries/trie-code-viewer'
import { TrieExplanationPanel } from '@/components/student/visualizer/tries/trie-explanation-panel'
import { TrieComplexityCard } from '@/components/student/visualizer/tries/trie-complexity-card'
import { TrieInputControls } from '@/components/student/visualizer/tries/trie-input-controls'
import { VisualizerShell } from '@/components/student/visualizer/shared/visualizer-shell'
import { Network } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function TrieVisualizerPage() {
  const {
    algorithm,
    setAlgorithm,
    isPlaying,
    playbackSpeed,
    nextStep,
    currentFrame,
    frames,
  } = useTrieStore()

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (isPlaying) {
      interval = setInterval(() => nextStep(), 800 / playbackSpeed)
    }
    return () => clearInterval(interval)
  }, [isPlaying, playbackSpeed, nextStep])

  return (
    <VisualizerShell
      title="Trie Visualizer"
      titleShort="Trie Vis"
      subtitle="Prefix Tree • Autocomplete"
      icon={<Network className="h-3 w-3 text-white" />}
      themeColor="lime"
      selectionBg="selection:bg-lime-500/20"
      headerRight={
        <>
          <Select
            value={algorithm}
            onValueChange={(v) => setAlgorithm(v as any)}
          >
            <SelectTrigger className="w-[140px] h-9 bg-white/60 dark:bg-zinc-900/80 border-zinc-200 dark:border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TRIE_INSERT">Insert</SelectItem>
              <SelectItem value="TRIE_SEARCH">Search</SelectItem>
              <SelectItem value="TRIE_PREFIX">Prefix</SelectItem>
            </SelectContent>
          </Select>
          <TrieInputControls />
        </>
      }
      controlDeck={<TrieControlDeck />}
      explanationPanel={<TrieExplanationPanel />}
      sidebar={
        <>
          <TrieExplanationPanel />
          <TrieComplexityCard />
          <div className="flex-1 min-h-[300px] flex flex-col">
            <TrieCodeViewer />
          </div>
        </>
      }
      statusBar={
        frames.length > 0
          ? `Step ${currentFrame + 1} / ${frames.length}`
          : 'Ready'
      }
    >
      <TrieCanvas />
    </VisualizerShell>
  )
}
