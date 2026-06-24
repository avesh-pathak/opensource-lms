'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import React from 'react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  BarChart3,
  BookOpen,
  Cpu,
  Layers,
  MessageSquare,
  ShieldCheck,
  Users,
  Trophy,
  Repeat,
  Bug,
  Radio,
  FileSpreadsheet,
  Sparkles,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { SidebarSectionHeader } from '@/components/sidebar/sidebar-section-header'
import { SidebarThemeToggle } from '@/components/sidebar/sidebar-theme-toggle'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

function DashboardSidebarInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isMobile, setOpenMobile, state } = useSidebar()

  const navItems = [
    {
      href: '/dashboard',
      icon: LayoutDashboard,
      label: 'Overview',
      active: pathname === '/dashboard' && !searchParams.get('domain'),
    },
    {
      href: '/dashboard/analytics',
      icon: BarChart3,
      label: 'Analytics',
      active: pathname === '/dashboard/analytics',
    },
    {
      href: '/visualizer',
      icon: Sparkles,
      label: 'Visualizers',
      active: pathname.startsWith('/visualizer'),
    },
    {
      href: '/dashboard/revision',
      icon: Repeat,
      label: 'Revision Center',
      active: pathname === '/dashboard/revision',
    },
    {
      href: '/dashboard/mentorship',
      icon: MessageSquare,
      label: 'Mentorship',
      active: pathname === '/dashboard/mentorship',
    },
    {
      href: '/dashboard/announcements',
      icon: Radio,
      label: 'Announcements',
      active: pathname === '/dashboard/announcements',
    },
    {
      href: '/dashboard/groups',
      icon: Users,
      label: 'Squads',
      active: pathname === '/dashboard/groups',
    },
    {
      href: '/dashboard/hackathons',
      icon: Trophy,
      label: 'Hackathons',
      active: pathname === '/dashboard/hackathons',
    },
    {
      href: '/dashboard/leaderboard',
      icon: Trophy,
      label: 'Leaderboard',
      active: pathname === '/dashboard/leaderboard',
    },
    {
      href: '/dashboard/quiz',
      icon: BookOpen,
      label: 'Quiz',
      active: pathname === '/dashboard/quiz',
    },
  ]

  const engineeringItems = [
    {
      href: '/dashboard?domain=DSA',
      icon: Layers,
      label: 'DSA Patterns',
      active: pathname === '/dashboard' && searchParams.get('domain') === 'DSA',
    },
    {
      href: '/dashboard/custom-sheet',
      icon: FileSpreadsheet,
      label: 'Custom DSA Sheet',
      active: pathname === '/dashboard/custom-sheet',
    },
    {
      href: '/dashboard?domain=Core Engineering',
      icon: Cpu,
      label: 'Core Engineering',
      active:
        pathname === '/dashboard' &&
        ['Core Engineering', 'System Design', 'LLD', 'AI/ML'].includes(
          searchParams.get('domain') || ''
        ),
    },
  ]

  const communityItems = [
    {
      href: '/dashboard/community',
      icon: Users,
      label: 'Community Hub',
      active:
        pathname.includes('/dashboard/community') ||
        pathname === '/dashboard/roast',
    },
  ]

  const otherItems = [
    {
      href: '/dashboard/report',
      icon: Bug,
      label: 'Report a Bug',
      active: pathname === '/dashboard/report',
    },
  ]

  return (
    <Sidebar
      side="left"
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar"
    >
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/60">
        <div className="flex h-14 items-center gap-2 px-3">
          <SidebarTrigger className="text-sidebar-foreground hover:bg-sidebar-accent" />
          {state === 'expanded' && (
            <Link
              href="/"
              className="flex items-center gap-2 rounded-md hover:opacity-90 transition-opacity min-w-0"
            >
              <div className="w-8 h-8 rounded-lg bg-[#FB923C] flex items-center justify-center shrink-0">
                <ShieldCheck className="h-4 w-4 text-white" />
              </div>
              <span className="font-black text-sm uppercase tracking-tighter truncate">
                Babua DSA
              </span>
            </Link>
          )}
          <div className="ml-auto flex items-center gap-1">
            <SidebarThemeToggle className="scale-90 origin-right" />
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setOpenMobile(false)}
                aria-label="Close sidebar"
              >
                <span className="sr-only">Close</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </Button>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-6 p-2">
            <SidebarGroup>
              <SidebarGroupLabel>
                <SidebarSectionHeader>Navigation</SidebarSectionHeader>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-0.5">
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={item.active}
                        tooltip={item.label}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-[background-color,color]',
                            item.active
                              ? 'bg-primary/10 text-primary font-bold'
                              : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                          )}
                        >
                          <item.icon className="h-4 w-4 shrink-0" aria-hidden />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>
                <SidebarSectionHeader>Engineering Paths</SidebarSectionHeader>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-0.5">
                  {engineeringItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={item.active}
                        tooltip={item.label}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-[background-color,color]',
                            item.active
                              ? 'bg-primary/10 text-primary font-bold'
                              : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                          )}
                        >
                          <item.icon className="h-4 w-4 shrink-0" aria-hidden />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>
                <SidebarSectionHeader>Community Hub</SidebarSectionHeader>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-0.5">
                  {communityItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={item.active}
                        tooltip={item.label}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-[background-color,color]',
                            item.active
                              ? 'bg-primary/10 text-primary font-bold'
                              : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                          )}
                        >
                          <item.icon className="h-4 w-4 shrink-0" aria-hidden />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-0.5">
                  {otherItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={item.active}
                        tooltip={item.label}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-[background-color,color]',
                            item.active
                              ? 'bg-primary/10 text-primary font-bold'
                              : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                          )}
                        >
                          <item.icon className="h-4 w-4 shrink-0" aria-hidden />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <p className="text-[10px] text-sidebar-foreground/50 px-2 pb-1 uppercase tracking-wider">
          Babua DSA
        </p>
      </SidebarFooter>
    </Sidebar>
  )
}

export function DashboardSidebar() {
  return (
    <React.Suspense fallback={null}>
      <DashboardSidebarInner />
    </React.Suspense>
  )
}
