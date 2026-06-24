'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  Trophy,
  Flame,
  CheckCircle2,
  Clock,
  Download,
  Radio,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { AdminNotesWidget } from '@/components/admin/admin-notes-widget'
import { AdminDashboardSkeleton } from '@/components/skeletons/admin-dashboard-skeleton'
import { useResponsive } from '@/hooks/use-responsive'

const AnalyticsCharts = dynamic(
  () =>
    import('@/components/admin/analytics-charts').then((m) => ({
      default: m.AnalyticsCharts,
    })),
  { ssr: false }
)

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingStories: 0,
    activeHackathons: 0,
    dailyActivity: 0,
    userGrowth: [],
    contentActivity: [],
    revenue: [],
    submissionActivity: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const { isMobile } = useResponsive()

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (_error) {
      console.error('Failed to fetch stats')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    // Poll every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return <AdminDashboardSkeleton />
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      {/* ... rest of the component ... */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-foreground">
            Mission Control
          </h1>
          <p className="text-muted-foreground font-medium">
            {isMobile
              ? 'Ready to ship?'
              : 'Welcome back, Commander. Time to ship.'}
          </p>
        </div>
        <div className={cn('flex gap-3', isMobile ? 'flex-col' : '')}>
          <Link
            href="/admin/announcements"
            className={isMobile ? 'w-full' : ''}
          >
            <Button
              variant="outline"
              className={cn(
                'rounded-xl font-bold uppercase tracking-wider border-border/50 bg-card/50',
                isMobile ? 'w-full h-12' : 'h-10'
              )}
            >
              <Radio className="mr-2 h-4 w-4" /> Announcements
            </Button>
          </Link>
          <Button
            variant="outline"
            className={cn(
              'rounded-xl font-bold uppercase tracking-wider border-border/50 bg-card/50',
              isMobile ? 'w-full h-12' : 'h-10'
            )}
          >
            <Download className="mr-2 h-4 w-4" /> Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminNotesWidget />
        <StatsCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          description="Registered users"
          color="text-blue-500"
        />
        <StatsCard
          title="Pending Reviews"
          value={stats.pendingStories}
          icon={Clock}
          description="Requires verification"
          color="text-orange-500"
        />
        <StatsCard
          title="Active Hackathons"
          value={stats.activeHackathons}
          icon={Trophy}
          description="Sprints in progress"
          color="text-green-500"
        />
        <StatsCard
          title="Daily Activity"
          value={stats.dailyActivity}
          icon={Flame}
          description="Users active today"
          color="text-red-500"
        />
      </div>

      <AnalyticsCharts
        userGrowth={stats.userGrowth || []}
        contentActivity={stats.contentActivity || []}
        revenue={stats.revenue || []}
        submissionActivity={stats.submissionActivity || []}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black uppercase italic flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Recent Moderation Queue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.pendingStories > 0 ? (
              <p className="text-sm text-foreground font-bold">
                You have{' '}
                <span className="text-orange-500">
                  {stats.pendingStories} items
                </span>{' '}
                waiting for review.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No pending items in queue. You&apos;re all caught up!
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black uppercase italic flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Platform Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold">MongoDB</span>
              <span className="text-green-500 font-black italic uppercase">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold">System Health</span>
              <span className="text-green-500 font-black italic uppercase">
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold">API Latency</span>
              <span className="text-green-500 font-black italic uppercase">
                Low
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatsCard({ title, value, icon: Icon, description, color }: any) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden group hover:border-primary/50 transition-all active:scale-95 cursor-default">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={cn('h-4 w-4 opacity-70', color)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-black italic tracking-tighter">
          {value}
        </div>
        <p className="text-[10px] text-muted-foreground font-medium mt-1">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}
