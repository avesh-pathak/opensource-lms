'use client'

import { useTreeStore } from '@/lib/store/tree-visualizer-store'
import { Button } from '@/components/ui/button'
import { Plus, Shuffle, Settings2 } from 'lucide-react'

export function TreeInputControls() {
  const { generateInput } = useTreeStore()

  return (
    <div className="flex items-center gap-2 bg-white/40 dark:bg-white/5 p-1.5 rounded-2xl border border-zinc-200 dark:border-white/10 backdrop-blur-sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={generateInput}
        className="h-8 rounded-xl text-xs font-bold gap-2 hover:bg-emerald-500/10 hover:text-emerald-500 transition-all"
      >
        <Shuffle className="h-3 w-3" />
        Randomize Tree
      </Button>

      <div className="w-[1px] h-4 bg-zinc-200 dark:bg-white/10" />

      <Button
        variant="ghost"
        size="sm"
        disabled
        className="h-8 rounded-xl text-xs font-bold gap-2 hover:bg-emerald-500/10 hover:text-emerald-500 transition-all"
      >
        <Plus className="h-3 w-3" />
        Add Node
      </Button>

      <div className="w-[1px] h-4 bg-zinc-200 dark:bg-white/10" />

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-xl text-muted-foreground hover:bg-zinc-100 dark:hover:bg-white/10 transition-all"
      >
        <Settings2 className="h-3 w-3" />
      </Button>
    </div>
  )
}
