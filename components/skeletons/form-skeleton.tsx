'use client'

import { Skeleton } from '@/components/ui/skeleton'

interface FormSkeletonProps {
  fieldCount?: number
}

export function FormSkeleton({ fieldCount = 4 }: FormSkeletonProps) {
  return (
    <div className="space-y-6">
      {Array(fieldCount)
        .fill(0)
        .map((_, i) => (
          <div key={_?.id || _?._id || i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}
      <div className="pt-4 flex gap-4">
        <Skeleton className="h-10 w-32 rounded-md" />
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
    </div>
  )
}
