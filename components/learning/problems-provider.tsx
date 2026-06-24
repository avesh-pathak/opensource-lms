'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { MongoDBProblem, Topic } from '@/lib/types'
import { toSlug } from '@/lib/utils'
import { addDays, isBefore, parseISO } from 'date-fns'
import { useSyncProgress } from '@/hooks/use-sync-progress'

interface ProblemsContextType {
  problems: MongoDBProblem[]
  topics: Topic[]
  loading: boolean
  refresh: () => Promise<void>
  updateProblem: (id: string, updates: Partial<MongoDBProblem>) => void
}

const ProblemsContext = createContext<ProblemsContextType | undefined>(
  undefined
)

// Helper function to extract title from problem link
const extractTitleFromLink = (problemLink: string): string => {
  try {
    const parts = problemLink.split('/').filter(Boolean)
    const last = parts[parts.length - 1]
    return last
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  } catch (_e) {
    return 'Untitled Problem'
  }
}

const EMPTY_PROBLEMS: MongoDBProblem[] = []

export function ProblemsProvider({
  children,
  initialProblems = EMPTY_PROBLEMS,
}: {
  children: React.ReactNode
  initialProblems?: MongoDBProblem[]
}) {
  const [problems, setProblems] = useState<MongoDBProblem[]>(initialProblems)
  const [loading, setLoading] = useState(initialProblems.length === 0)
  const {
    isSyncing: _isSyncing,
    progress,
    updateProgress: persistUpdate,
  } = useSyncProgress()

  const [fetchedPatterns, setFetchedPatterns] = useState<any[]>([])
  const [_isPending, startTransition] = React.useTransition()

  // Retrieve patterns/topics from API
  const _fetchPatterns = async () => {
    try {
      const res = await fetch('/api/patterns')
      if (res.ok) {
        const data = await res.json()
        setFetchedPatterns(data)
      }
    } catch (e) {
      console.error('Failed to fetch patterns', e)
    }
  }

  const topics = React.useMemo(() => {
    if (fetchedPatterns.length === 0) return []

    return fetchedPatterns.map((pattern) => {
      // Calculate stats dynamically from problems by matching topic name
      const normalizedPatternName = (pattern.name || '').trim().toLowerCase()
      const patternProblems = problems.filter((p) => {
        const problemTopic = (p.topic || '').trim().toLowerCase()
        return problemTopic === normalizedPatternName
      })

      const total =
        patternProblems.length > 0 ? patternProblems.length : pattern.total || 0
      const solved = patternProblems.filter(
        (p) => p.status === 'Completed'
      ).length
      const reviewCount = patternProblems.filter((p) => p.isReviewDue).length

      return {
        id: pattern.slug || toSlug(pattern.name),
        name: pattern.name,
        solved,
        total,
        domain: pattern.domain || 'DSA',
        subject: pattern.subject || 'General',
        reviewCount,
      }
    })
  }, [problems, fetchedPatterns])

  const applySRS = React.useCallback((p: MongoDBProblem): MongoDBProblem => {
    if (p.status !== 'Completed' || !p.completedAt) {
      return { ...p, isReviewDue: !!p.tags?.includes('Revision') }
    }

    try {
      const completedDate = parseISO(p.completedAt)
      if (isNaN(completedDate.getTime())) {
        return { ...p, isReviewDue: false }
      }
      const reviewDueAt = addDays(completedDate, 3).toISOString()
      const isReviewDue =
        isBefore(parseISO(reviewDueAt), new Date()) ||
        (p.tags?.includes('Revision') ?? false)

      return { ...p, reviewDueAt, isReviewDue }
    } catch (_e) {
      return { ...p, isReviewDue: false }
    }
  }, [])

  const mergeProblem = React.useCallback(
    (p: MongoDBProblem) => {
      const stored = progress[p._id]
      const domain = p.domain || 'DSA'
      let title = p.title
      if (title === 'None' && p.problem_link) {
        title = extractTitleFromLink(p.problem_link)
      }

      const merged: MongoDBProblem = { ...p, ...stored, title, domain }
      return applySRS(merged)
    },
    [applySRS, progress]
  )

  const processAllProblems = React.useCallback(
    (apiProblems: MongoDBProblem[]) => {
      const allProblemsMap = new Map<string, MongoDBProblem>()
      const apiLen = apiProblems.length

      for (let i = 0; i < apiLen; i++) {
        const p = apiProblems[i]
        allProblemsMap.set(p._id, mergeProblem(p))
      }

      return Array.from(allProblemsMap.values())
    },
    [mergeProblem]
  )

  const fetchData = React.useCallback(async () => {
    try {
      const [problemsRes, topicsRes] = await Promise.all([
        fetch('/api/problems'),
        fetch('/api/topics'),
      ])

      const problemsData = await problemsRes.json()
      const topicsData = topicsRes.ok ? await topicsRes.json() : []

      startTransition(() => {
        setFetchedPatterns(
          topicsData.map((t: any) => ({
            _id: t.id,
            slug: t.id,
            name: t.name,
            domain: t.domain || 'DSA',
            subject: t.subject || 'General',
            total: t.total,
            solved: t.solved,
          }))
        )
        setProblems(processAllProblems(problemsData.problems ?? []))
        setLoading(false)
      })
    } catch (err) {
      console.error('Failed to load data in provider', err)
      setLoading(false)
    }
  }, [processAllProblems])

  const updateProblem = React.useCallback(
    (id: string, updates: Partial<MongoDBProblem>) => {
      persistUpdate(id, updates)

      startTransition(() => {
        setProblems((prev) => {
          const index = prev.findIndex((p) => p._id === id)
          if (index === -1) return prev

          const newProblems = [...prev]
          const updated = {
            ...newProblems[index],
            ...updates,
            updatedAt: updates.updatedAt || new Date().toISOString(),
          }
          newProblems[index] = applySRS(updated)
          return newProblems
        })
      })
    },
    [applySRS, persistUpdate]
  )

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProblems((prev) => {
      const newProblems = prev.map((p) => {
        const stored = progress[p._id]
        if (!stored) return p

        const localTime = p.updatedAt ? new Date(p.updatedAt).getTime() : 0
        const serverTime = stored.updatedAt
          ? new Date(stored.updatedAt).getTime()
          : 0

        if (serverTime <= localTime) {
          return p
        }

        const merged = { ...p, ...stored }
        return applySRS(merged)
      })
      return newProblems
    })
  }, [progress, applySRS])

  // Initial fetch if needed
  useEffect(() => {
    if (initialProblems.length > 0) {
      startTransition(() => {
        setProblems(processAllProblems(initialProblems))
      })
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false)
    } else {
      fetchData()
    }
  }, [initialProblems, processAllProblems, fetchData])

  const value = React.useMemo(
    () => ({
      problems,
      topics,
      loading,
      refresh: fetchData,
      updateProblem,
    }),
    [problems, topics, loading, fetchData, updateProblem]
  )

  return (
    <ProblemsContext.Provider value={value}>
      {children}
    </ProblemsContext.Provider>
  )
}

export function useProblems() {
  const context = useContext(ProblemsContext)
  if (context === undefined) {
    throw new Error('useProblems must be used within a ProblemsProvider')
  }
  return context
}
