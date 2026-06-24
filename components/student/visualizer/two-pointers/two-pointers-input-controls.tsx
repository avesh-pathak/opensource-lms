'use client'

import { useTwoPointersStore } from '@/lib/store/two-pointers-visualizer-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Shuffle } from 'lucide-react'

export function TwoPointersInputControls() {
  const {
    algorithm,
    target,
    inputString,
    inputArray: _inputArray,
    setTarget,
    setInputString,
    setInputArray,
    generateInput,
  } = useTwoPointersStore()

  const handleRandomize = () => {
    if (
      algorithm === 'TP_TWO_SUM_SORTED' ||
      algorithm === 'TP_SORT_COLORS' ||
      algorithm === 'TP_CONTAINER'
    ) {
      if (algorithm === 'TP_TWO_SUM_SORTED') {
        const arr = Array.from(
          { length: 6 },
          () => Math.floor(Math.random() * 20) + 1
        ).sort((a, b) => a - b)
        setInputArray(arr)
      } else if (algorithm === 'TP_SORT_COLORS') {
        setInputArray(
          Array.from({ length: 8 }, () => Math.floor(Math.random() * 3))
        )
      } else {
        setInputArray(
          Array.from({ length: 8 }, () => Math.floor(Math.random() * 10) + 1)
        )
      }
    } else if (algorithm === 'TP_PALINDROME') {
      const pool = 'abcdefgh'
      const len = 5 + Math.floor(Math.random() * 4)
      let s = ''
      for (let i = 0; i < len; i++)
        s += pool[Math.floor(Math.random() * pool.length)]
      setInputString(s)
    }
    setTimeout(generateInput, 0)
  }

  return (
    <div className="flex flex-wrap items-center gap-2 bg-white/40 dark:bg-white/5 p-1.5 rounded-2xl border border-zinc-200 dark:border-white/10 backdrop-blur-sm">
      {algorithm === 'TP_TWO_SUM_SORTED' && (
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase text-zinc-500">
            target
          </span>
          <Input
            type="number"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value) || 0)}
            onBlur={() => generateInput()}
            className="w-16 h-8 text-xs font-mono"
          />
        </div>
      )}

      {algorithm === 'TP_PALINDROME' && (
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase text-zinc-500">
            s
          </span>
          <Input
            type="text"
            value={inputString}
            onChange={(e) => setInputString(e.target.value)}
            onBlur={() => generateInput()}
            placeholder="racecar"
            className="w-28 h-8 text-xs font-mono"
          />
        </div>
      )}

      <div className="w-[1px] h-4 bg-zinc-200 dark:bg-white/10" />

      <Button
        variant="ghost"
        size="sm"
        onClick={handleRandomize}
        className="h-8 rounded-xl text-xs font-bold gap-2 hover:bg-zinc-500/10 hover:text-zinc-600 transition-all"
      >
        <Shuffle className="h-3 w-3" />
        Randomize
      </Button>
    </div>
  )
}
