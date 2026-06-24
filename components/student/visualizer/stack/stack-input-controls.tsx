'use client'

import { useState } from 'react'
import { useStackStore } from '@/lib/store/stack-visualizer-store'
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
import { Settings, RefreshCw, Type } from 'lucide-react'

export function StackInputControls() {
  const { setStack, generateInput, algorithm } = useStackStore()
  const [stringInput, setStringInput] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (stringInput.trim()) {
      setStack(stringInput.split(''))
      setIsOpen(false)
      setStringInput('')
    }
  }

  return (
    <div className="flex items-center gap-2 md:gap-3 bg-white/40 dark:bg-zinc-900/80 p-1 md:p-1.5 rounded-xl border border-white/20 dark:border-white/10 backdrop-blur-sm shadow-sm">
      {/* Input Label/Icon */}
      <div className="flex items-center gap-2 px-2 text-zinc-400">
        <Type className="h-3.5 w-3.5" />
        <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">
          Input Mode
        </span>
      </div>

      <div className="h-4 w-px bg-zinc-300 dark:bg-white/10" />

      {/* Config Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 md:px-3 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-indigo-500/10 hover:text-indigo-600 transition-colors gap-2"
          >
            <Settings className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Custom Input</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Configure Stack Input</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleInputSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="input">
                {algorithm === 'VALID_PARENTHESES'
                  ? 'Parentheses String'
                  : 'String Input'}
              </Label>
              <Input
                id="input"
                placeholder={
                  algorithm === 'VALID_PARENTHESES'
                    ? '(([]))'
                    : 'Enter characters...'
                }
                value={stringInput}
                onChange={(e) => setStringInput(e.target.value)}
                className="font-mono text-xs"
              />
              {algorithm === 'VALID_PARENTHESES' && (
                <p className="text-[10px] text-muted-foreground">
                  Use &apos;(&apos;, &apos;)&apos;, &apos;[&apos;,
                  &apos;]&apos;, &apos;&#123;&apos;, &apos;&#125;&apos; for
                  validation.
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Apply Input
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Refresh Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={generateInput}
        className="h-8 w-8 text-zinc-400 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-lg transition-colors"
        title="Generate Random Input"
      >
        <RefreshCw className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
