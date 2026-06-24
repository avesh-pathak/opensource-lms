import { cn } from '@/lib/utils'
import { BarChart3 } from 'lucide-react'
import { ReactNode } from 'react'

interface ChartContainerProps {
  children: ReactNode
  className?: string
  height?: string
  isEmpty?: boolean
  emptyMessage?: string
}

export function ChartContainer({
  children,
  className,
  height = 'h-[300px]',
  isEmpty = false,
  emptyMessage = 'No data available for this period',
}: ChartContainerProps) {
  if (isEmpty) {
    return (
      <div
        className={cn(
          'w-full relative flex flex-col items-center justify-center border border-dashed border-muted rounded-xl bg-muted/5',
          height,
          className
        )}
      >
        <div className="p-4 rounded-full bg-muted/20 mb-3">
          <BarChart3 className="h-6 w-6 text-muted-foreground/50" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          {emptyMessage}
        </p>
      </div>
    )
  }

  return (
    <div className={cn('w-full relative min-h-[200px]', height, className)}>
      {children}
    </div>
  )
}
