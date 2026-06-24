'use client'

import { Button } from '@/components/ui/button'
import { Clock, Play, Pause, RotateCcw } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

type ProblemTimerProps = {
  problemId: string
  initialTime?: number
  onTimeUpdate?: (problemId: string, time: number) => void
}

export function CustomProblemTimer({
  problemId,
  initialTime = 0,
  onTimeUpdate,
}: ProblemTimerProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(initialTime)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Sync initialTime if it changes
  useEffect(() => {
    setTime(initialTime)
  }, [initialTime])

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

  // Sync to parent periodically or on pause?
  // Original updated session every second. Here we just update parent when time changes.
  // Parent should handle debouncing if needed.
  useEffect(() => {
    if (time > 0 && onTimeUpdate && time !== initialTime) {
      // We can debounce this in parent, or here.
      // For custom sheet, let's just propagate it.
      const timer = setTimeout(() => {
        onTimeUpdate(problemId, time)
      }, 5000) // Debounce 5s to save DB writes
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, problemId, onTimeUpdate])

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
    onTimeUpdate?.(problemId, 0)
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
