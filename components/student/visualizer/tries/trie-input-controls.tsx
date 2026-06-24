'use client'

import { useTrieStore } from '@/lib/store/trie-visualizer-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function TrieInputControls() {
  const { algorithm, setAlgorithm, currentWord, setCurrentWord, runOperation } =
    useTrieStore()

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as any)}>
        <SelectTrigger className="w-[130px] h-9 bg-white/60 dark:bg-zinc-900/80 border-zinc-200 dark:border-white/10">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="TRIE_INSERT">Insert</SelectItem>
          <SelectItem value="TRIE_SEARCH">Search</SelectItem>
          <SelectItem value="TRIE_PREFIX">Prefix</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="text"
        value={currentWord}
        onChange={(e) => setCurrentWord(e.target.value)}
        placeholder="Word"
        className="w-28 h-9 font-mono text-sm"
      />
      <Button
        size="sm"
        onClick={runOperation}
        className="bg-lime-500 hover:bg-lime-600"
      >
        Run
      </Button>
    </div>
  )
}
