'use client'

import { useTrieStore } from '@/lib/store/trie-visualizer-store'

const COMPLEXITY: Record<string, { time: string; space: string }> = {
  TRIE_INSERT: { time: 'O(m)', space: 'O(m)' },
  TRIE_SEARCH: { time: 'O(m)', space: 'O(1)' },
  TRIE_PREFIX: { time: 'O(m)', space: 'O(1)' },
  TRIE_DELETE: { time: 'O(m)', space: 'O(1)' },
}

export function TrieComplexityCard() {
  const { algorithm } = useTrieStore()
  const c = COMPLEXITY[algorithm] ?? { time: 'O(m)', space: 'O(m)' }

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 p-4 shadow-sm">
      <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-3">
        Complexity (m = word length)
      </h4>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase">
            Time
          </span>
          <p className="font-mono font-black text-lime-600 dark:text-lime-400">
            {c.time}
          </p>
        </div>
        <div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase">
            Space
          </span>
          <p className="font-mono font-black text-zinc-700 dark:text-zinc-300">
            {c.space}
          </p>
        </div>
      </div>
    </div>
  )
}
