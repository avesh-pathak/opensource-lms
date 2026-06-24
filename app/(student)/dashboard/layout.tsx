import { Suspense } from 'react'
import { DashboardLayoutClient } from '@/components/student/dashboard-layout-client'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground flex-col lg:flex-row">
      <Suspense fallback={null}>
        <DashboardLayoutClient>{children}</DashboardLayoutClient>
      </Suspense>
    </div>
  )
}
