import { Suspense } from 'react'
import { DashboardOverview } from '@/components/student/dashboard-overview'
import { DashboardSkeleton } from '@/components/skeletons/dashboard-skeleton'

export default function DashboardPage({
  searchParams,
}: {
  searchParams: { domain?: string }
}) {
  const mode = searchParams?.domain ? 'domain' : 'overview'

  return (
    <Suspense fallback={<DashboardSkeleton mode={mode} />}>
      <DashboardOverview />
    </Suspense>
  )
}
