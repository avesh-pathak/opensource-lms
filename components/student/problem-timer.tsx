'use client'

import { Button } from '@/components/ui/button'
import { Clock, Play, Pause, RotateCcw } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useUserState } from '@/lib/user-state'

type ProblemTimerProps = {
  problemId: string
  initialTime?: number
  onTimeUpdate?: (problemId: string, time: number) => void
}

export function ProblemTimer({
  problemId,
  initialTime = 0,
  onTimeUpdate,
}: ProblemTimerProps) {
  const { state, updateSession, loading } = useUserState()
  /* ---------------- STATE ---------------- */
  // We prioritize local state to prevent "thrashing" from server echoes
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(initialTime)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const initializedRef = useRef(false)

  /* ---------------- INITIALIZATION ---------------- */
  useEffect(() => {
    // If we have already initialized, don't do it again
    if (initializedRef.current) return

    // Wait for auth/state to be ready
    if (loading || !state) return

    const timerState = state.session.activeTimers[problemId]

    if (timerState) {
      // If there is an active session, use it (it's the most "recent" truth)
      setTime(timerState.time)
      setIsRunning(timerState.isRunning)
    } else {
      // Otherwise, assume we are starting fresh or from stored accumulated time
      // We rely on the initialTime passed via props (which comes from problem.timeSpent)
      setTime(initialTime)
      setIsRunning(false)
    }

    initializedRef.current = true
  }, [problemId, state, loading, initialTime])

  /* ---------------- SYNC TO CLOUD ---------------- */
  // We sync the "active timer" state to the session with debouncing
  useEffect(() => {
    if (!state || !initializedRef.current) return

    const handler = setTimeout(() => {
      updateSession({
        activeTimers: {
          ...state.session.activeTimers,
          [problemId]: { time, isRunning },
        },
      })
    }, 5000)

    return () => clearTimeout(handler)
  }, [time, isRunning, problemId])

  /* ---------------- TIMER TICK ---------------- */
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  /* ---------------- UPDATE PARENT / DB ---------------- */
  useEffect(() => {
    if (time > 0 && onTimeUpdate) {
      // Check if time actually changed?
      // onTimeUpdate usually triggers a DB write/sync
      onTimeUpdate(problemId, time)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, problemId]) // removed onTimeUpdate from deps to avoid re-trigger if parent function acts weird

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const handleToggle = () => {
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTime(0)
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center gap-1.5 text-sm font-mono min-w-[60px]"
        aria-label="Time spent"
      >
        <Clock
          className="h-3.5 w-3.5 text-muted-foreground"
          aria-hidden="true"
        />
        <span
          className={isRunning ? 'text-foreground' : 'text-muted-foreground'}
        >
          {formatTime(time)}
        </span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={handleToggle}
        aria-label={isRunning ? 'Pause timer' : 'Start timer'}
      >
        {isRunning ? (
          <Pause className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <Play className="h-3.5 w-3.5" aria-hidden="true" />
        )}
      </Button>

      {time > 0 && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleReset}
          aria-label="Reset timer"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      )}
    </div>
  )
}
