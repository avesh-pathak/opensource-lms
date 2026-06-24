'use client'

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { VisualizerSidebar } from '@/components/student/visualizer/shared/visualizer-sidebar'
import { PanelLeftIcon } from 'lucide-react'

export default function VisualizerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <VisualizerSidebar />
      <SidebarInset>
        <div className="fixed top-3 left-3 z-[60] md:hidden">
          <SidebarTrigger className="h-9 w-9 rounded-lg bg-background/90 backdrop-blur-sm border border-border/60 shadow-sm hover:bg-accent">
            <PanelLeftIcon className="h-4 w-4" />
          </SidebarTrigger>
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
