'use client'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis } from 'recharts'
import { ORANGE_PALETTE } from '@/lib/chart-colors'
import type { ChartConfig } from '@/components/ui/chart'

export function RevenueTrendChart({ chartData }: { chartData: any }) {
  return (
    <ChartContainer
      config={
        {
          earnings: { label: 'Earnings', color: ORANGE_PALETTE[0] },
        } satisfies ChartConfig
      }
      className="h-[280px] w-full"
    >
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={ORANGE_PALETTE[0]} stopOpacity={0.3} />
            <stop offset="95%" stopColor={ORANGE_PALETTE[0]} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value: any) => [`$${value}`, 'Revenue']}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="earnings"
          stroke={ORANGE_PALETTE[0]}
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorEarnings)"
        />
      </AreaChart>
    </ChartContainer>
  )
}

export function RevenueDistributionChart({
  distributionData,
}: {
  distributionData: any
}) {
  return (
    <ChartContainer
      config={
        distributionData.reduce((acc: any, item: any, idx: number) => {
          const colors = ['#f97316', '#3b82f6', '#22c55e', '#a855f7', '#ec4899']
          acc[item.name] = {
            label: item.name,
            color: colors[idx % colors.length],
          }
          return acc
        }, {}) satisfies ChartConfig
      }
      className="h-[240px] w-full"
    >
      <PieChart>
        <Pie
          data={distributionData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={5}
          dataKey="value"
        >
          {distributionData.map((entry: any, index: number) => {
            const colors = [
              '#f97316',
              '#3b82f6',
              '#22c55e',
              '#a855f7',
              '#ec4899',
            ]
            return (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
                stroke="hsl(var(--card))"
                strokeWidth={2}
              />
            )
          })}
        </Pie>
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value: any) => [`$${value}`, 'Amount']}
            />
          }
        />
      </PieChart>
    </ChartContainer>
  )
}
