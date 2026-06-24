'use client'

import { ChartCard } from '@/components/ui/chart-card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Area,
  AreaChart,
  CartesianGrid,
} from 'recharts'
import { TrendingUp, Activity, DollarSign, Users } from 'lucide-react'
import { CHART_COLORS } from '@/lib/chart-colors'
import type { ChartConfig } from '@/components/ui/chart'

interface AnalyticsChartsProps {
  userGrowth: { _id: string; count: number }[]
  contentActivity: { _id: string; count: number }[]
  revenue: { _id: string; amount: number }[]
  submissionActivity: { _id: string; count: number }[]
}

export function AnalyticsCharts({
  userGrowth,
  contentActivity,
  revenue,
  submissionActivity,
}: AnalyticsChartsProps) {
  // Format data for charts
  const growthData = userGrowth.map((item) => ({
    name: item._id, // "YYYY-MM"
    users: item.count,
  }))

  const activityData = contentActivity.map((item) => ({
    name: item._id.split('-').slice(1).join('/'), // "MM/DD"
    posts: item.count,
  }))

  const revenueData = revenue.map((item) => ({
    name: item._id, // "YYYY-MM"
    amount: item.amount,
  }))

  const submissionData = submissionActivity.map((item) => ({
    name: item._id.split('-').slice(1).join('/'),
    submissions: item.count,
  }))

  // Chart configurations
  const userGrowthConfig = {
    users: {
      label: 'Users',
      color: CHART_COLORS.primary,
    },
  } satisfies ChartConfig

  const contentActivityConfig = {
    posts: {
      label: 'Posts',
      color: CHART_COLORS.primary,
    },
  } satisfies ChartConfig

  const revenueConfig = {
    amount: {
      label: 'Revenue',
      color: CHART_COLORS.primary,
    },
  } satisfies ChartConfig

  const submissionConfig = {
    submissions: {
      label: 'Submissions',
      color: CHART_COLORS.primary,
    },
  } satisfies ChartConfig

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* User Growth */}
      <ChartCard
        title="User Growth"
        description="Monthly user registration trend"
        icon={Users}
        iconColor="text-orange-500"
        delay={0}
      >
        <ChartContainer config={userGrowthConfig} className="h-full w-full">
          <BarChart data={growthData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              strokeOpacity={0.1}
            />
            <XAxis
              dataKey="name"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              stroke="#888888"
              dy={10}
            />
            <YAxis
              fontSize={11}
              tickLine={false}
              axisLine={false}
              stroke="#888888"
              allowDecimals={false}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={{ fill: 'hsl(var(--muted))', fillOpacity: 0.2 }}
            />
            <Bar
              dataKey="users"
              fill={CHART_COLORS.primary}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </ChartCard>

      {/* Platform Activity */}
      <ChartCard
        title="Content Activity"
        description="Daily content creation velocity"
        icon={Activity}
        iconColor="text-orange-500"
        delay={1}
      >
        <ChartContainer
          config={contentActivityConfig}
          className="h-full w-full"
        >
          <AreaChart data={activityData}>
            <defs>
              <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={CHART_COLORS.primary}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={CHART_COLORS.primary}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              strokeOpacity={0.1}
            />
            <XAxis
              dataKey="name"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              stroke="#888888"
              dy={10}
            />
            <YAxis
              fontSize={11}
              tickLine={false}
              axisLine={false}
              stroke="#888888"
              allowDecimals={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="posts"
              stroke={CHART_COLORS.primary}
              fillOpacity={1}
              fill="url(#colorPosts)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </ChartCard>

      {/* Revenue */}
      <ChartCard
        title="Revenue Trends"
        description="Monthly revenue performance"
        icon={DollarSign}
        iconColor="text-orange-500"
        delay={2}
      >
        <ChartContainer config={revenueConfig} className="h-full w-full">
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={CHART_COLORS.primary}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={CHART_COLORS.primary}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              strokeOpacity={0.1}
            />
            <XAxis
              dataKey="name"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              stroke="#888888"
              dy={10}
            />
            <YAxis
              fontSize={11}
              tickLine={false}
              axisLine={false}
              stroke="#888888"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke={CHART_COLORS.primary}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </ChartCard>

      {/* Problem Engagement */}
      <ChartCard
        title="Problem Engagement"
        description="Daily submission activity"
        icon={TrendingUp}
        iconColor="text-orange-500"
        delay={3}
      >
        <ChartContainer config={submissionConfig} className="h-full w-full">
          <BarChart data={submissionData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              strokeOpacity={0.1}
            />
            <XAxis
              dataKey="name"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              stroke="#888888"
              dy={10}
            />
            <YAxis
              fontSize={11}
              tickLine={false}
              axisLine={false}
              stroke="#888888"
              allowDecimals={false}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={{ fill: 'hsl(var(--muted))', fillOpacity: 0.2 }}
            />
            <Bar
              dataKey="submissions"
              fill={CHART_COLORS.primary}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </ChartCard>
    </div>
  )
}
