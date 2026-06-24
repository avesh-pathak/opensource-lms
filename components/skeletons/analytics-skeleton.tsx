'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function AnalyticsSkeleton() {
  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b pb-8 border-border/50">
        <div className="space-y-3">
          <Skeleton className="h-12 w-48 rounded-xl" />
          <Skeleton className="h-5 w-64 rounded-lg" />
          <div className="flex gap-2 pt-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-md" />
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-16 w-32 rounded-2xl" />
          <Skeleton className="h-16 w-32 rounded-2xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Skeleton */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={_?.id || _?._id || i}
                  className="h-32 rounded-3xl"
                />
              ))}
          </div>

          <Skeleton className="h-[400px] w-full rounded-3xl" />
          <Skeleton className="h-[480px] w-full rounded-3xl" />
        </div>

        {/* Sidebar Skeleton */}
        <div className="lg:col-span-4 space-y-6">
          <Skeleton className="h-[300px] w-full rounded-3xl" />
          <Skeleton className="h-[400px] w-full rounded-[32px]" />
          <Skeleton className="h-[200px] w-full rounded-3xl" />
        </div>
      </div>
    </div>
  )
}
