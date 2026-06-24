'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter, redirect } from 'next/navigation'
import {
  ArrowLeft,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Check,
  Circle,
  Star,
  Shuffle,
  Search,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'

import { CustomProblemNotes } from '@/app/(student)/dashboard/custom-sheet/components/custom-problem-notes'
import { CustomTagManager } from '@/app/(student)/dashboard/custom-sheet/components/custom-tag-manager'
import { CustomProblemTimer } from '@/app/(student)/dashboard/custom-sheet/components/custom-problem-timer'

interface Problem {
  _id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  link: string
  status: 'TODO' | 'DONE'
  notes?: string
  solution?: string
  approach?: string
  tags?: string[]
  timeSpent?: number
}

export default function PatternDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [patternName, setPatternName] = useState('Loading...')
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [notFoundOrError, setNotFoundOrError] = useState(false)

  // Derived state for all available tags
  const allAvailableTags = useMemo(() => {
    const set = new Set<string>(['Revision', 'Important', 'Tricky', 'Optimize'])
    problems.forEach((p) => p.tags?.forEach((t) => set.add(t)))
    return Array.from(set)
  }, [problems])

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await fetch(
          `/api/custom-sheet/patterns/${params.id}/problems`
        )
        if (res.ok) {
          const data = await res.json()
          setPatternName(data.patternName)
          setProblems(data.problems)
        } else {
          if (res.status === 404) {
            toast.error('Pattern not found', {
              description: 'It may have been deleted.',
            })
            setNotFoundOrError(true)
            return
          }
          throw new Error('Failed to load')
        }
      } catch (error) {
        console.error('Failed to fetch problems', error)
        toast.error('Error loading pattern')
        setNotFoundOrError(true)
      } finally {
        setLoading(false)
      }
    }
    if (params.id) fetchProblems()
  }, [params.id, router])

  const updateProblemLocal = (id: string, updates: Partial<Problem>) => {
    setProblems((prev) =>
      prev.map((p) => (p._id === id ? { ...p, ...updates } : p))
    )
  }

  const syncUpdate = async (id: string, updates: Partial<Problem>) => {
    const previousProblem = problems.find((p) => p._id === id)
    updateProblemLocal(id, updates)
    try {
      await fetch(`/api/custom-sheet/problems/${id}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
    } catch (_e) {
      toast.error('Failed to save')
      if (previousProblem) {
        updateProblemLocal(id, previousProblem)
      }
    }
  }

  const toggleStatus = async (problemId: string) => {
    const problem = problems.find((p) => p._id === problemId)
    if (!problem) return

    const newStatus = problem.status === 'DONE' ? 'TODO' : 'DONE'
    updateProblemLocal(problemId, { status: newStatus })

    if (newStatus === 'DONE') {
      const pointsMap = { Easy: 50, Medium: 100, Hard: 200 }
      const points = pointsMap[problem.difficulty] || 50

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#facc15', '#f97316'],
      })

      toast.success(`Problem Solved!`, {
        description: `You earned ${points} XP. Great job!`,
        icon: (
          <div className="p-1 bg-green-500 rounded-full text-white">
            <Check className="h-3 w-3" />
          </div>
        ),
      })
    }

    try {
      const res = await fetch(
        `/api/custom-sheet/problems/${problemId}/toggle`,
        { method: 'POST' }
      )
      if (!res.ok) {
        throw new Error(res.statusText)
      }
    } catch (_e) {
      toast.error('Sync failed')
      updateProblemLocal(problemId, { status: problem.status }) // Revert
    }
  }

  const pickRandom = () => {
    const pending = problems.filter((p) => p.status === 'TODO')
    const pool = pending.length > 0 ? pending : problems
    if (pool.length === 0) return
    const random = pool[Math.floor(Math.random() * pool.length)]
    setExpandedId(random._id)
    setTimeout(() => {
      const el = document.getElementById(`problem-${random._id}`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
    toast.info(`Picked: ${random.title}`)
  }

  const filteredProblems = problems.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (notFoundOrError) {
    redirect('/dashboard/custom-sheet')
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    )

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto min-h-screen bg-background">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="pl-0 hover:bg-transparent hover:text-primary mb-2 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
          <h2 className="text-4xl font-black tracking-tight uppercase italic text-foreground">
            {patternName}
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            {problems.filter((p) => p.status === 'DONE').length} of{' '}
            {problems.length} problems solved
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-[200px] md:w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9 h-10 bg-muted/40"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            onClick={pickRandom}
            variant="outline"
            className="gap-2 font-bold uppercase italic tracking-wider h-10"
          >
            <Shuffle className="h-4 w-4" /> Random
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border/50">
              <TableHead className="w-10 px-2"></TableHead>
              <TableHead className="w-10 px-2 font-black uppercase tracking-wider text-[10px] text-foreground/70">
                #
              </TableHead>
              <TableHead className="font-black uppercase tracking-wider text-[10px] text-foreground/70">
                Problem
              </TableHead>
              <TableHead className="w-24 font-black uppercase tracking-wider text-[10px] text-foreground/70">
                Difficulty
              </TableHead>
              <TableHead className="w-32 font-black uppercase tracking-wider text-[10px] text-foreground/70">
                Timer
              </TableHead>
              <TableHead className="w-24 font-black uppercase tracking-wider text-[10px] text-foreground/70">
                Status
              </TableHead>
              <TableHead className="w-24 text-right font-black uppercase tracking-wider text-[10px] text-foreground/70">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProblems.map((problem, index) => (
              <React.Fragment key={problem._id}>
                <TableRow
                  id={`problem-${problem._id}`}
                  className={cn(
                    'group transition-colors cursor-pointer border-b border-border/50 last:border-0',
                    expandedId === problem._id && 'bg-muted/50'
                  )}
                  onClick={() =>
                    setExpandedId(
                      expandedId === problem._id ? null : problem._id
                    )
                  }
                >
                  <TableCell className="align-middle py-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      {expandedId === problem._id ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="text-muted-foreground px-2 align-middle py-4 font-bold text-xs">
                    {index + 1}
                  </TableCell>
                  <TableCell className="whitespace-normal py-4 min-w-[150px] md:min-w-[300px] align-middle">
                    <div className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm font-black leading-tight break-words flex-1 group-hover/row:text-primary transition-colors tracking-wide italic text-foreground">
                        {problem.title}
                      </span>
                      <a
                        href={problem.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-0.5"
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        'font-black uppercase text-[10px] h-5 tracking-tighter',
                        problem.difficulty === 'Easy' &&
                          'bg-green-500/10 text-green-500',
                        problem.difficulty === 'Medium' &&
                          'bg-yellow-500/10 text-yellow-500',
                        problem.difficulty === 'Hard' &&
                          'bg-red-500/10 text-red-500'
                      )}
                    >
                      {problem.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <CustomProblemTimer
                      problemId={problem._id}
                      initialTime={problem.timeSpent || 0} // Support timeSpent in future
                      onTimeUpdate={(id, time) =>
                        syncUpdate(id, { timeSpent: time })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {problem.status === 'DONE' ? (
                        <div className="flex items-center gap-1.5 text-green-500">
                          <Check className="h-4 w-4" />
                          <span className="text-sm font-black uppercase italic">
                            Solved
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Circle className="h-4 w-4" />
                          <span className="text-sm font-black uppercase italic">
                            Pending
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell
                    className="text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      size="sm"
                      variant={problem.status === 'DONE' ? 'ghost' : 'default'}
                      className={cn(
                        'h-8 font-black uppercase tracking-widest italic w-16',
                        problem.status === 'DONE'
                          ? 'text-muted-foreground'
                          : 'bg-orange-600 hover:bg-orange-700 text-white'
                      )}
                      onClick={() => toggleStatus(problem._id)}
                    >
                      {problem.status === 'DONE' ? 'Undo' : 'Done'}
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedId === problem._id && (
                  <TableRow className="bg-muted/30 hover:bg-muted/30 border-t-0">
                    <TableCell colSpan={7} className="p-0">
                      <div className="p-4 md:p-6 bg-card border-x border-b rounded-b-xl mx-4 mb-4 shadow-inner space-y-6">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-black text-muted-foreground uppercase tracking-wider">
                            Tags
                          </label>
                          <CustomTagManager
                            availableTags={allAvailableTags}
                            selectedTags={problem.tags || []}
                            onTagsChange={(tags) =>
                              syncUpdate(problem._id, { tags })
                            }
                            onCreateTag={(tag) =>
                              syncUpdate(problem._id, {
                                tags: [...(problem.tags || []), tag],
                              })
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-black text-muted-foreground uppercase tracking-wider">
                            Problem Details
                          </label>
                          <CustomProblemNotes
                            problemId={problem._id}
                            initialNotes={problem.notes || ''}
                            initialSolution={problem.solution || ''}
                            initialApproach={problem.approach || ''}
                            onSave={(id, data) => syncUpdate(id, data)}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
            {filteredProblems.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-20 text-muted-foreground font-bold italic uppercase"
                >
                  No problems found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
