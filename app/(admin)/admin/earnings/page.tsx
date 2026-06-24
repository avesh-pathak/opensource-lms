'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Activity,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'

const RevenueTrendChart = dynamic(
  () => import('./components/charts').then((mod) => mod.RevenueTrendChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[280px] w-full bg-muted/10 animate-pulse rounded-xl" />
    ),
  }
)

const RevenueDistributionChart = dynamic(
  () =>
    import('./components/charts').then((mod) => mod.RevenueDistributionChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[240px] w-full bg-muted/10 animate-pulse rounded-xl" />
    ),
  }
)

export default function AdminEarnings() {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/earnings')
      if (res.ok) {
        setData(await res.json())
      }
    } catch (_error) {
      toast.error('Failed to load financial data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    // Poll every 30 seconds for near real-time updates
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
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

  // Prepare distribution data for pie chart
  const distributionData = [
    {
      name: 'Mentorship',
      value: data?.mentorshipEarnings || data?.grossEarnings || 0,
    },
    { name: 'Squad Subscriptions', value: data?.squadEarnings || 0 },
    {
      name: 'Stories',
      value:
        (data?.logs?.filter((l: any) => l.source === 'story').length || 0) * 10,
    },
  ].filter((d) => d.value > 0)

  // Format monthly stats for area chart
  const chartData =
    data?.monthlyStats?.map((s: any) => ({
      month: s._id,
      earnings: s.earnings,
      sessions: s.sessions,
    })) || []

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic text-foreground">
          Financial Intelligence Hub
        </h1>
        <p className="text-muted-foreground font-medium">
          Real-time revenue analytics, trends, and transaction history.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Net Earnings */}
        <Card className="border-border/50 bg-gradient-to-br from-green-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Net Revenue
            </CardTitle>
            <div className="p-2 rounded-full bg-green-500/20">
              <DollarSign className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black italic tracking-tighter text-foreground">
              ${data?.totalEarnings?.toLocaleString() || 0}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500 font-medium">
                After refunds
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Gross Earnings */}
        <Card className="border-border/50 bg-gradient-to-br from-blue-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Gross Earnings
            </CardTitle>
            <div className="p-2 rounded-full bg-blue-500/20">
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black italic tracking-tighter text-foreground">
              ${data?.grossEarnings?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total before refunds
            </p>
          </CardContent>
        </Card>

        {/* Sessions */}
        <Card className="border-border/50 bg-gradient-to-br from-orange-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Sessions
            </CardTitle>
            <div className="p-2 rounded-full bg-orange-500/20">
              <Calendar className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black italic tracking-tighter text-foreground">
              {data?.totalMeetings || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Completed mentorship sessions
            </p>
          </CardContent>
        </Card>

        {/* Refunds */}
        <Card className="border-border/50 bg-gradient-to-br from-red-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Refunds
            </CardTitle>
            <div className="p-2 rounded-full bg-red-500/20">
              <TrendingDown className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black italic tracking-tighter text-foreground">
              ${data?.totalRefunds?.toLocaleString() || 0}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <XCircle className="h-3 w-3 text-red-500" />
              <span className="text-xs text-red-500 font-medium">
                {data?.totalCancellations || 0} cancellations
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Squad Subscriptions */}
        <Card className="border-border/50 bg-gradient-to-br from-purple-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Squad Subs
            </CardTitle>
            <div className="p-2 rounded-full bg-purple-500/20">
              <Activity className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black italic tracking-tighter text-foreground">
              ₹{data?.squadEarnings?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {data?.totalSquadSubscriptions || 0} subscriptions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend - Area Chart */}
        <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black italic uppercase tracking-tight flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <RevenueTrendChart chartData={chartData} />
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground italic">
                No revenue data yet. Complete some sessions to see trends.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue Distribution - Pie Chart */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black italic uppercase tracking-tight flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-orange-500" />
              Revenue Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            {distributionData.length > 0 ? (
              <>
                <RevenueDistributionChart distributionData={distributionData} />
                <div className="flex flex-col gap-2 mt-4">
                  {distributionData.map((item, index) => {
                    const colors = [
                      '#f97316',
                      '#3b82f6',
                      '#22c55e',
                      '#a855f7',
                      '#ec4899',
                    ]
                    const _colorNames = [
                      'Orange',
                      'Blue',
                      'Green',
                      'Purple',
                      'Pink',
                    ]
                    return (
                      <div
                        key={item.name}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: colors[index % colors.length],
                            }}
                          />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <span className="text-muted-foreground font-mono">
                          ${item.value.toLocaleString()}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground italic">
                No revenue sources yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <div className="space-y-4">
        <h2 className="text-xl font-black italic uppercase tracking-tight flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Transaction History
        </h2>

        {!data?.logs || data.logs.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-border/50 rounded-3xl bg-card/20 text-muted-foreground italic">
            No transactions recorded yet.
          </div>
        ) : (
          <div className="space-y-2">
            {data.logs.map((log: any) => (
              <Card
                key={log.id}
                className={`border-border/50 hover:bg-muted/50 transition-colors ${
                  log.type === 'debit' ? 'bg-red-500/5' : 'bg-card/50'
                }`}
              >
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        log.type === 'debit'
                          ? 'bg-red-500/20'
                          : 'bg-green-500/20'
                      }`}
                    >
                      {log.type === 'debit' ? (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-bold text-sm">{log.action}</div>
                      <div className="text-xs text-muted-foreground">
                        {log.details}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant="secondary"
                      className="font-mono text-[10px] uppercase font-bold"
                    >
                      {new Date(log.date).toLocaleDateString()}
                    </Badge>
                    <div
                      className={`font-black italic ${
                        log.type === 'debit' ? 'text-red-500' : 'text-green-500'
                      }`}
                    >
                      {log.type === 'debit' ? '-' : '+'}${Math.abs(log.points)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
