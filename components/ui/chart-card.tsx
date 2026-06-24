'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

interface ChartCardProps {
  title: string
  description?: string
  children: ReactNode
  icon?: LucideIcon
  actionSlot?: ReactNode /* Action slot for buttons/dropdowns */
  className?: string
  contentClassName?: string
  iconColor?: string
  delay?: number
}

export function ChartCard({
  title,
  description,
  children,
  icon: Icon,
  actionSlot,
  className,
  contentClassName,
  iconColor,
}: ChartCardProps) {
  return (
    <div>
      <Card
        className={cn(
          'flex flex-col border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300',
          className
        )}
      >
        <CardHeader className="items-center pb-2">
          <div className="flex w-full items-center justify-between">
            <CardTitle className="text-base font-bold uppercase tracking-tight flex items-center gap-2">
              {Icon && (
                <div
                  className={cn(
                    'p-1.5 rounded-md bg-muted/50',
                    iconColor
                      ? iconColor
                          .replace('text-', 'bg-')
                          .replace('500', '500/10')
                          .replace('primary', 'primary/10')
                      : ''
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4',
                      iconColor || 'text-muted-foreground'
                    )}
                  />
                </div>
              )}
              {title}
            </CardTitle>
            {actionSlot && (
              <div className="flex items-center gap-2">{actionSlot}</div>
            )}
          </div>
          {description && (
            <CardDescription className="w-full text-xs font-medium text-muted-foreground/80 pl-1">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className={cn('flex-1 pb-4', contentClassName)}>
          {children}
        </CardContent>
      </Card>
    </div>
  )
}

export function ChartCardSkeleton({ className }: { className?: string }) {
  return (
    <Card
      className={cn(
        'flex flex-col border-border/50 bg-card/20 h-[380px]',
        className
      )}
    >
      <CardHeader className="space-y-2">
        <div className="h-5 w-1/3 bg-muted/50 rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-muted/30 rounded animate-pulse" />
      </CardHeader>
      <CardContent className="flex-1">
        <div className="h-full w-full bg-muted/20 rounded-xl animate-pulse" />
      </CardContent>
    </Card>
  )
}
