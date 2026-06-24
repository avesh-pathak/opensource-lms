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
import { Settings, RefreshCw, Type } from 'lucide-react'
import { generatePalindromeCheckFrames } from '@/lib/algorithms/string/palindrome'
import { generateReverseStringFrames } from '@/lib/algorithms/string/reverse'
import { generateLongestSubstringFrames } from '@/lib/algorithms/string/sliding-window'
import { generateLongestPalindromicSubstringFrames } from '@/lib/algorithms/string/longest-palindromic-substring'
import { generateCountPalindromicSubstringsFrames } from '@/lib/algorithms/string/count-palindromic-substrings'
import { generateLCSFrames } from '@/lib/algorithms/string/lcs'

export function StringInputControls() {
  const { setArray, setFrames, generateArray, algorithm } = useVisualizerStore()
  const [stringInput, setStringInput] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const handleStringSubmit = () => {
    if (!stringInput.trim()) return

    const text = stringInput.trim().toUpperCase() // Normalize to uppercase
    const charArray = text.split('')

    // Generate frames based on current algorithm
    let frames: any[] = []

    switch (algorithm) {
      case 'PALINDROME_CHECK':
        frames = generatePalindromeCheckFrames(charArray)
        break
      case 'REVERSE_STRING':
        frames = generateReverseStringFrames(charArray)
        break
      case 'LONGEST_SUBSTRING':
        frames = generateLongestSubstringFrames(text)
        break
      case 'LONGEST_PALINDROMIC_SUBSTRING':
        frames = generateLongestPalindromicSubstringFrames(text)
        break
      case 'COUNT_PALINDROMIC_SUBSTRINGS':
        frames = generateCountPalindromicSubstringsFrames(text)
        break
      case 'LONGEST_COMMON_SUBSEQUENCE':
        // Expecting input with '|', if not present, maybe we can't do much or just treat whole string as one (will fail)
        // Or we could auto-split? Let's assume user knows or add hint.
        frames = generateLCSFrames(charArray)
        break
      default:
        // Fallback using palindrome check (safe default or empty)
        frames = generatePalindromeCheckFrames(charArray)
        break
    }

    // @ts-expect-error - dynamic property access
    setArray(charArray)
    setFrames(frames)
    setIsOpen(false)
    setStringInput('')
  }

  return (
    <div className="flex items-center gap-2 md:gap-3 bg-white/40 dark:bg-zinc-900/80 p-1 md:p-1.5 rounded-xl border border-white/20 dark:border-white/10 backdrop-blur-sm shadow-sm">
      {/* Custom String Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 md:px-3 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-pink-500/10 hover:text-pink-600 transition-colors gap-2"
          >
            <Settings className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Custom Text</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Input Custom String</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="string-input">Enter Text</Label>
              <div className="relative">
                <Type className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                  id="string-input"
                  placeholder="e.g. RACECAR"
                  value={stringInput}
                  onChange={(e) => setStringInput(e.target.value)}
                  className="pl-9 font-mono uppercase"
                  maxLength={12} // Limit length for visualization
                  autoComplete="off"
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                Max 12 characters. Use &apos;|&apos; separator for LCS (e.g.
                ABC|DEF).
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleStringSubmit}
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              Visualize
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="h-4 w-px bg-zinc-300 dark:bg-white/10" />

      {/* Refresh Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={generateArray}
        className="h-8 w-8 text-zinc-400 hover:text-pink-500 hover:bg-pink-500/10 rounded-lg transition-colors"
        title="Generate Random String"
      >
        <RefreshCw className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
