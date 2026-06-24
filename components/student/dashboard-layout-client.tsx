'use client'

import React, { useState } from 'react'
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { DashboardSidebar } from '@/components/student/dashboard-sidebar'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'

function getInitialSidebarOpen(): boolean {
  if (typeof window === 'undefined') return true
  return localStorage.getItem('sidebar-collapsed') !== 'true'
}

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(getInitialSidebarOpen)

  const handleOpenChange = (value: boolean) => {
    setOpen(value)
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', String(!value))
    }
  }

  return (
    <SidebarProvider open={open} onOpenChange={handleOpenChange}>
      <DashboardSidebar />
      <SidebarInset>
        <header className="lg:hidden flex h-14 items-center border-b bg-background/80 backdrop-blur-md px-4 sticky top-0 z-40 gap-2">
          <SidebarTrigger className="md:hidden" />
          <span className="font-bold text-sm">Menu</span>
        </header>
        <Breadcrumbs />
        <div className="px-4 py-2 sm:px-8" />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
