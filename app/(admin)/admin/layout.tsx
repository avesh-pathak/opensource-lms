import { Suspense } from 'react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Auth is now handled by middleware - no need to check here
  return (
    <div className="flex min-h-screen bg-background text-foreground flex-col lg:flex-row">
      <Suspense fallback={null}>
        <AdminSidebar />
      </Suspense>
      <main className="flex-1 pt-0 lg:pt-0">
        <Breadcrumbs />
        <Suspense fallback={null}>{children}</Suspense>
      </main>
    </div>
  )
}
