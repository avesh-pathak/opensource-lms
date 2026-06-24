'use client'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis } from 'recharts'
import { MIXED_COLORS, DEVICE_COLORS } from '@/lib/chart-colors'

export function DevicePieChart({
  deviceData,
  deviceConfig,
}: {
  deviceData: any
  deviceConfig: any
}) {
  return (
    <ChartContainer config={deviceConfig} className="h-[250px] w-full">
      <>
        <PieChart>
          <Pie
            data={deviceData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {deviceData.map((entry: any, index: number) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  DEVICE_COLORS[entry.name as keyof typeof DEVICE_COLORS] ||
                  MIXED_COLORS[index % MIXED_COLORS.length]
                }
                stroke="hsl(var(--card))"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
        </PieChart>
        <div className="flex justify-center gap-3 mt-2 flex-wrap">
          {deviceData.map((device: any) => (
            <div
              key={device.name}
              className="flex items-center gap-1.5 text-xs"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor:
                    DEVICE_COLORS[device.name as keyof typeof DEVICE_COLORS],
                }}
              />
              <span className="capitalize text-muted-foreground">
                {device.name}
              </span>
            </div>
          ))}
        </div>
      </>
    </ChartContainer>
  )
}

export function BrowserBarChart({
  browserStats,
  browserConfig,
}: {
  browserStats: any
  browserConfig: any
}) {
  return (
    <ChartContainer config={browserConfig} className="h-[300px] w-full">
      <BarChart
        data={browserStats}
        layout="vertical"
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <XAxis type="number" stroke="#888888" fontSize={11} hide />
        <YAxis
          type="category"
          dataKey="_id"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={100}
        />
        <ChartTooltip
          content={<ChartTooltipContent />}
          cursor={{ fill: 'hsl(var(--muted))', fillOpacity: 0.2 }}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {browserStats.map((entry: any, index: number) => (
            <Cell
              key={`cell-${index}`}
              fill={MIXED_COLORS[index % MIXED_COLORS.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
