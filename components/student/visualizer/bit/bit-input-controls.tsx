'use client'

import { useBitStore } from '@/lib/store/bit-visualizer-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function BitInputControls() {
  const { algorithm, setAlgorithm, a, b, setA, setB, generateInput } =
    useBitStore()

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as any)}>
        <SelectTrigger className="w-[140px] h-9 bg-white/60 dark:bg-zinc-900/80 border-zinc-200 dark:border-white/10">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="BIT_AND_OR_XOR">AND / OR / XOR</SelectItem>
          <SelectItem value="BIT_SHIFTS">Shifts</SelectItem>
          <SelectItem value="BIT_MASK">Mask</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="number"
        min={0}
        max={255}
        value={a}
        onChange={(e) => setA(Number(e.target.value) || 0)}
        className="w-16 h-9 font-mono text-sm"
      />
      <Input
        type="number"
        min={0}
        max={255}
        value={b}
        onChange={(e) => setB(Number(e.target.value) || 0)}
        className="w-16 h-9 font-mono text-sm"
      />
      <Button
        size="sm"
        onClick={generateInput}
        className="bg-sky-500 hover:bg-sky-600"
      >
        Generate
      </Button>
    </div>
  )
}
