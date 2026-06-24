import { useCallback, useMemo } from 'react'
import { useUserState } from '@/lib/user-state'
import { StoredProblemData } from '@/lib/types'

export function useSyncProgress() {
  const { state, loading, updateProblem, updateSession } = useUserState()

  const progress = useMemo(
    () => (state?.problems || {}) as Record<string, StoredProblemData>,
    [state?.problems]
  )
  const userGoal = state?.session?.learningGoal || null
  const dailyGoal = state?.session?.dailyGoal || 3
  const dismissedGoalPrompt = state?.session?.dismissedGoalPrompt || false

  const updateProgress = useCallback(
    (problemId: string, data: Partial<StoredProblemData>) => {
      updateProblem(problemId, data)
    },
    [updateProblem]
  )

  const updateUserGoal = useCallback(
    (goal: string) => {
      updateSession({ learningGoal: goal, dismissedGoalPrompt: true })
    },
    [updateSession]
  )

  const dismissGoalPrompt = useCallback(() => {
    updateSession({ dismissedGoalPrompt: true })
  }, [updateSession])

  const updateDailyGoal = useCallback(
    (goal: number) => {
      updateSession({ dailyGoal: goal })
    },
    [updateSession]
  )

  return {
    isSyncing: false,
    isLoading: loading,
    updateProgress,
    updateUserGoal,
    dismissGoalPrompt,
    updateDailyGoal,
    userGoal,
    dailyGoal,
    dismissedGoalPrompt,
    progress,
  }
}
