'use client'

import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { ChartCard } from '@/components/ui/chart-card'
import { ChartContainer } from '@/components/ui/chart-container'
import dynamic from 'next/dynamic'

// Dynamically load chart components to reduce initial bundle
const XPVelocityChart = dynamic(
  () => import('./visual-charts').then((mod) => mod.XPVelocityChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-muted/10 animate-pulse rounded-3xl" />
    ),
  }
)
const MasteryBarChart = dynamic(
  () => import('./visual-charts').then((mod) => mod.MasteryBarChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-muted/10 animate-pulse rounded-3xl" />
    ),
  }
)
const DifficultyPieChart = dynamic(
  () => import('./visual-charts').then((mod) => mod.DifficultyPieChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-muted/10 animate-pulse rounded-3xl" />
    ),
  }
)
const WeeklyComparison = dynamic(
  () => import('./visual-charts').then((mod) => mod.WeeklyComparison),
  {
    ssr: false,
    loading: () => (
      <div className="h-16 w-full bg-muted/10 animate-pulse rounded-2xl" />
    ),
  }
)
import {
  TrendingUp,
  Target,
  BarChart3,
  Flame,
  Trophy,
  Medal,
  Rocket,
  Code2,
  Cpu,
  Activity,
  FileSpreadsheet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProblems } from '@/components/learning/problems-provider'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { format } from 'date-fns/format'
import { parseISO } from 'date-fns/parseISO'
import { subDays } from 'date-fns/subDays'
import { eachDayOfInterval } from 'date-fns/eachDayOfInterval'
import { isSameDay } from 'date-fns/isSameDay'
import { cn } from '@/lib/utils'
// import { MongoDBProblem } from "@/lib/types" // Unused
// import { Separator } from "@/components/ui/separator" // Unused
const ActivityHeatmap = dynamic(
  () =>
    import('@/components/profile/activity-heatmap').then(
      (mod) => mod.ActivityHeatmap
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-full bg-muted/30 animate-pulse rounded-2xl" />
    ),
  }
)
import { SheetSelector } from '@/components/shared/sheet-selector'
import { SheetRequirementsDialog } from '@/components/shared/sheet-requirements-dialog'
import { useSheets } from '@/hooks/use-sheets'

const pointsMap = { Easy: 50, Medium: 100, Hard: 200 }

