'use client'

import React from 'react'
import { Calendar, Trophy, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface HackathonCardProps {
  id: string
  title: string
  description: string
  status: 'active' | 'upcoming' | 'ended'
  participants: number
  startDate: string
  endDate: string
  prize: string
  pattern: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  progress?: number
  onClick?: () => void
}

export const HackathonCard = React.memo(function HackathonCard({
  title,
  description,
  status,
  participants,
  startDate,
  prize,
  pattern,
  difficulty,
  progress,
  onClick,
}: HackathonCardProps) {
  const isLive = status === 'active'

  return (
    <Card
      className={cn(
        'group relative overflow-hidden border bg-card text-card-foreground flex flex-col justify-between',
        'rounded-2xl border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5',
        isLive && 'border-primary/50 shadow-sm shadow-primary/10'
      )}
    >
      {/* Status Strip */}
      {isLive && (
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-orange-600" />
      )}

      <CardHeader className="p-6 pb-3 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-2">
            {isLive ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-semibold uppercase tracking-wide">
                  Live
                </span>
              </div>
            ) : (
              <Badge
                variant="outline"
                className="text-[10px] font-medium uppercase tracking-wide border-border/50 text-muted-foreground bg-muted/20"
              >
                {status}
              </Badge>
            )}
            <Badge
              variant="secondary"
              className={cn(
                'text-[10px] font-medium uppercase tracking-wide border-0',
                difficulty === 'Beginner'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : difficulty === 'Intermediate'
                    ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                    : 'bg-red-500/10 text-red-600 dark:text-red-400'
              )}
            >
              {difficulty}
            </Badge>
          </div>

          {/* Participants Pile */}
          <div className="flex items-center gap-2 rounded-full px-3 py-1.5 bg-muted/30 border border-border/50">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-muted ring-2 ring-card flex items-center justify-center overflow-hidden"
                >
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400 dark:from-gray-600 dark:to-gray-700" />
                </div>
              ))}
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {participants}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-6 py-3 space-y-4">
        {/* Meta Data Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-muted/20 border border-border/50 flex flex-col gap-1">
            <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3 w-3" /> Start
            </span>
            <span className="text-sm font-semibold">{startDate}</span>
          </div>
          <div className="p-3 rounded-xl bg-muted/20 border border-border/50 flex flex-col gap-1">
            <span className="text-[10px] font-medium text-primary flex items-center gap-1.5">
              <Trophy className="h-3 w-3" /> Prize
            </span>
            <span className="text-sm font-semibold text-foreground">
              {prize}
            </span>
          </div>
        </div>

        {/* Technical Pattern */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/50">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
            Pattern
          </span>
          <span className="text-xs font-semibold flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            {pattern}
          </span>
        </div>

        {isLive && progress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress
              value={progress}
              className="h-1.5 bg-muted rounded-full"
            />
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-3">
        <Button
          onClick={onClick}
          className={cn(
            'w-full h-11 rounded-xl font-semibold text-sm transition-all active:scale-[0.97]',
            isLive
              ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm shadow-primary/20'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          )}
        >
          {isLive ? (
            <span className="flex items-center gap-2">
              Enter Arena <ChevronRight className="h-4 w-4" />
            </span>
          ) : (
            'Join Waitlist'
          )}
        </Button>
      </CardFooter>
    </Card>
  )
})
