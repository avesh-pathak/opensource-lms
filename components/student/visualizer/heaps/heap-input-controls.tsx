'use client'

import { useHeapStore } from '@/lib/store/heap-visualizer-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Shuffle } from 'lucide-react'

export function HeapInputControls() {
  const {
    algorithm,
    setAlgorithm,
    heapType,
    setHeapType,
    generateInput,
    insertValue,
    setInsertValue,
    runInsert,
  } = useHeapStore()

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={heapType}
        onValueChange={(v) => setHeapType(v as 'min' | 'max')}
      >
        <SelectTrigger className="w-[120px] h-9 bg-white/60 dark:bg-zinc-900/80 border-zinc-200 dark:border-white/10">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="min">Min-Heap</SelectItem>
          <SelectItem value="max">Max-Heap</SelectItem>
        </SelectContent>
      </Select>

      <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as any)}>
        <SelectTrigger className="w-[160px] h-9 bg-white/60 dark:bg-zinc-900/80 border-zinc-200 dark:border-white/10">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="HEAP_INSERT">Insert</SelectItem>
          <SelectItem value="HEAP_HEAPIFY">Heapify</SelectItem>
          <SelectItem value="HEAP_BUILD">Build Heap</SelectItem>
        </SelectContent>
      </Select>

      {algorithm === 'HEAP_INSERT' && (
        <>
          <div className="flex items-center gap-2">
            <Label className="text-xs font-bold text-zinc-500 whitespace-nowrap">
              Value
            </Label>
            <Input
              type="number"
              value={insertValue}
              onChange={(e) => setInsertValue(Number(e.target.value) || 0)}
              className="w-20 h-9 font-mono text-sm"
            />
          </div>
          <Button
            size="sm"
            onClick={runInsert}
            className="bg-amber-500 hover:bg-amber-600"
          >
            Insert
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={generateInput}
        className="h-9 w-9 rounded-xl border-zinc-200 dark:border-white/10"
      >
        <Shuffle className="h-4 w-4" />
      </Button>
    </div>
  )
}