function AnalyticsDashboardInner() {
  const { topics, problems, loading } = useProblems()
  const { sheets } = useSheets()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const selectedDomain = searchParams.get('domain') || 'all'
  const selectedSheetId = searchParams.get('sheetId') || ''
  const currentSheet = sheets.find((s) => s._id === selectedSheetId)

  const updateParams = useCallback(
    (newParams: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(newParams).forEach(([key, value]) => {
        if (value) params.set(key, value)
        else params.delete(key)
      })
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [searchParams, router, pathname]
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  // Custom Sheet Upload Logic
  const [showFormatDialog, setShowFormatDialog] = useState(false)
  const [uploading, setUploading] = useState(false)
  const hiddenFileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setShowFormatDialog(false)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('isNewSheet', 'true')
      formData.append('mode', 'replace')

      const importRes = await fetch('/api/custom-sheet/import', {
        method: 'POST',
        body: formData,
      })

      const importData = await importRes.json()

      if (!importRes.ok) {
        throw new Error(importData.error || 'Upload failed')
      }

      const newSheetId = importData.sheetId
      if (!newSheetId)
        throw new Error('Backend did not return a valid Sheet ID')

      // Redirect to the new sheet dashboard
      router.push(`/dashboard/custom-sheet/${newSheetId}`)
    } catch (error: any) {
      console.error('Creation failed', error)
      // Since we are in analytics, maybe just show error?
      // Assuming toast exists or console. Log for now as toast isn't imported here yet
      alert('Failed to create sheet: ' + error.message)
    } finally {
      setUploading(false)
      if (hiddenFileInputRef.current) hiddenFileInputRef.current.value = ''
    }
  }

  // Get unique domains from topics
  const [customSheetExists, setCustomSheetExists] = useState(false)
  const [customData, setCustomData] = useState<any>(null)

  useEffect(() => {
    // Check if custom sheet exists
    fetch('/api/custom-sheet/exists')
      .then((res) => res.json())
      .then((data) => {
        if (data.data?.exists) setCustomSheetExists(true)
      })
      .catch((err) => console.error('Failed to check custom sheet', err))
  }, [])

  // Fetch custom analytics when tab is selected or sheet changes
  useEffect(() => {
    if (selectedDomain === 'Custom Sheet') {
      const url = selectedSheetId
        ? `/api/custom-sheet/analytics?sheetId=${selectedSheetId}`
        : '/api/custom-sheet/analytics'

      fetch(url)
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            setCustomData(res.data)
            // If we didn't have a sheetId (initial load), the backend resolved one
            if (!selectedSheetId && res.data.sheetId) {
              updateParams({ sheetId: res.data.sheetId })
            }
          }
        })
        .catch((err) => console.error('Failed to fetch custom analytics', err))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDomain, selectedSheetId])

  const domains = useMemo(() => {
    const d = new Set<string>()
    topics.forEach((t: any) => {
      if (t.domain) d.add(t.domain)
    })
    const list = ['all', ...Array.from(d)]

    // Add Custom Sheet tab at the end if it exists
    if (customSheetExists) {
      list.push('Custom Sheet')
    }

    return list
  }, [topics, customSheetExists])

  // Filter topics by selected domain
  const filteredTopics = useMemo(() => {
    if (selectedDomain === 'all') return topics
    if (selectedDomain === 'Custom Sheet') return [] // Custom logic handled below
    return topics.filter((t: any) => t.domain === selectedDomain)
  }, [topics, selectedDomain])

  // Filter problems by selected domain
  const filteredProblems = useMemo(() => {
    if (selectedDomain === 'all') return problems
    if (selectedDomain === 'Custom Sheet') return [] // Custom logic handled below
    return problems.filter((p: any) => p.domain === selectedDomain)
  }, [problems, selectedDomain])

  // --- Data Calculations ---
  // --- Consolidated Data Calculations (Optimized to O(N) instead of O(N^2)) ---
  const { stats, trendData, streak, completedToday, activityData } =
    useMemo(() => {
      // CASE: CUSTOM SHEET
      if (selectedDomain === 'Custom Sheet' && customData) {
        return {
          stats: customData.stats,
          trendData: customData.trendData,
          activityData: customData.activityData,
          streak: 0, // Not calculated for custom yet
          completedToday: 0, // Not calculated for custom yet
        }
      }

      // CASE: NORMAL ANALYTICS (Existing Logic)
      // Use filteredTopics for summary stats
      const total = filteredTopics.reduce((s: number, t: any) => s + t.total, 0)
      const solved = filteredTopics.reduce(
        (s: number, t: any) => s + t.solved,
        0
      )
      const percent = total > 0 ? (solved / total) * 100 : 0

      // ... rest of existing logic ...
      const diffStats = {
        Easy: { done: 0, total: 0 },
        Medium: { done: 0, total: 0 },
        Hard: { done: 0, total: 0 },
      }

      let totalXP = 0
      let completedCountToday = 0
      const today = new Date()
      const todayStr = format(today, 'yyyy-MM-dd')
      const yesterdayStr = format(subDays(today, 1), 'yyyy-MM-dd')

      // Map to group XP by date for trend
      const xpByDate = new Map<string, number>()

      // Set for streak calculation
      const completedDatesSet = new Set<string>()

      // Use filteredProblems for detailed metrics
      filteredProblems.forEach((p: any) => {
        const diff = p.difficulty as keyof typeof diffStats
        if (diffStats[diff]) {
          diffStats[diff].total++
          if (p.status === 'Completed') {
            diffStats[diff].done++
          }
        }

        if (p.status === 'Completed') {
          const xp = pointsMap[p.difficulty as keyof typeof pointsMap] || 50
          totalXP += xp

          // Use completedAt if available, otherwise fall back to updatedAt
          const completionDateStr = p.completedAt || p.updatedAt
          if (completionDateStr) {
            const pDate = parseISO(completionDateStr)
            completedDatesSet.add(format(pDate, 'yyyy-MM-dd'))

            if (isSameDay(pDate, today)) {
              completedCountToday++
            }

            const trendKey = format(pDate, 'MMM d')
            xpByDate.set(trendKey, (xpByDate.get(trendKey) || 0) + xp)
          }
        }
      })

      // Generate trend data and activity data for last 30 days
      const last30Days = eachDayOfInterval({
        start: subDays(new Date(), 29),
        end: new Date(),
      })

      const trend = last30Days.map((date) => ({
        date: format(date, 'MMM d'),
        xp: xpByDate.get(format(date, 'MMM d')) || 0,
      }))

      const activityHeatmapData = last30Days.map((date) => {
        const dateStr = format(date, 'yyyy-MM-dd')
        let count = 0
        filteredProblems.forEach((p: any) => {
          if (p.status === 'Completed') {
            // Use completedAt if available, otherwise fall back to updatedAt
            const completionDate = p.completedAt || p.updatedAt
            if (completionDate) {
              if (format(parseISO(completionDate), 'yyyy-MM-dd') === dateStr) {
                count++
              }
            }
          }
        })
        return { date: format(date, 'PPP'), count }
      })

      // Calculate Streak
      const sortedDates = Array.from(completedDatesSet).sort((a, b) =>
        b.localeCompare(a)
      )
      let currentStreak = 0
      if (sortedDates.length > 0) {
        const checkDate =
          sortedDates[0] === todayStr
            ? todayStr
            : sortedDates[0] === yesterdayStr
              ? yesterdayStr
              : null
        if (checkDate) {
          let dateIterator = parseISO(checkDate)
          for (const dateStr of sortedDates) {
            if (dateStr === format(dateIterator, 'yyyy-MM-dd')) {
              currentStreak++
              dateIterator = subDays(dateIterator, 1)
            } else if (dateStr > format(dateIterator, 'yyyy-MM-dd')) {
              continue // Skip multiple completions on same day (already unique via Set)
            } else {
              break
            }
          }
        }
      }

      return {
        stats: {
          total,
          solved,
          percent,
          easy: diffStats.Easy,
          medium: diffStats.Medium,
          hard: diffStats.Hard,
          totalXP,
        },
        trendData: trend,
        activityData: activityHeatmapData,
        streak: currentStreak,
        completedToday: completedCountToday,
      }
    }, [filteredTopics, filteredProblems, selectedDomain, customData])

  // Weekly comparison data
  const weeklyData = useMemo(() => {
    // If Custom, currently we don't have this data breakdown from backend, so return placeholder to avoid crash or show N/A
    if (selectedDomain === 'Custom Sheet') return { thisWeek: 0, lastWeek: 0 }

    const now = new Date()
    const startOfThisWeek = new Date(now)
    startOfThisWeek.setDate(now.getDate() - now.getDay())
    startOfThisWeek.setHours(0, 0, 0, 0)

    const startOfLastWeek = new Date(startOfThisWeek)
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7)

    let thisWeek = 0
    let lastWeek = 0

    filteredProblems.forEach((p: any) => {
      if (p.status === 'Completed' && p.completedAt) {
        const completedDate = parseISO(p.completedAt)
        if (completedDate >= startOfThisWeek) {
          thisWeek++
        } else if (
          completedDate >= startOfLastWeek &&
          completedDate < startOfThisWeek
        ) {
          lastWeek++
        }
      }
    })

    return { thisWeek, lastWeek }
  }, [filteredProblems, selectedDomain])

  const topicChartData = useMemo(() => {
    if (selectedDomain === 'Custom Sheet' && customData?.topicChartData) {
      return customData.topicChartData
    }

    return filteredTopics
      .map((t: any) => ({
        name: t.name,
        solved: t.solved,
        total: t.total,
        percent: t.total > 0 ? Math.round((t.solved / t.total) * 100) : 0,
      }))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 10)
  }, [filteredTopics, selectedDomain, customData])

  // Icon mapping for buttons
  const _getIconForDomain = (d: string) => {
    if (d === 'all') return <BarChart3 className="h-3 w-3 mr-1" />
    if (d === 'DSA') return <Code2 className="h-3 w-3 mr-1" />
    if (d === 'Core Engineering') return <Cpu className="h-3 w-3 mr-1" />
    if (d === 'Custom Sheet')
      return <FileSpreadsheet className="h-3 w-3 mr-1" />
    return null
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Refined Header - Always Rendered for better LCP */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b pb-8 border-border/50">
        <div className="space-y-3">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-primary">
              ANALYTICS
            </h2>
            <p className="text-muted-foreground font-medium">
              Real-time performance decoding.
            </p>
          </div>
          {/* Domain Filter */}
          <div className="flex flex-wrap gap-2">
            {domains.map((domain) => (
              <Button
                key={domain}
                variant={selectedDomain === domain ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateParams({ domain: domain })}
                className={cn(
                  'h-8 text-xs font-bold uppercase tracking-wider',
                  selectedDomain === domain &&
                    'bg-primary text-primary-foreground'
                )}
              >
                {domain === 'all' ? (
                  <>
                    <BarChart3 className="h-3 w-3 mr-1" /> All
                  </>
                ) : domain === 'DSA' ? (
                  <>
                    <Code2 className="h-3 w-3 mr-1" /> DSA
                  </>
                ) : domain === 'Core Engineering' ? (
                  <>
                    <Cpu className="h-3 w-3 mr-1" /> Core Engineering
                  </>
                ) : (
                  domain
                )}
              </Button>
            ))}
          </div>
          {selectedDomain === 'Custom Sheet' && (
            <div className="flex items-center gap-3 pt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-2">
                Viewing Sheet:
              </span>
              {currentSheet && (
                <span className="text-sm font-black uppercase tracking-tight text-orange-600">
                  {currentSheet.name}
                </span>
              )}
              <SheetSelector
                currentSheetId={selectedSheetId}
                sheets={sheets}
                onSelect={(id) => updateParams({ sheetId: id })}
                onCreateNew={() => setShowFormatDialog(true)}
                className="w-[180px]"
                readOnly={true}
              />
            </div>
          )}
        </div>
        <div className="flex gap-3">
          {!mounted || loading ? (
            <>
              <div className="bg-card border h-16 w-24 rounded-2xl animate-pulse" />
              <div className="bg-card border h-16 w-24 rounded-2xl animate-pulse" />
            </>
          ) : (
            <>
              <div className="bg-card border h-16 px-6 rounded-2xl flex items-center gap-4 shadow-sm">
                <Trophy className="h-6 w-6 text-primary" />
                <div className="flex flex-col">
                  <span className="text-xl font-black leading-none">
                    {completedToday}
                  </span>
                  <span className="text-[9px] font-black uppercase opacity-40">
                    Today
                  </span>
                </div>
              </div>
              <div className="bg-card border h-16 px-6 rounded-2xl flex items-center gap-4 shadow-sm">
                <Medal className="h-6 w-6 text-primary" />
                <div className="flex flex-col">
                  <span className="text-xl font-black leading-none">
                    {streak}
                  </span>
                  <span className="text-[9px] font-black uppercase opacity-40">
                    Streak
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Hidden Upload Input */}
      <input
        type="file"
        accept=".xlsx,.csv"
        className="hidden"
        ref={hiddenFileInputRef}
        onChange={handleFileUpload}
        disabled={uploading}
      />

      <SheetRequirementsDialog
        open={showFormatDialog}
        onOpenChange={setShowFormatDialog}
        onConfirm={() => hiddenFileInputRef.current?.click()}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {!mounted || loading ? (
              Array(5)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={_?.id || _?._id || i}
                    className="h-32 bg-card border rounded-2xl animate-pulse"
                  />
                ))
            ) : (
              <>
                <MetricCard
                  title="Total XP"
                  value={stats.totalXP.toLocaleString()}
                  icon={Trophy}
                  color="primary"
                />
                <MetricCard
                  title="Overall"
                  value={`${stats.percent.toFixed(0)}%`}
                  icon={TrendingUp}
                  color="primary"
                />
                <MetricCard
                  title="Easy"
                  value={stats.easy.done}
                  icon={Target}
                  color="green"
                />
                <MetricCard
                  title="Medium"
                  value={stats.medium.done}
                  icon={BarChart3}
                  color="yellow"
                />
                <MetricCard
                  title="Hard"
                  value={stats.hard.done}
                  icon={Flame}
                  color="red"
                />
              </>
            )}
          </div>

          <div className="space-y-6">
            <ChartCard
              title="30-Day XP Velocity"
              icon={Rocket}
              iconColor="text-primary"
              delay={0}
              className="h-[400px] border-none bg-muted/20 shadow-none"
            >
              <ChartContainer
                height="h-[300px]"
                isEmpty={!mounted || loading ? false : stats.totalXP === 0}
                emptyMessage="Complete your first problem to see your XP velocity chart."
              >
                {!mounted || loading ? (
                  <div className="h-full w-full bg-muted/30 animate-pulse rounded-2xl" />
                ) : (
                  <XPVelocityChart data={trendData} />
                )}
              </ChartContainer>
            </ChartCard>

            <ChartCard
              title={
                selectedDomain === 'all'
                  ? 'Strongest Patterns'
                  : `${selectedDomain} Patterns`
              }
              description={
                selectedDomain === 'Custom Sheet'
                  ? `${customData?.totalPatterns || 0} topics • High-fidelity mastery distribution`
                  : `${filteredTopics.length} topic${filteredTopics.length !== 1 ? 's' : ''} • High-fidelity mastery distribution`
              }
              icon={Target}
              iconColor="text-orange-500"
              delay={1}
              className="h-[480px] border-none bg-muted/20 shadow-none"
            >
              <ChartContainer
                height="h-[360px]"
                isEmpty={
                  !mounted || loading ? false : topicChartData.length === 0
                }
                emptyMessage={
                  selectedDomain !== 'all'
                    ? `Switch domains to see topics.`
                    : `Topics will appear here once you start solving problems.`
                }
              >
                {!mounted || loading ? (
                  <div className="h-full w-full bg-muted/30 animate-pulse rounded-2xl" />
                ) : (
                  <MasteryBarChart data={topicChartData} />
                )}
              </ChartContainer>
            </ChartCard>
          </div>
        </div>

        {/* Sidebar: Focused Analytics & Proof of Work */}
        <div className="lg:col-span-4 space-y-6">
          {/* Difficulty Distribution */}
          <ChartCard
            title="Difficulty Distribution"
            description="Problems solved by difficulty"
            icon={Target}
            iconColor="text-orange-500"
            delay={2}
            className="border-none bg-muted/20 shadow-none"
          >
            <ChartContainer height="h-[200px]">
              {!mounted || loading ? (
                <div className="h-full w-full bg-muted/30 animate-pulse rounded-2xl" />
              ) : (
                <DifficultyPieChart
                  data={{
                    easy: stats.easy,
                    medium: stats.medium,
                    hard: stats.hard,
                  }}
                />
              )}
            </ChartContainer>
          </ChartCard>

          {/* Activity Heatmap */}
          <div className="bg-card border rounded-[32px] p-6 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-md bg-orange-500/10">
                <Activity className="h-4 w-4 text-orange-500" />
              </div>
              <h3 className="text-base font-bold uppercase tracking-tight">
                Activity Heatmap
              </h3>
            </div>
            {!mounted || loading ? (
              <div className="space-y-6">
                <div className="h-16 bg-muted/30 animate-pulse rounded-2xl" />
                <div className="h-32 bg-muted/30 animate-pulse rounded-2xl" />
              </div>
            ) : (
              <>
                <ActivityHeatmap data={activityData} />
              </>
            )}
          </div>

          {/* Weekly Comparison */}
          <ChartCard
            title="Weekly Progress"
            description="Problems solved this week vs last week"
            icon={BarChart3}
            iconColor="text-orange-500"
            delay={3}
            className="border-none bg-muted/20 shadow-none"
          >
            {!mounted || loading ? (
              <div className="h-16 w-full bg-muted/30 animate-pulse rounded-2xl" />
            ) : (
              <WeeklyComparison data={weeklyData} />
            )}
          </ChartCard>
        </div>
      </div>
    </div>
  )
}

export function AnalyticsDashboard() {
  return (
    <React.Suspense
      fallback={
        <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto h-screen animate-pulse bg-muted/5 rounded-3xl" />
      }
    >
      <AnalyticsDashboardInner />
    </React.Suspense>
  )
}

interface MetricCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  color: 'primary' | 'green' | 'yellow' | 'red'
}

function MetricCard({ title, value, icon: Icon, color }: MetricCardProps) {
  const colorMap: Record<string, string> = {
    primary: 'text-primary border-primary/20',
    green: 'text-green-500 border-green-500/20',
    yellow: 'text-orange-500 border-orange-500/20',
    red: 'text-red-500 border-red-500/20',
  }

  return (
    <div className="bg-card/60 backdrop-blur-xl border border-border/40 p-6 rounded-3xl flex flex-col gap-4 shadow-sm group hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 active:scale-[0.98]">
      <div
        className={cn(
          'p-2 w-10 h-10 rounded-xl border flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-white',
          colorMap[color]
        )}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl sm:text-3xl font-black tabular-nums tracking-tighter shrink-0">
          {value}
        </span>
        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mt-1">
          {title}
        </span>
      </div>
    </div>
  )
}
