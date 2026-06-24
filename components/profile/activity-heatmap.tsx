'use client'

import React, { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Flame } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ActivityHeatmapProps {
  data: { date: string; count: number }[]
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const totalActivity = useMemo(
    () => data.reduce((sum, d) => sum + d.count, 0),
    [data]
  )

  const getColor = (count: number) => {
    if (count === 0) return 'bg-muted/30 dark:bg-muted/10'
    if (count === 1) return 'bg-orange-300/60 dark:bg-orange-500/30'
    if (count === 2) return 'bg-orange-400/70 dark:bg-orange-500/50'
    if (count === 3) return 'bg-orange-500/80 dark:bg-orange-500/70'
    return 'bg-orange-500 dark:bg-orange-500 shadow-[0_0_6px_rgba(251,146,60,0.5)]'
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <h4 className="text-xs font-black uppercase tracking-widest text-foreground">
              Activity
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
              Less
            </span>
            <div className="flex gap-0.5">
              <div className="h-3 w-3 rounded-sm bg-muted/30 dark:bg-muted/10" />
              <div className="h-3 w-3 rounded-sm bg-orange-300/60 dark:bg-orange-500/30" />
              <div className="h-3 w-3 rounded-sm bg-orange-400/70 dark:bg-orange-500/50" />
              <div className="h-3 w-3 rounded-sm bg-orange-500" />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
              More
            </span>
          </div>
        </div>

        <div className="relative p-4 bg-muted/10 border border-border/30 rounded-2xl overflow-hidden">
          {totalActivity === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px] z-10">
              <p className="text-sm font-bold text-muted-foreground/50 uppercase tracking-wider">
                Start solving to see activity
              </p>
            </div>
          )}
          <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
            {data.slice(-30).map((day, _i) => (
              <Tooltip key={day.date}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      'aspect-square min-h-[24px] rounded-md cursor-pointer transition-[transform,box-shadow] hover:ring-2 hover:ring-orange-400/50 hover:scale-105',
                      getColor(day.count)
                    )}
                    role="img"
                    aria-label={`${day.count} ${day.count === 1 ? 'problem' : 'problems'} solved on ${day.date}`}
                  />
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-gray-900 text-white border-0 rounded-lg px-3 py-2 shadow-xl"
                >
                  <p className="text-xs font-black">
                    {day.count} {day.count === 1 ? 'Problem' : 'Problems'}
                  </p>
                  <p className="text-[10px] text-gray-400">{day.date}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        <p className="text-[9px] font-bold text-muted-foreground/40 text-center uppercase tracking-[0.15em]">
          Rolling 30-Day Execution Protocol
        </p>
      </div>
    </TooltipProvider>
  )
}
