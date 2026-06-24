'use client'

import { useBacktrackingStore } from '@/lib/store/backtracking-visualizer-store'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function BacktrackingInputControls() {
  const { algorithm, setAlgorithm, generateInput } = useBacktrackingStore()

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as any)}>
        <SelectTrigger className="w-[160px] h-9 bg-white/60 dark:bg-zinc-900/80 border-zinc-200 dark:border-white/10">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="BT_SUBSETS">Subsets</SelectItem>
          <SelectItem value="BT_PERMUTATIONS">Permutations</SelectItem>
          <SelectItem value="BT_N_QUEENS">N-Queens</SelectItem>
        </SelectContent>
      </Select>
      <Button
        size="sm"
        onClick={generateInput}
        className="bg-red-500 hover:bg-red-600"
      >
        Generate
      </Button>
    </div>
  )
}
