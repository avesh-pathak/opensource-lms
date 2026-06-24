'use client'

import React from 'react'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'
import { CHART_COLORS } from '@/lib/chart-colors'
import type { ChartConfig } from '@/components/ui/chart'

interface TrafficChartProps {
  data: any[]
}

const chartConfig = {
  views: {
    label: 'Page Views',
    color: CHART_COLORS.primary,
  },
  visitors: {
    label: 'Visitors',
    color: CHART_COLORS.secondary,
  },
} satisfies ChartConfig

export function TrafficAreaChart({ data }: TrafficChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={CHART_COLORS.primary}
              stopOpacity={0.2}
            />
            <stop
              offset="95%"
              stopColor={CHART_COLORS.primary}
              stopOpacity={0}
            />
          </linearGradient>
          <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={CHART_COLORS.secondary}
              stopOpacity={0.2}
            />
            <stop
              offset="95%"
              stopColor={CHART_COLORS.secondary}
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
          dataKey="date"
          stroke="#888888"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) =>
            new Date(value).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })
          }
          dy={10}
        />
        <YAxis
          stroke="#888888"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="views"
          stroke={CHART_COLORS.primary}
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorViews)"
          animationDuration={1500}
        />
        <Area
          type="monotone"
          dataKey="visitors"
          stroke={CHART_COLORS.secondary}
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorVisitors)"
          animationDuration={1500}
        />
      </AreaChart>
    </ChartContainer>
  )
}
