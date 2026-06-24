'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react'
import { UserData, SessionData, StoredProblemData } from '@/lib/types'
import { useAuth } from '@/lib/auth-context'

interface UserStateContextType {
  state: UserData | null
  loading: boolean
  user: any | null
  updateSession: (updates: Partial<SessionData>) => Promise<void>
  updateProblem: (
    problemId: string,
    updates: Partial<StoredProblemData>
  ) => Promise<void>
  updateCommunity: (
    updates: Partial<Required<UserData>['community']>
  ) => Promise<void>
  refresh: () => Promise<void>
}

const UserStateContext = createContext<UserStateContextType | undefined>(
  undefined
)

const DEFAULT_SESSION: SessionData = {
  expandedProblems: {},
  activeTimers: {},
  filters: {
    search: '',
    difficulty: [],
    status: [],
  },
  lastVisitedTopic: null,
  view: 'overview',
  bookedSessions: [],
  unlockedHubs: [],
}

export function UserStateProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [state, setState] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchState = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/user/state')
      if (res.ok) {
        const { data } = await res.json()
        if (data) {
          setState(data)
        } else {
          // Initialize empty state if none exists
          const initialState: UserData = {
            session: DEFAULT_SESSION,
            problems: {},
          }
          // We don't necessarily need to save it immediately,
          // but we can to ensure the DB has it.
          setState(initialState)
          updateState(initialState)
        }
      }
    } catch (error) {
      console.error('Failed to fetch user state:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authLoading) return
    if (user) {
      fetchState()
    } else {
      setState(null)
      setLoading(false)
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user])

  const pendingUpdate = React.useRef<UserData | null>(null)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const sequenceRef = React.useRef<number>(0)

  const updateState = async (newState: UserData) => {
    if (!user) return

    const currentSequence = ++sequenceRef.current

    // Optimistic update
    setState(newState)
    pendingUpdate.current = newState

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(async () => {
      if (!pendingUpdate.current) return
      if (currentSequence !== sequenceRef.current) return
      const stateToSync = pendingUpdate.current
      pendingUpdate.current = null

      try {
        await fetch('/api/user/state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: stateToSync }),
        })
      } catch (error) {
        console.error('Error syncing state:', error)
      }
    }, 1000)
  }

  const updateSession = async (
    updates: Partial<SessionData> | ((prev: UserData) => UserData)
  ) => {
    if (!state) return
    const newState =
      typeof updates === 'function'
        ? updates(state)
        : {
            ...state,
            session: { ...state.session, ...updates },
          }
    await updateState(newState)
  }

  const updateProblem = async (
    problemId: string,
    updates: Partial<StoredProblemData>
  ) => {
    if (!state) return
    const currentProblem = state.problems[problemId] || { _id: problemId }

    // Logic from local-storage.ts
    const finalUpdates: Partial<StoredProblemData> = { ...updates }
    if (
      updates.status === 'Completed' &&
      currentProblem.status !== 'Completed'
    ) {
      finalUpdates.completedAt = new Date().toISOString()
    } else if (updates.status && updates.status !== 'Completed') {
      finalUpdates.completedAt = undefined
    }

    const updatedProblem = {
      ...currentProblem,
      ...finalUpdates,
      updatedAt: new Date().toISOString(),
    }

    const newState = {
      ...state,
      problems: {
        ...state.problems,
        [problemId]: updatedProblem,
      },
    }
    await updateState(newState)
  }

  const updateCommunity = async (
    updates: Partial<Required<UserData>['community']>
  ) => {
    if (!state) return
    const newState = {
      ...state,
      community: { ...(state.community || {}), ...updates },
    }
    await updateState(newState)
  }

  const refresh = async () => {
    await fetchState()
  }

  const value = useMemo(
    () => ({
      state,
      loading,
      user: user ?? null,
      updateSession,
      updateProblem,
      updateCommunity,
      refresh,
    }),
    [
      state,
      loading,
      user,
      updateSession,
      updateProblem,
      updateCommunity,
      refresh,
    ]
  )

  return (
    <UserStateContext.Provider value={value}>
      {children}
    </UserStateContext.Provider>
  )
}

export function useUserState() {
  const context = useContext(UserStateContext)
  if (context === undefined) {
    throw new Error('useUserState must be used within a UserStateProvider')
  }
  return context
}
