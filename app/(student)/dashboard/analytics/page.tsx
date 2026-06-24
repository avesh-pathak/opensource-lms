import { Suspense } from 'react'
import { AnalyticsDashboard } from '@/components/dashboard/analytics-dashboard'
import { AnalyticsSkeleton } from '@/components/skeletons/analytics-skeleton'

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<AnalyticsSkeleton />}>
      <AnalyticsDashboard />
    </Suspense>
  )
}
