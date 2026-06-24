'use client'

const C = { time: 'O(V + E)', space: 'O(V)' }

export function GraphComplexityCard() {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 p-4 shadow-sm">
      <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-3">
        BFS Complexity
      </h4>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase">
            Time
          </span>
          <p className="font-mono font-black text-fuchsia-600 dark:text-fuchsia-400">
            {C.time}
          </p>
        </div>
        <div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase">
            Space
          </span>
          <p className="font-mono font-black text-zinc-700 dark:text-zinc-300">
            {C.space}
          </p>
        </div>
      </div>
    </div>
  )
}
