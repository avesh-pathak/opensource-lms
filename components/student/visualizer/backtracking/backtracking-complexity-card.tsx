'use client'

export function BacktrackingComplexityCard() {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 p-4 shadow-sm">
      <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-3">
        Subsets
      </h4>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase">
            Time
          </span>
          <p className="font-mono font-black text-red-600 dark:text-red-400">
            O(2^n)
          </p>
        </div>
        <div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase">
            Space
          </span>
          <p className="font-mono font-black text-zinc-700 dark:text-zinc-300">
            O(n)
          </p>
        </div>
      </div>
    </div>
  )
}
