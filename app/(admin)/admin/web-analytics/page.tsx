'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ChartConfig } from '@/components/ui/chart'
import {
  Users,
  Eye,
  TrendingUp,
  Globe,
  Monitor,
  Activity,
  BarChart3,
} from 'lucide-react'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'
import { ChartCard } from '@/components/ui/chart-card'
import { MIXED_COLORS, DEVICE_COLORS } from '@/lib/chart-colors'
import { ChartContainer as OLD_CHART_CONTAINER } from '@/components/ui/chart-container'

const DevicePieChart = dynamic(
  () => import('./components/charts').then((mod) => mod.DevicePieChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[250px] w-full bg-muted/10 animate-pulse rounded-xl" />
    ),
  }
)

const BrowserBarChart = dynamic(
  () => import('./components/charts').then((mod) => mod.BrowserBarChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] w-full bg-muted/10 animate-pulse rounded-xl" />
    ),
  }
)

const TrafficAreaChart = dynamic(
  () =>
    import('@/components/admin/traffic-chart').then((m) => ({
      default: m.TrafficAreaChart,
    })),
  { ssr: false }
)

export default function WebAnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [days, setDays] = useState(30)

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/admin/analytics/web?days=${days}`)
      if (res.ok) {
        const { data } = await res.json()
        setData(data)
      } else {
        toast.error('Failed to load analytics')
      }
    } catch (_error) {
      toast.error('Failed to load web analytics')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    // Poll every 30 seconds for near real-time updates
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days])

  if (isLoading) {
    return (
      <div className="p-10 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3 mx-auto"></div>
          <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
          <div className="grid grid-cols-4 gap-4 mt-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={_?.id || _?._id || i}
                className="h-32 bg-muted rounded-xl"
              ></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const overview = data?.overview || {}
  const dailyTraffic = data?.dailyTraffic || []
  const topPages = data?.topPages || []
  const deviceStats = data?.deviceStats || []
  const browserStats = data?.browserStats || []

  // Transform device stats for pie chart
  const deviceData = deviceStats.map((d: any) => ({
    name: d._id || 'Unknown',
    value: d.count,
  }))

  // Chart configs
  const deviceConfig = {
    desktop: {
      label: 'Desktop',
      color: DEVICE_COLORS.desktop,
    },
    mobile: {
      label: 'Mobile',
      color: DEVICE_COLORS.mobile,
    },
    tablet: {
      label: 'Tablet',
      color: DEVICE_COLORS.tablet,
    },
  } satisfies ChartConfig

  const browserConfig = browserStats.reduce(
    (acc: any, browser: any, idx: number) => {
      acc[browser._id] = {
        label: browser._id,
        color: MIXED_COLORS[idx % MIXED_COLORS.length],
      }
      return acc
    },
    {}
  ) satisfies ChartConfig

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-foreground">
            Web Analytics
          </h1>
          <p className="text-muted-foreground font-medium">
            Monitor traffic, visitor behavior, and page performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="bg-card border border-border rounded-lg px-3 py-2 text-sm font-medium"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          {overview.liveNow > 0 && (
            <Badge
              variant="secondary"
              className="bg-green-500/20 text-green-500 animate-pulse"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              {overview.liveNow} online
            </Badge>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Visitors */}
        <Card className="border-border/50 bg-gradient-to-br from-blue-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Visitors
            </CardTitle>
            <div className="p-2 rounded-full bg-blue-500/20">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black italic tracking-tighter text-foreground">
              {overview.uniqueVisitors?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Unique visitors
            </p>
          </CardContent>
        </Card>

        {/* Page Views */}
        <Card className="border-border/50 bg-gradient-to-br from-green-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Page Views
            </CardTitle>
            <div className="p-2 rounded-full bg-green-500/20">
              <Eye className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black italic tracking-tighter text-foreground">
              {overview.totalPageViews?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total page views
            </p>
          </CardContent>
        </Card>

        {/* Bounce Rate */}
        <Card className="border-border/50 bg-gradient-to-br from-orange-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Bounce Rate
            </CardTitle>
            <div className="p-2 rounded-full bg-orange-500/20">
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black italic tracking-tighter text-foreground">
              {overview.bounceRate}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Single-page sessions
            </p>
          </CardContent>
        </Card>

        {/* New Sessions */}
        <Card className="border-border/50 bg-gradient-to-br from-purple-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              New Sessions
            </CardTitle>
            <div className="p-2 rounded-full bg-purple-500/20">
              <Activity className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black italic tracking-tighter text-foreground">
              {overview.newSessions?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              First-time visits
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Trend Chart */}
      <ChartCard
        title="Traffic Trend"
        description="Daily page views and visitors"
        icon={BarChart3}
        iconColor="text-green-500"
        delay={0}
        className="bg-card/50 backdrop-blur-sm"
      >
        <OLD_CHART_CONTAINER
          isEmpty={dailyTraffic.length === 0}
          height="h-[300px]"
        >
          <TrafficAreaChart data={dailyTraffic} />
        </OLD_CHART_CONTAINER>
      </ChartCard>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Pages */}
        <ChartCard
          title="Top Pages"
          description="Most visited content"
          icon={Globe}
          iconColor="text-blue-500"
          delay={1}
          className="lg:col-span-2 bg-card/50 backdrop-blur-sm"
        >
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {topPages.length > 0 ? (
              topPages.map((page: any, index: number) => (
                <div
                  key={page.path}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-muted-foreground w-6">
                      #{index + 1}
                    </span>
                    <span className="font-medium text-sm truncate max-w-[200px] sm:max-w-[300px]">
                      {page.path}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-black text-sm">
                        {page.views.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-muted-foreground uppercase">
                        views
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="font-black text-sm text-blue-500">
                        {page.visitors.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-muted-foreground uppercase">
                        visitors
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground italic">
                No page data available.
              </div>
            )}
          </div>
        </ChartCard>

        {/* Device Breakdown */}
        <ChartCard
          title="Devices"
          description="Visitor device types"
          icon={Monitor}
          iconColor="text-purple-500"
          delay={2}
          className="bg-card/50 backdrop-blur-sm"
        >
          <DevicePieChart deviceData={deviceData} deviceConfig={deviceConfig} />
        </ChartCard>
      </div>

      {/* Browser Stats */}
      <ChartCard
        title="Browser Distribution"
        description="Visitor browser usage"
        icon={Globe}
        iconColor="text-orange-500"
        delay={3}
        className="bg-card/50 backdrop-blur-sm"
      >
        <BrowserBarChart
          browserStats={browserStats}
          browserConfig={browserConfig}
        />
      </ChartCard>
    </div>
  )
}
