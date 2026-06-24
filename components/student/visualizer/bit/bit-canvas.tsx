'use client'

import { useBitStore } from '@/lib/store/bit-visualizer-store'
import { cn } from '@/lib/utils'

export function BitCanvas() {
  const { frames, currentFrame } = useBitStore()
  const frame = frames[currentFrame]

  if (!frame) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-zinc-500 text-sm font-black uppercase tracking-[0.2em]">
          Set A, B and click Generate
        </p>
      </div>
    )
  }

  const renderBinary = (bin: string, label: string) => (
    <div className="flex flex-col gap-1 items-center">
      <span className="text-[10px] font-bold uppercase text-zinc-500">
        {label}
      </span>
      <div className="flex gap-0.5">
        {bin.split('').map((bit, i) => (
          <div
            key={i}
            className={cn(
              'w-8 h-10 rounded border-2 flex items-center justify-center font-mono text-sm font-black',
              bit === '1'
                ? 'border-sky-500 bg-sky-500 text-white'
                : 'border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800 text-zinc-500'
            )}
          >
            {bit}
          </div>
        ))}
      </div>
      <span className="text-xs font-mono text-zinc-500">
        {label === 'A' ? frame.a : label === 'B' ? frame.b : frame.result}{' '}
        (decimal)
      </span>
    </div>
  )

  return (
    <div className="flex flex-col items-center justify-center gap-10 p-8 w-full h-full">
      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        {frame.op} — Bitwise operation
      </span>
      <div className="flex flex-wrap justify-center gap-12">
        {renderBinary(frame.binaryA, 'A')}
        <div className="flex items-center text-2xl font-black text-sky-500">
          {frame.op}
        </div>
        {renderBinary(frame.binaryB, 'B')}
        <div className="flex items-center text-xl text-zinc-400">=</div>
        {renderBinary(frame.binaryResult, 'Result')}
      </div>
    </div>
  )
}
