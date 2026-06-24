'use client'

import { useDPStore } from '@/lib/store/dp-visualizer-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function DPInputControls() {
  const { algorithm, setAlgorithm, n, setN, generateInput } = useDPStore()

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as any)}>
        <SelectTrigger className="w-[180px] h-9 bg-white/60 dark:bg-zinc-900/80 border-zinc-200 dark:border-white/10">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="DP_FIBONACCI">Fibonacci</SelectItem>
          <SelectItem value="DP_CLIMB_STAIRS">Climbing Stairs</SelectItem>
          <SelectItem value="DP_KNAPSACK">Knapsack</SelectItem>
        </SelectContent>
      </Select>
      {algorithm === 'DP_FIBONACCI' && (
        <>
          <Input
            type="number"
            min={0}
            max={20}
            value={n}
            onChange={(e) => setN(Number(e.target.value) || 0)}
            className="w-16 h-9 font-mono text-sm"
          />
          <Button
            size="sm"
            onClick={generateInput}
            className="bg-violet-500 hover:bg-violet-600"
          >
            Generate
          </Button>
        </>
      )}
    </div>
  )
}
