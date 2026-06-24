'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Layers, Cpu, Brain, Zap, ArrowRight, Check, X } from 'lucide-react'

import { useSyncProgress } from '@/hooks/use-sync-progress'

interface GoalSelectorProps {
  onSelect: (goal: string) => void
  onDismiss?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function GoalSelector({
  onSelect,
  onDismiss,
  open: externalOpen,
  onOpenChange,
}: GoalSelectorProps) {
  const { userGoal } = useSyncProgress()
  const [internalOpen, setInternalOpen] = useState(false)
  const open = externalOpen !== undefined ? externalOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)

  useEffect(() => {
    if (!userGoal && externalOpen === undefined) {
      setOpen(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userGoal, externalOpen])

  const goals = [
    {
      id: 'DSA',
      title: 'DSA Patterns',
      description:
        'Master algorithms & problem solving for top-tier interviews.',
      icon: Layers,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      border: 'group-hover:border-blue-500/50',
    },
    {
      id: 'Core Engineering',
      title: 'Core Engineering',
      description: 'Deep dive into OS, DBMS, Networks, and System Design.',
      icon: Cpu,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      border: 'group-hover:border-orange-500/50',
    },
    {
      id: 'AI/ML',
      title: 'AI & Machine Learning',
      description: 'Build intelligence with Neural Networks and Modern AI.',
      icon: Brain,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      border: 'group-hover:border-purple-500/50',
    },
  ]

  const handleConfirm = () => {
    if (selectedGoal) {
      onSelect(selectedGoal)
      setOpen(false)
    }
  }

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss()
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[500px] border border-border/10 bg-background/95 backdrop-blur-3xl text-foreground p-0 gap-0 overflow-hidden shadow-2xl rounded-[32px]"
      >
        {/* Header Background */}
        <div className="relative h-44 w-full flex items-center justify-center overflow-hidden border-b border-border/10">
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/20 hover:bg-black/40 text-zinc-400 hover:text-white transition-all backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className="absolute inset-0 opacity-[0.1]"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

          <div className="relative z-10 space-y-4 text-center">
            <div className="mx-auto w-16 h-16 rounded-3xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.1)]">
              <Zap className="h-8 w-8 text-orange-500 animate-pulse" />
            </div>
            <div className="space-y-1 px-8">
              <DialogTitle className="text-4xl font-black italic uppercase tracking-tighter text-center">
                Choose Your <span className="text-orange-500">Objective</span>
              </DialogTitle>
              <DialogDescription className="text-center font-bold text-zinc-500 text-xs uppercase tracking-widest leading-relaxed">
                Personalized mission path for elite builders
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="px-10 py-10 space-y-6">
          <div className="grid gap-3">
            {goals.map((goal) => (
              <button
                key={goal.id}
                onClick={() => setSelectedGoal(goal.id)}
                className={cn(
                  'group relative flex items-center gap-5 p-5 rounded-2xl border transition-all text-left overflow-hidden',
                  selectedGoal === goal.id
                    ? 'bg-secondary/20 border-orange-500/50 shadow-lg scale-[1.02]'
                    : 'bg-transparent border-border/10 hover:bg-secondary/20 active:scale-95'
                )}
              >
                {selectedGoal === goal.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent pointer-events-none" />
                )}
                <div
                  className={cn(
                    'shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110',
                    goal.bg,
                    goal.color,
                    'border border-border/10'
                  )}
                >
                  <goal.icon className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <h3 className="font-black italic uppercase tracking-tight text-[11px] group-hover:text-orange-500 transition-colors">
                    {goal.title}
                  </h3>
                  <p className="text-[10px] font-bold text-zinc-500 leading-tight uppercase tracking-tight line-clamp-2">
                    {goal.description}
                  </p>
                </div>
                {selectedGoal === goal.id && (
                  <div className="h-6 w-6 rounded-full bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 animate-in zoom-in-50 duration-300">
                    <Check className="h-3.5 w-3.5 text-white stroke-[4]" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="space-y-4 pt-2">
            <Button
              onClick={handleConfirm}
              disabled={!selectedGoal}
              className="w-full h-14 rounded-2xl font-black italic uppercase tracking-[0.2em] text-xs bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg"
            >
              Initialize Mission
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <button
              onClick={handleDismiss}
              className="w-full text-[10px] text-zinc-600 hover:text-orange-500 transition-colors font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2"
            >
              <span className="w-1 h-1 rounded-full bg-zinc-800" />
              Maybe later, don&apos;t show again
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
