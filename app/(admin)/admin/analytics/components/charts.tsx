'use client'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Cell } from 'recharts'
import { CHART_COLORS, EXTENDED_PALETTE } from '@/lib/chart-colors'
import type { ChartConfig } from '@/components/ui/chart'

export function DifficultyFunnelChart({
  difficultyFunnel,
}: {
  difficultyFunnel: any
}) {
  return (
    <ChartContainer
      config={
        difficultyFunnel.reduce((acc: any, item: any, idx: number) => {
          acc[item.name] = {
            label: item.name,
            color: [
              CHART_COLORS.primary,
              CHART_COLORS.secondary,
              CHART_COLORS.tertiary,
            ][idx % 3],
          }
          return acc
        }, {}) satisfies ChartConfig
      }
      className="h-[280px] w-full"
    >
      <BarChart data={difficultyFunnel} layout="vertical">
        <XAxis type="number" stroke="#888888" fontSize={11} />
        <YAxis
          type="category"
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={60}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="users" radius={[0, 4, 4, 0]}>
          {difficultyFunnel.map((entry: any, index: number) => (
            <Cell
              key={`cell-${index}`}
              fill={
                [
                  CHART_COLORS.primary,
                  CHART_COLORS.secondary,
                  CHART_COLORS.tertiary,
                ][index % 3]
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

export function CategoryEngagementChart({
  categoryBreakdown,
}: {
  categoryBreakdown: any
}) {
  return (
    <ChartContainer
      config={
        categoryBreakdown.reduce((acc: any, item: any, idx: number) => {
          acc[item.category] = {
            label: item.category,
            color: EXTENDED_PALETTE[idx % EXTENDED_PALETTE.length],
          }
          return acc
        }, {}) satisfies ChartConfig
      }
      className="h-[280px] w-full"
    >
      <BarChart data={categoryBreakdown}>
        <XAxis
          dataKey="category"
          stroke="#888888"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis
          stroke="#888888"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="userCount" radius={[4, 4, 0, 0]}>
          {categoryBreakdown.map((entry: any, index: number) => (
            <Cell
              key={`cell-${index}`}
              fill={EXTENDED_PALETTE[index % EXTENDED_PALETTE.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

export function ActivityTrendChart({ activityTrend }: { activityTrend: any }) {
  return (
    <ChartContainer
      config={
        {
          submissions: {
            label: 'Submissions',
            color: CHART_COLORS.primary,
          },
          activeUsers: {
            label: 'Active Users',
            color: CHART_COLORS.secondary,
          },
        } satisfies ChartConfig
      }
      className="h-[250px] w-full"
    >
      <LineChart data={activityTrend}>
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) =>
            new Date(value).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })
          }
        />
        <YAxis
          stroke="#888888"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
            />
          }
        />
        <Line
          type="monotone"
          dataKey="submissions"
          stroke={CHART_COLORS.primary}
          strokeWidth={2}
          dot={false}
          name="Submissions"
        />
        <Line
          type="monotone"
          dataKey="activeUsers"
          stroke={CHART_COLORS.secondary}
          strokeWidth={2}
          dot={false}
          name="Active Users"
        />
      </LineChart>
    </ChartContainer>
  )
}
