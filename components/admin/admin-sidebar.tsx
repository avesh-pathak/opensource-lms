'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
  LayoutDashboard,
  Trophy,
  Users,
  MessageSquare,
  BookOpen,
  Menu,
  X,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Flame,
  ShieldAlert,
  Layers,
  Newspaper,
  DollarSign,
  BarChart3,
  Globe,
  Bug,
  LogOut,
  Code2,
  Download,
} from 'lucide-react'

import { ThemeToggle } from '@/components/layout/theme-toggle'
import { NotificationBell } from '@/components/notifications/notification-bell'
import { ExportModal } from './export-modal'

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true)
    try {
      const res = await fetch('/api/admin/auth', { method: 'DELETE' })
      if (res.ok) {
        toast.success('Logged out successfully')
        router.push('/auth/admin-login')
        router.refresh()
      }
    } catch (_error) {
      toast.error('Failed to logout')
    } finally {
      setIsLoggingOut(false)
    }
  }, [router])

  // Hydration-safe initialization
  useEffect(() => {
    const savedState = localStorage.getItem('admin-sidebar-collapsed')
    if (savedState === 'true') {
      setIsCollapsed(true)
    }
  }, [])

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => {
      const newState = !prev
      localStorage.setItem('admin-sidebar-collapsed', String(newState))
      return newState
    })
  }, [])

  return (
    <>
      <div className="lg:hidden w-full h-14 border-b bg-background/80 backdrop-blur-md flex items-center px-4 sticky top-0 z-40">
        <button
          onClick={() => setOpen(true)}
          className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
        >
          <Menu className="h-5 w-5 text-foreground" />
        </button>
        <span className="font-bold text-sm ml-2 italic uppercase">
          Admin Panel
        </span>
      </div>

      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden cursor-default w-full h-full border-none p-0 m-0"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={cn(
          'fixed z-50 top-0 left-0 h-screen border-r bg-card flex flex-col transition-all duration-300 ease-in-out overflow-y-auto scrollbar-hide',
          isCollapsed ? 'w-[80px]' : 'w-[280px]',
          open ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen'
        )}
      >
        <div
          className={cn(
            'flex h-16 items-center border-b px-6 shrink-0 bg-background/50 backdrop-blur-sm transition-all',
            isCollapsed ? 'justify-center px-0 text-center' : 'justify-between'
          )}
        >
          {!isCollapsed && (
            <Link
              href="/admin"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center shrink-0">
                <ShieldCheck className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-base font-black uppercase tracking-tighter italic leading-none">
                  Admin Portal
                </h1>
                {user?.isDemo && (
                  <span className="text-[8px] font-bold text-orange-500 uppercase tracking-widest mt-0.5">
                    Demo Mode
                  </span>
                )}
              </div>
            </Link>
          )}
          <div
            className={cn(
              'flex items-center',
              isCollapsed ? 'flex-col gap-2' : 'gap-1'
            )}
          >
            {/* Desktop Collapse Toggle */}
            <button
              onClick={toggleSidebar}
              className="p-1.5 hover:bg-primary/10 rounded-md transition-colors hidden lg:flex items-center justify-center text-primary/80 hover:text-primary"
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </button>

            {/* Desktop-only Theme Toggle (when not collapsed) */}
            <div className="hidden lg:block">
              {!isCollapsed && <ThemeToggle />}
            </div>

            {/* Mobile Actions (Visible only when sidebar is open on mobile) */}
            <div className="lg:hidden flex items-center gap-2">
              <ThemeToggle />
              <NotificationBell />
              <button
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-muted rounded-md"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-hide">
          <div className="space-y-3">
            {!isCollapsed && (
              <div className="text-[10px] font-black text-muted-foreground px-3 uppercase tracking-widest opacity-70 italic">
                Navigation
              </div>
            )}
            <div className="space-y-1">
              <NavLink
                href="/admin"
                icon={LayoutDashboard}
                active={pathname === '/admin'}
                isCollapsed={isCollapsed}
              >
                Overview
              </NavLink>
              <NavLink
                href="/admin/core-engineering"
                icon={Code2}
                active={pathname === '/admin/core-engineering'}
                isCollapsed={isCollapsed}
              >
                Core Engineering
              </NavLink>
              <NavLink
                href="/admin/hackathons"
                icon={Trophy}
                active={pathname === '/admin/hackathons'}
                isCollapsed={isCollapsed}
              >
                Hackathons
              </NavLink>
              <NavLink
                href="/admin/squads"
                icon={Users}
                active={pathname === '/admin/squads'}
                isCollapsed={isCollapsed}
              >
                Squads
              </NavLink>
              <NavLink
                href="/admin/mentorship"
                icon={MessageSquare}
                active={pathname === '/admin/mentorship'}
                isCollapsed={isCollapsed}
              >
                Mentorship & Calendar
              </NavLink>
              <NavLink
                href="/admin/community"
                icon={Newspaper}
                active={pathname === '/admin/community'}
                isCollapsed={isCollapsed}
              >
                Community Hub
              </NavLink>
              <NavLink
                href="/admin/earnings"
                icon={DollarSign}
                active={pathname === '/admin/earnings'}
                isCollapsed={isCollapsed}
              >
                Financial Hub
              </NavLink>
              <NavLink
                href="/admin/analytics"
                icon={BarChart3}
                active={pathname === '/admin/analytics'}
                isCollapsed={isCollapsed}
              >
                Engagement Analytics
              </NavLink>
              <NavLink
                href="/admin/web-analytics"
                icon={Globe}
                active={pathname === '/admin/web-analytics'}
                isCollapsed={isCollapsed}
              >
                Web Analytics
              </NavLink>
              <NavLink
                href="/admin/moderation"
                icon={ShieldAlert}
                active={pathname === '/admin/moderation'}
                isCollapsed={isCollapsed}
              >
                Moderation
              </NavLink>
              <NavLink
                href="/admin/problems"
                icon={BookOpen}
                active={pathname === '/admin/problems'}
                isCollapsed={isCollapsed}
              >
                Problems
              </NavLink>
              <NavLink
                href="/admin/patterns"
                icon={Layers}
                active={pathname === '/admin/patterns'}
                isCollapsed={isCollapsed}
              >
                Patterns & Subjects
              </NavLink>
              <NavLink
                href="/admin/users"
                icon={Users}
                active={pathname === '/admin/users'}
                isCollapsed={isCollapsed}
              >
                User Management
              </NavLink>
              <NavLink
                href="/admin/support"
                icon={Bug}
                active={pathname === '/admin/support'}
                isCollapsed={isCollapsed}
              >
                Support Tickets
              </NavLink>
            </div>
          </div>

          <div className="space-y-3">
            {!isCollapsed && (
              <div className="text-[10px] font-black text-muted-foreground px-3 uppercase tracking-widest opacity-70 italic">
                System
              </div>
            )}
            <div className="space-y-1">
              <button
                onClick={() => setShowExportModal(true)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 w-full text-foreground/80 hover:bg-muted hover:text-foreground',
                  isCollapsed ? 'justify-center px-0 h-10 w-10 mx-auto' : ''
                )}
              >
                <Download className="h-4 w-4" />
                {!isCollapsed && 'Export System'}
              </button>
              <NavLink
                href="/admin/settings"
                icon={Settings}
                active={pathname === '/admin/settings'}
                isCollapsed={isCollapsed}
              >
                Platform Settings
              </NavLink>
              <NavLink
                href="/dashboard"
                icon={Flame}
                active={false}
                isCollapsed={isCollapsed}
              >
                Back to Dashboard
              </NavLink>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 w-full text-red-500 hover:bg-red-500/10',
                  isCollapsed ? 'justify-center px-0 h-10 w-10 mx-auto' : ''
                )}
              >
                <LogOut className="h-4 w-4" />
                {!isCollapsed && (isLoggingOut ? 'Logging out...' : 'Logout')}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {showExportModal && (
        <ExportModal onClose={() => setShowExportModal(false)} />
      )}
    </>
  )
}

function NavLink({
  href,
  icon: Icon,
  active,
  children,
  isCollapsed,
}: {
  href: string
  icon: React.ElementType
  active: boolean
  children: React.ReactNode
  isCollapsed?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
        active
          ? 'bg-primary/10 text-primary font-black shadow-sm'
          : 'text-foreground/80 hover:bg-muted hover:text-foreground font-bold',
        isCollapsed ? 'justify-center px-0 h-10 w-10 mx-auto' : ''
      )}
    >
      <Icon
        className={cn(
          'h-4 w-4',
          active ? 'text-primary opacity-100' : 'opacity-60'
        )}
      />
      {!isCollapsed && children}
    </Link>
  )
}
