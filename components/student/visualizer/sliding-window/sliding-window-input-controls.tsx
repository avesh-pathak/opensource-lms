'use client'

import { useSlidingWindowStore } from '@/lib/store/sliding-window-visualizer-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Shuffle } from 'lucide-react'

export function SlidingWindowInputControls() {
  const {
    algorithm,
    k,
    target,
    inputString,
    inputArray: _inputArray,
    setK,
    setTarget,
    setInputString,
    setInputArray,
    generateInput,
  } = useSlidingWindowStore()

  const handleRandomize = () => {
    if (algorithm === 'SW_MAX_SUM' || algorithm === 'SW_MIN_SIZE_SUBARRAY') {
      setInputArray(
        Array.from(
          { length: 6 + Math.floor(Math.random() * 4) },
          () => Math.floor(Math.random() * 10) + 1
        )
      )
    } else if (algorithm === 'SW_LONGEST_SUBSTRING') {
      const chars = 'abcdefgh'
      setInputString(
        Array.from(
          { length: 6 + Math.floor(Math.random() * 4) },
          () => chars[Math.floor(Math.random() * chars.length)]
        ).join('')
      )
    }
    setTimeout(generateInput, 0)
  }

  return (
    <div className="flex flex-wrap items-center gap-2 bg-white/40 dark:bg-white/5 p-1.5 rounded-2xl border border-zinc-200 dark:border-white/10 backdrop-blur-sm">
      {(algorithm === 'SW_MAX_SUM' || algorithm === 'SW_MIN_SIZE_SUBARRAY') && (
        <>
          {algorithm === 'SW_MAX_SUM' && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase text-zinc-500">
                k
              </span>
              <Input
                type="number"
                min={1}
                max={20}
                value={k}
                onChange={(e) => setK(Number(e.target.value) || 1)}
                onBlur={() => generateInput()}
                className="w-14 h-8 text-xs font-mono"
              />
            </div>
          )}
          {algorithm === 'SW_MIN_SIZE_SUBARRAY' && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase text-zinc-500">
                target
              </span>
              <Input
                type="number"
                min={1}
                value={target}
                onChange={(e) => setTarget(Number(e.target.value) || 1)}
                onBlur={() => generateInput()}
                className="w-16 h-8 text-xs font-mono"
              />
            </div>
          )}
        </>
      )}

      {algorithm === 'SW_LONGEST_SUBSTRING' && (
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase text-zinc-500">
            s
          </span>
          <Input
            type="text"
            value={inputString}
            onChange={(e) => setInputString(e.target.value)}
            onBlur={() => generateInput()}
            placeholder="abcabcbb"
            className="w-28 h-8 text-xs font-mono"
          />
        </div>
      )}

      <div className="w-[1px] h-4 bg-zinc-200 dark:bg-white/10" />

      <Button
        variant="ghost"
        size="sm"
        onClick={handleRandomize}
        className="h-8 rounded-xl text-xs font-bold gap-2 hover:bg-yellow-500/10 hover:text-yellow-500 transition-all"
      >
        <Shuffle className="h-3 w-3" />
        Randomize
      </Button>
    </div>
  )
}
