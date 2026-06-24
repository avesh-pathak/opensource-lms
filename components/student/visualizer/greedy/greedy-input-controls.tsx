'use client'

import { useGreedyStore } from '@/lib/store/greedy-visualizer-store'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function GreedyInputControls() {
  const { algorithm, setAlgorithm, generateInput } = useGreedyStore()

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as any)}>
        <SelectTrigger className="w-[180px] h-9 bg-white/60 dark:bg-zinc-900/80 border-zinc-200 dark:border-white/10">
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
      <Button
        size="sm"
        onClick={generateInput}
        className="bg-teal-500 hover:bg-teal-600"
      >
        Generate
      </Button>
    </div>
  )
}
