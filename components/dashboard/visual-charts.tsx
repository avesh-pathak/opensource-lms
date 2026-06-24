'use client'

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

interface XPDatum {
  date: string
  xp: number
}

interface AreaChartProps {
  data: XPDatum[]
}

// Shared Tooltip Style for Shadcn Consistency
const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  borderColor: 'hsl(var(--border))',
  borderRadius: 'calc(var(--radius) - 2px)',
  borderWidth: '1px',
  borderStyle: 'solid',
  fontSize: '12px',
  color: 'hsl(var(--foreground))',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  fontWeight: 500,
  outline: 'none',
}

export function XPVelocityChart({ data }: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorXP" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FB923C" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#FB923C" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          strokeOpacity={0.1}
        />
        <XAxis
          dataKey="date"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          interval={4}
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
          dy={10}
        />
        <YAxis
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickCount={5}
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <ReTooltip
          contentStyle={tooltipStyle}
          itemStyle={{ color: 'hsl(var(--foreground))' }}
          labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
          cursor={{ stroke: '#FB923C', strokeWidth: 1, strokeDasharray: '4 4' }}
        />
        <Area
          type="monotone"
          dataKey="xp"
          name="XP Gained"
          stroke="#FB923C"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorXP)"
          dot={{
            r: 4,
            fill: '#FB923C',
            strokeWidth: 2,
            stroke: 'hsl(var(--background))',
          }}
          activeDot={{ r: 6, strokeWidth: 0 }}
          animationDuration={1500}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

interface MasteryDatum {
  name: string
  percent: number
}

interface BarChartProps {
  data: MasteryDatum[]
}

export function MasteryBarChart({ data }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={false}
          strokeOpacity={0.1}
        />
        <XAxis type="number" hide />
        <YAxis
          dataKey="name"
          type="category"
          width={100}
          fontSize={11}
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'hsl(var(--muted-foreground))', fontWeight: 500 }}
        />
        <ReTooltip
          cursor={{ fill: '#FB923C', fillOpacity: 0.1, radius: 4 }}
          contentStyle={tooltipStyle}
          itemStyle={{ color: 'hsl(var(--foreground))' }}
          labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
        />
        <Bar
          dataKey="percent"
          fill="#FB923C"
          radius={[0, 4, 4, 0]}
          barSize={24}
          animationDuration={1500}
          label={{
            position: 'right',
            fill: '#FB923C',
            fontSize: 11,
            fontWeight: 'bold',
            formatter: (v: number) => `${v}%`,
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

// Difficulty Pie Chart
interface DifficultyData {
  easy: { done: number; total: number }
  medium: { done: number; total: number }
  hard: { done: number; total: number }
}

const DIFFICULTY_COLORS = {
  Easy: '#22c55e',
  Medium: '#f59e0b',
  Hard: '#ef4444',
}

export function DifficultyPieChart({ data }: { data: DifficultyData }) {
  const chartData = [
    {
      name: 'Easy',
      value: data.easy.done,
      total: data.easy.total,
      color: DIFFICULTY_COLORS.Easy,
    },
    {
      name: 'Medium',
      value: data.medium.done,
      total: data.medium.total,
      color: DIFFICULTY_COLORS.Medium,
    },
    {
      name: 'Hard',
      value: data.hard.done,
      total: data.hard.total,
      color: DIFFICULTY_COLORS.Hard,
    },
  ]

  const totalSolved = chartData.reduce((acc, d) => acc + d.value, 0)

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
            animationDuration={1500}
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <ReTooltip
            contentStyle={tooltipStyle}
            formatter={(value: number, name: string, props: any) => [
              `${value} / ${props.payload.total}`,
              name,
            ]}
            itemStyle={{ color: 'hsl(var(--foreground))' }}
            labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-black text-foreground">
          {totalSolved}
        </span>
        <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
          Solved
        </span>
      </div>
    </div>
  )
}

// Weekly Comparison Component
interface WeeklyData {
  thisWeek: number
  lastWeek: number
}

export function WeeklyComparison({ data }: { data: WeeklyData }) {
  const diff = data.thisWeek - data.lastWeek
  const percentChange =
    data.lastWeek > 0 ? Math.round((diff / data.lastWeek) * 100) : 100
  const isPositive = diff >= 0

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 border border-border/50">
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-foreground">
            {data.thisWeek}
          </span>
          <span className="text-xs font-bold uppercase text-muted-foreground">
            this week
          </span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span
            className={`text-sm font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}
          >
            {isPositive ? '+' : ''}
            {diff}
          </span>
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}
          >
            {isPositive ? '↑' : '↓'} {Math.abs(percentChange)}%
          </span>
          <span className="text-[10px] text-muted-foreground">
            vs last week
          </span>
        </div>
      </div>
      <div className="text-right">
        <span className="text-xl font-bold text-muted-foreground">
          {data.lastWeek}
        </span>
        <p className="text-[10px] font-bold uppercase text-muted-foreground">
          Last Week
        </p>
      </div>
    </div>
  )
}
