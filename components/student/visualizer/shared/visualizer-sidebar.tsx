'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { ALGORITHMS } from '@/lib/visualizer-data'
import { SidebarThemeToggle } from '@/components/sidebar/sidebar-theme-toggle'
import { cn } from '@/lib/utils'
import { ArrowLeft, FlaskConical } from 'lucide-react'

export function VisualizerSidebar() {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  return (
    <Sidebar
      side="left"
      collapsible="icon"
      className="border-r border-border/60 bg-background"
    >
      <SidebarHeader className="border-b border-border/40">
        <div className="flex h-12 items-center gap-2 px-2">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500 text-white">
              <FlaskConical className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold tracking-tight">
              Visualizers
            </span>
          </div>
          <div className="ml-auto group-data-[collapsible=icon]:hidden">
            <SidebarThemeToggle scale="sm" />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="py-2">
          <SidebarGroupLabel className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Topics
          </SidebarGroupLabel>
          <SidebarMenu className="gap-0.5 px-2">
            {ALGORITHMS.map((algo) => {
              const isActive =
                pathname === algo.href || pathname.startsWith(algo.href + '/')
              return (
                <SidebarMenuItem key={algo.slug}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={algo.title}
                    className={cn(
                      'rounded-lg h-auto py-2 px-2.5 gap-2.5 transition-colors',
                      isActive
                        ? 'bg-accent font-semibold'
                        : 'hover:bg-accent/50'
                    )}
                    onClick={() => setOpenMobile(false)}
                  >
                    <Link href={algo.href}>
                      <span
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                          isActive
                            ? cn(algo.bgColor, 'text-white shadow-sm')
                            : cn('bg-muted', algo.textColor)
                        )}
                      >
                        {React.cloneElement(
                          algo.icon as React.ReactElement<{
                            className?: string
                          }>,
                          { className: 'h-4 w-4' }
                        )}
                      </span>
                      <span className="truncate text-sm group-data-[collapsible=icon]:hidden">
                        {algo.title}
                      </span>
                      {isActive && (
                        <span
                          className={cn(
                            'ml-auto h-1.5 w-1.5 rounded-full shrink-0',
                            algo.bgColor,
                            'group-data-[collapsible=icon]:hidden'
                          )}
                        />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Back to Dashboard"
              className="rounded-lg"
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4 shrink-0" />
                <span className="text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">
                  Dashboard
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
