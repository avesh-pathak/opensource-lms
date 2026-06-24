'use client'

import { useCallback, useMemo } from 'react'
import { useUserState } from '@/lib/user-state'
import { MentorshipSession } from '@/lib/types'
import { toast } from 'sonner'

export function useMentorship() {
  const { state, updateSession, loading } = useUserState()

  const sessions = useMemo(
    () => (state?.session?.bookedSessions || []) as MentorshipSession[],
    [state?.session?.bookedSessions]
  )

  const addSession = useCallback(
    (newSession: MentorshipSession) => {
      updateSession({
        bookedSessions: [...(state?.session?.bookedSessions || []), newSession],
      })
      toast.success('Session Booked & Synced')
    },
    [updateSession, state?.session?.bookedSessions]
  )

  const cancelSession = useCallback(
    (sessionId: string) => {
      updateSession({
        bookedSessions: (state?.session?.bookedSessions || []).map((s) =>
          s.id === sessionId ? { ...s, status: 'cancelled' as const } : s
        ),
      })
      toast.info('Session Cancelled')
    },
    [updateSession, state?.session?.bookedSessions]
  )

  return {
    sessions,
    addSession,
    cancelSession,
    isLoading: loading,
  }
}
