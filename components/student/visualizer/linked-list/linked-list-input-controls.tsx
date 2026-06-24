import { useState } from 'react'
import { useLinkedListStore } from '@/lib/store/linked-list-visualizer-store'
import { Button } from '@/components/ui/button'
import {
  Plus,
  Shuffle,
  Settings2,
  Check,
  RotateCcw,
  Trash2,
} from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function LinkedListInputControls() {
  const { generateInput, addNode, reset, clearNodes } = useLinkedListStore()
  const [newValue, setNewValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const handleAdd = () => {
    const val = parseInt(newValue)
    if (!isNaN(val)) {
      addNode(val)
      setNewValue('')
      setIsOpen(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd()
    }
  }

  return (
    <div className="flex items-center gap-2 bg-white/60 dark:bg-zinc-900/80 p-1.5 rounded-2xl border border-zinc-200 dark:border-white/10 backdrop-blur-xl shadow-sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={generateInput}
        className="h-8 rounded-xl text-xs font-bold gap-2 hover:bg-purple-500/10 hover:text-purple-500 transition-all text-zinc-600 dark:text-zinc-400"
      >
        <Shuffle className="h-3 w-3" />
        Randomize
      </Button>

      <div className="w-[1px] h-4 bg-zinc-200 dark:bg-white/10" />

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-xl text-xs font-bold gap-2 hover:bg-purple-500/10 hover:text-purple-500 transition-all text-zinc-600 dark:text-zinc-400"
          >
            <Plus className="h-3 w-3" />
            Add Node
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-3" align="center" sideOffset={8}>
          <div className="flex gap-2">
            <Input
              placeholder="Value"
              type="number"
              className="h-8 text-xs"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              size="icon"
              className="h-8 w-8 shrink-0 bg-purple-500 hover:bg-purple-600"
              onClick={handleAdd}
            >
              <Check className="h-3 w-3 text-white" />
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <div className="w-[1px] h-4 bg-zinc-200 dark:bg-white/10" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-xl text-muted-foreground hover:bg-zinc-100 dark:hover:bg-white/10 transition-all"
          >
            <Settings2 className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Controls</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={reset} className="gap-2 cursor-pointer">
            <RotateCcw className="h-4 w-4" />
            Reset Animation
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={clearNodes}
            className="gap-2 text-red-500 focus:text-red-500 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            Clear List
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
