'use client'

import { useGraphStore } from '@/lib/store/graph-visualizer-store'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function GraphInputControls() {
  const {
    algorithm,
    setAlgorithm,
    startNodeId,
    setStartNodeId,
    generateInput,
    nodes,
  } = useGraphStore()

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as any)}>
        <SelectTrigger className="w-[140px] h-9 bg-white/60 dark:bg-zinc-900/80 border-zinc-200 dark:border-white/10">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="GRAPH_BFS">BFS</SelectItem>
          <SelectItem value="GRAPH_DFS">DFS</SelectItem>
          <SelectItem value="GRAPH_DIJKSTRA">Dijkstra</SelectItem>
        </SelectContent>
      </Select>
      <Select value={startNodeId} onValueChange={(v) => setStartNodeId(v)}>
        <SelectTrigger className="w-[100px] h-9 bg-white/60 dark:bg-zinc-900/80 border-zinc-200 dark:border-white/10">
          <SelectValue placeholder="Start" />
        </SelectTrigger>
        <SelectContent>
          {nodes.map((n) => (
            <SelectItem key={n.id} value={n.id}>
              {n.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        size="sm"
        onClick={generateInput}
        className="bg-fuchsia-500 hover:bg-fuchsia-600"
      >
        Generate
      </Button>
    </div>
  )
}
