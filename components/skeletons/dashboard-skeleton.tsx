'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function DashboardSkeleton({
  mode = 'overview',
}: {
  mode?: 'overview' | 'domain'
}) {
  if (mode === 'overview') {
    return (
      <div className="p-6 lg:p-8 space-y-12 max-w-7xl mx-auto">
        {/* Hero Skeleton (Matches Launchpad Hero) */}
        <div className="h-64 w-full rounded-[32px] border bg-card animate-pulse shadow-sm" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Hot Zone Skeleton (Matches Hot Zone List) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center px-2">
              <Skeleton className="h-8 w-48 rounded-lg" />
              <Skeleton className="h-4 w-24 rounded-lg" />
            </div>
            <div className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={_?.id || _?._id || i}
                    className="h-28 rounded-[28px] border bg-card p-5 animate-pulse"
                  />
                ))}
            </div>
          </div>

          {/* Right: Sidebar Skeleton (Matches Quests/Daily) */}
          <div className="space-y-6">
            <Skeleton className="h-8 w-40 rounded-lg px-2" />
            <div className="h-64 rounded-[32px] border bg-card animate-pulse" />
            <Skeleton className="h-8 w-40 rounded-lg px-2" />
            <div className="h-48 rounded-[32px] border bg-card animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  // Domain Mode (Original Grid Layout)
  return (
    <div className="p-6 lg:p-8 space-y-12 max-w-7xl mx-auto">
      {/* Header Skeleton - REMOVED Stats Card to match Topic View Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-6 w-96 max-w-full rounded-lg" />
        </div>
        {/* Stats card removed because it depends on data loading and causes jump if not ready */}
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div
              key={_?.id || _?._id || i}
              className="h-44 rounded-[24px] border bg-card p-5 space-y-6"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32 rounded-md" />
                  <Skeleton className="h-4 w-24 rounded-md" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
