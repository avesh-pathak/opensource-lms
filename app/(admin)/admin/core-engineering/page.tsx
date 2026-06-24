'use client'

import { useState, useEffect, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Code2,
  Edit3,
  Trash2,
  Plus,
  ChevronRight,
  Layers,
  BookOpen,
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { useDemoAction } from '@/hooks/use-demo-action'

interface Pattern {
  _id: string
  name: string
  slug: string
  description?: string
  problemCount?: number
  domain?: string
  subject?: string
}

interface Problem {
  _id: string
  title: string
  category: string
  difficulty: string
}

export default function CoreEngineeringPage() {
  const { isDemoRestricted } = useDemoAction()
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [problems, setProblems] = useState<Problem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchData()

    // Poll every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const [patternsRes, problemsRes] = await Promise.all([
        fetch('/api/admin/patterns'),
        fetch('/api/admin/problems'),
      ])

      if (patternsRes.ok) setPatterns(await patternsRes.json())
      if (problemsRes.ok) setProblems(await problemsRes.json())
    } catch (_error) {
      console.error('Failed to fetch data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePattern = async (id: string, name: string) => {
    if (isDemoRestricted()) return
    if (
      !confirm(
        `Delete pattern "${name}"? Problems linked to this pattern will become unlinked.`
      )
    ) {
      return
    }

    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/patterns?id=${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        toast.success(`"${name}" deleted`)
        setPatterns(patterns.filter((p) => p._id !== id))
      } else {
        toast.error('Failed to delete pattern')
      }
    } catch (_error) {
      toast.error('Failed to delete pattern')
    } finally {
      setDeletingId(null)
    }
  }

  // Group patterns by subject
  const groupedPatterns = useMemo(() => {
    const groups: Record<string, Pattern[]> = {}
    patterns.forEach((p) => {
      const subject = p.subject || p.domain || 'General'
      if (!groups[subject]) groups[subject] = []
      groups[subject].push(p)
    })
    return groups
  }, [patterns])

  // Count problems per pattern (using category field)
  const problemCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    problems.forEach((p) => {
      const cat = p.category?.toLowerCase()
      patterns.forEach((pat) => {
        if (
          pat.name?.toLowerCase() === cat ||
          pat.slug?.toLowerCase() === cat
        ) {
          counts[pat._id] = (counts[pat._id] || 0) + 1
        }
      })
    })
    return counts
  }, [problems, patterns])

  // Stats
  const totalPatterns = patterns.length
  const totalProblems = problems.length

  if (isLoading) {
    return (
      <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={_?.id || _?._id || i}
                className="h-44 bg-muted rounded-[24px]"
              ></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-foreground flex items-center gap-3">
            <Code2 className="h-8 w-8 text-primary" />
            Core Engineering
          </h1>
          <p className="text-muted-foreground font-medium">
            Manage pattern cards and problems. Same view as student dashboard.
          </p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          {/* Stats */}
          <div className="flex items-center gap-2 bg-card/50 border border-border/50 rounded-xl px-4 py-2">
            <Layers className="h-4 w-4 text-primary" />
            <span className="font-black">{totalPatterns}</span>
            <span className="text-xs text-muted-foreground">Patterns</span>
          </div>
          <div className="flex items-center gap-2 bg-card/50 border border-border/50 rounded-xl px-4 py-2">
            <BookOpen className="h-4 w-4 text-purple-500" />
            <span className="font-black">{totalProblems}</span>
            <span className="text-xs text-muted-foreground">Problems</span>
          </div>
          <Link href="/admin/patterns">
            <Button className="h-11 px-5 rounded-2xl font-black italic uppercase tracking-wider">
              <Plus className="mr-2 h-4 w-4" /> New Pattern
            </Button>
          </Link>
        </div>
      </div>

      {/* Pattern Cards Grid - Grouped by Subject */}
      {Object.keys(groupedPatterns).length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-border/50 rounded-3xl bg-card/20">
          <div className="space-y-4">
            <Layers className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="font-black uppercase text-lg">No Patterns Yet</h3>
              <p className="text-muted-foreground text-sm">
                Create your first pattern to get started.
              </p>
            </div>
            <Link href="/admin/patterns">
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" /> Create Pattern
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(groupedPatterns).map(([subject, subPatterns]) => (
            <div key={subject} className="space-y-6">
              {/* Subject Header */}
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-foreground bg-primary/10 px-4 py-1 rounded-lg border-l-4 border-primary">
                  {subject}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
                <Badge variant="secondary" className="font-bold">
                  {subPatterns.length} patterns
                </Badge>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subPatterns.map((pattern) => {
                  const problemCount = problemCounts[pattern._id] || 0
                  const proficiency =
                    problemCount > 0
                      ? Math.min((problemCount / 10) * 100, 100)
                      : 0

                  return (
                    <div
                      key={pattern._id}
                      className="group p-5 border rounded-[24px] bg-card hover:border-primary/50 hover:shadow-xl transition-all space-y-6 relative overflow-hidden"
                    >
                      {/* Background accent */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -mr-12 -mt-12 rounded-full group-hover:bg-primary/10 transition-all duration-500" />

                      {/* Header */}
                      <div className="flex justify-between items-start relative z-10">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-lg font-black text-foreground group-hover:text-primary transition-colors leading-tight italic truncate max-w-[180px] uppercase">
                              {pattern.name}
                            </h4>
                            {problemCount >= 10 && (
                              <Badge className="text-[8px] h-4 py-0 uppercase font-black bg-yellow-500/20 text-yellow-600 border-yellow-500/20">
                                Popular
                              </Badge>
                            )}
                          </div>
                          <p className="text-[10px] font-black text-muted-foreground tracking-widest uppercase opacity-60">
                            {problemCount} / 10+ Problems
                          </p>
                        </div>

                        {/* Action buttons - visible on hover */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/admin/patterns?edit=${pattern._id}`}>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            onClick={() =>
                              handleDeletePattern(pattern._id, pattern.name)
                            }
                            disabled={deletingId === pattern._id}
                          >
                            <Trash2
                              className={`h-3.5 w-3.5 ${deletingId === pattern._id ? 'animate-spin' : ''}`}
                            />
                          </Button>
                        </div>
                      </div>

                      {/* Description */}
                      {pattern.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 relative z-10">
                          {pattern.description}
                        </p>
                      )}

                      {/* Progress bar (mimicking student view) */}
                      <div className="space-y-2 relative z-10">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="opacity-40">Problem Coverage</span>
                          <span className="text-primary font-black">
                            {problemCount}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(251,146,60,0.4)]"
                            style={{ width: `${Math.min(proficiency, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* View link */}
                      <Link
                        href={`/dashboard/topic/${pattern.slug}`}
                        className="flex items-center gap-2 text-xs font-bold text-primary hover:underline relative z-10"
                      >
                        View as Student <ChevronRight className="h-3 w-3" />
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
