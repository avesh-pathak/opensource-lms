'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Target,
  TrendingUp,
  Activity,
  Zap,
  Layers,
  BarChart3,
  CheckCircle2,
} from 'lucide-react'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'

const DifficultyFunnelChart = dynamic(
  () => import('./components/charts').then((mod) => mod.DifficultyFunnelChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[280px] w-full bg-muted/10 animate-pulse rounded-xl" />
    ),
  }
)

const CategoryEngagementChart = dynamic(
  () =>
    import('./components/charts').then((mod) => mod.CategoryEngagementChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[280px] w-full bg-muted/10 animate-pulse rounded-xl" />
    ),
  }
)

const ActivityTrendChart = dynamic(
  () => import('./components/charts').then((mod) => mod.ActivityTrendChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[250px] w-full bg-muted/10 animate-pulse rounded-xl" />
    ),
  }
)

interface EngagementData {
  overview: {
    totalUsers: number
    activeUsers: number
    conversionRate: number
    totalProblems: number
    acceptedSubmissions: number
    totalSubmissions: number
    successRate: number
  }
  difficultyFunnel: {
    name: string
    users: number
    submissions: number
  }[]
  categoryBreakdown: {
    category: string
    userCount: number
    problemCount: number
  }[]
  activityTrend: {
    date: string
    submissions: number
    activeUsers: number
  }[]
}

export default function EngagementAnalytics() {
  const [data, setData] = useState<EngagementData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/analytics/engagement')
        if (res.ok) {
          setData(await res.json())
        } else {
          toast.error('Failed to load analytics')
        }
      } catch (_error) {
        toast.error('Failed to load engagement data')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

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

  const overview = data?.overview || {
    totalUsers: 0,
    activeUsers: 0,
    conversionRate: 0,
    totalProblems: 0,
    acceptedSubmissions: 0,
    totalSubmissions: 0,
    successRate: 0,
  }
  const difficultyFunnel = data?.difficultyFunnel || []
  const categoryBreakdown = data?.categoryBreakdown || []
  const activityTrend = data?.activityTrend || []

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic text-foreground">
          Engagement Analytics
        </h1>
        <p className="text-muted-foreground font-medium">
          Track student progression, identify drop-off points, and optimize the
          learning path.
        </p>
      </div>

      {/* Overview KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card className="border-border/50 bg-gradient-to-br from-blue-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Total Users
            </CardTitle>
            <div className="p-2 rounded-full bg-blue-500/20">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black italic tracking-tighter text-foreground">
              {overview.totalUsers?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered on platform
            </p>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card className="border-border/50 bg-gradient-to-br from-green-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Active Learners
            </CardTitle>
            <div className="p-2 rounded-full bg-green-500/20">
              <Zap className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black italic tracking-tighter text-foreground">
              {overview.activeUsers?.toLocaleString() || 0}
            </div>
            <Badge variant="secondary" className="mt-1 text-[10px]">
              {overview.conversionRate}% conversion
            </Badge>
          </CardContent>
        </Card>

        {/* Success Rate */}
        <Card className="border-border/50 bg-gradient-to-br from-orange-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Success Rate
            </CardTitle>
            <div className="p-2 rounded-full bg-orange-500/20">
              <Target className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black italic tracking-tighter text-foreground">
              {overview.successRate}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Accepted submissions
            </p>
          </CardContent>
        </Card>

        {/* Total Problems */}
        <Card className="border-border/50 bg-gradient-to-br from-purple-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Problem Bank
            </CardTitle>
            <div className="p-2 rounded-full bg-purple-500/20">
              <Layers className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black italic tracking-tighter text-foreground">
              {overview.totalProblems || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Available challenges
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficulty Funnel */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black italic uppercase tracking-tight flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-orange-500" />
              Difficulty Progression
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Users who solved at least one problem per difficulty
            </p>
          </CardHeader>
          <CardContent>
            {difficultyFunnel.length > 0 ? (
              <DifficultyFunnelChart difficultyFunnel={difficultyFunnel} />
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground italic">
                No submission data yet.
              </div>
            )}

            {/* Drop-off Analysis */}
            {difficultyFunnel.length >= 2 && (
              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">
                  Drop-off Analysis
                </h4>
                <div className="flex gap-4 text-sm">
                  {difficultyFunnel[0]?.users > 0 &&
                    difficultyFunnel[1]?.users > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-green-500">Easy → Medium:</span>
                        <Badge variant="outline">
                          {(
                            (difficultyFunnel[1].users /
                              difficultyFunnel[0].users) *
                            100
                          ).toFixed(0)}
                          % retained
                        </Badge>
                      </div>
                    )}
                  {difficultyFunnel[1]?.users > 0 &&
                    difficultyFunnel[2]?.users > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-orange-500">Medium → Hard:</span>
                        <Badge variant="outline">
                          {(
                            (difficultyFunnel[2].users /
                              difficultyFunnel[1].users) *
                            100
                          ).toFixed(0)}
                          % retained
                        </Badge>
                      </div>
                    )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black italic uppercase tracking-tight flex items-center gap-2">
              <Layers className="h-5 w-5 text-purple-500" />
              Category Engagement
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Users actively solving problems per category
            </p>
          </CardHeader>
          <CardContent>
            {categoryBreakdown.length > 0 ? (
              <CategoryEngagementChart categoryBreakdown={categoryBreakdown} />
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground italic">
                No category data yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Trend */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black italic uppercase tracking-tight flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            Daily Activity (Last 30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activityTrend.length > 0 ? (
            <ActivityTrendChart activityTrend={activityTrend} />
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground italic">
              No activity in the last 30 days.
            </div>
          )}

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-muted-foreground">Submissions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-400"></div>
              <span className="text-muted-foreground">Active Users</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights Section */}
      <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="text-lg font-black italic uppercase tracking-tight flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {overview.conversionRate > 0 && (
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded bg-blue-500/20">
                <Users className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="font-medium text-sm">User Activation</p>
                <p className="text-xs text-muted-foreground">
                  {overview.conversionRate}% of registered users have submitted
                  at least one solution.
                </p>
              </div>
            </div>
          )}

          {difficultyFunnel[0]?.users > 0 &&
            difficultyFunnel[2]?.users >= 0 && (
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded bg-orange-500/20">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">Difficulty Progression</p>
                  <p className="text-xs text-muted-foreground">
                    {difficultyFunnel[2]?.users || 0} users have conquered Hard
                    problems out of {difficultyFunnel[0]?.users || 0} who
                    started with Easy.
                  </p>
                </div>
              </div>
            )}

          {categoryBreakdown.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded bg-purple-500/20">
                <Layers className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <p className="font-medium text-sm">Most Popular Category</p>
                <p className="text-xs text-muted-foreground">
                  &quot;{categoryBreakdown[0]?.category}&quot; leads with{' '}
                  {categoryBreakdown[0]?.userCount} active learners.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
