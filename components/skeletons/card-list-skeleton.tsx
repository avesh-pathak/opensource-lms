'use client'

import { Skeleton } from '@/components/ui/skeleton'

interface CardListSkeletonProps {
  count?: number
}

export function CardListSkeleton({ count = 6 }: CardListSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div
            key={_?.id || _?._id || i}
            className="rounded-xl border bg-card text-card-foreground shadow space-y-4 p-6"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[80%]" />
            </div>
            <div className="pt-4 flex justify-between items-center">
              <Skeleton className="h-8 w-24 rounded-md" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
    </div>
  )
}
