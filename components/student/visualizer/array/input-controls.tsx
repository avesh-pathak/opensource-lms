'use client'

import { useState } from 'react'
import { useVisualizerStore } from '@/lib/store/array-visualizer-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Settings, RefreshCw, Search } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

interface InputControlsProps {
  hideTarget?: boolean
}

export function InputControls({ hideTarget = false }: InputControlsProps) {
  const { setCustomArray, setTarget, generateArray, algorithm } =
    useVisualizerStore()
  const [arrayInput, setArrayInput] = useState('')
  const [targetInput, setTargetInput] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const handleArraySubmit = () => {
    const arr = arrayInput
      .split(',')
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n))

    if (arr.length > 0) {
      setCustomArray(arr)
      setIsOpen(false)
      setArrayInput('')
    }
  }

  const handleTargetSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const t = parseInt(targetInput)
    if (!isNaN(t)) {
      setTarget(t)
      setTargetInput('')
    }
  }

  return (
    <div className="flex items-center gap-2 md:gap-3 bg-white/40 dark:bg-zinc-900/80 p-1 md:p-1.5 rounded-xl border border-white/20 dark:border-white/10 backdrop-blur-sm shadow-sm">
      {/* Target Input */}
      {/* Target Input - Only for Searching */}
      {!hideTarget &&
        ![
          'BUBBLE_SORT',
          'SELECTION_SORT',
          'INSERTION_SORT',
          'MERGE_SORT',
          'QUICK_SORT',
        ].includes(algorithm) && (
          <form onSubmit={handleTargetSubmit} className="flex items-center">
            <div className="relative group">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 group-focus-within:text-orange-500 transition-colors" />
              <Input
                placeholder="Target..."
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                className="h-8 w-[90px] md:w-[140px] pl-8 text-xs bg-white/80 dark:bg-black/20 border-white/20 hover:border-orange-500/30 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-orange-500/50 font-medium transition-all"
              />
            </div>
          </form>
        )}

      <div className="h-4 w-px bg-zinc-300 dark:bg-white/10" />

      {/* Config Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 md:px-3 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-orange-500/10 hover:text-orange-600 transition-colors gap-2"
          >
            <Settings className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Custom Array</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Configure Array</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="array">Custom Array (comma separated)</Label>
              <Textarea
                id="array"
                placeholder="10, 20, 30, 40..."
                value={arrayInput}
                onChange={(e) => setArrayInput(e.target.value)}
                className="font-mono text-xs"
                rows={4}
              />
              <p className="text-[10px] text-muted-foreground">
                Values will be automatically sorted for Binary Search
                compatibility.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleArraySubmit}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Apply Array
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Refresh Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={generateArray}
        className="h-8 w-8 text-zinc-400 hover:text-orange-500 hover:bg-orange-500/10 rounded-lg transition-colors"
        title="Generate Random Array"
      >
        <RefreshCw className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
