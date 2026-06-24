'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type LeaderboardEntry } from '@/lib/data/leaderboard'
import {
  Flame,
  Search,
  TrendingUp,
  Users,
  School,
  Globe,
  ExternalLink,
} from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
import { useProblems } from '@/components/learning/problems-provider'
import { useAuth } from '@/lib/auth-context'

export default function LeaderboardPage() {
  const router = useRouter()
  const { problems } = useProblems()
  const { user: authUser } = useAuth()
  const [activeTab, setActiveTab] = useState<'global' | 'college' | 'friends'>(
    'global'
  )
  const [timeRange, setTimeRange] = useState<'weekly' | 'alltime'>('alltime')
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [mounted, setMounted] = useState(false)
  const [, setIsLoading] = useState(true)

  // Navigate to profile by username search
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      const exactMatch = sortedData.find(
        (u) =>
          u.username?.toLowerCase() === searchTerm.toLowerCase() ||
          u.name.toLowerCase() === searchTerm.toLowerCase()
      )
      if (exactMatch?.username) {
        router.push(`/u/${exactMatch.username}`)
      } else {
        toast.info('No exact match', {
          description: 'Showing filtered results',
        })
      }
    }
  }

  useEffect(() => {
    setMounted(true)
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('/api/leaderboard')
        const data = await res.json()
        if (data.leaderboard) {
          setLeaderboardData(data.leaderboard)
        }
      } catch (err) {
        console.error('Failed to fetch leaderboard', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLeaderboard()
  }, [])

  // Dynamic calculations for current user
  const solvedProblems = problems.filter((p) => p.status === 'Completed')
  const solvedCount = solvedProblems.length

  // Dynamic calculations with weighted points (Matched with Server)
  const pointsMap = { Easy: 10, Medium: 30, Hard: 100 }
  const dynamicPoints = solvedProblems.reduce(
    (acc, p) => acc + (pointsMap[p.difficulty as keyof typeof pointsMap] || 10),
    0
  )

  const dynamicTier = getTier(dynamicPoints)

  const _pointsToday = solvedProblems
    .filter(
      (p) =>
        p.completedAt &&
        new Date(p.completedAt).toDateString() === new Date().toDateString()
    )
    .reduce(
      (acc, p) =>
        acc + (pointsMap[p.difficulty as keyof typeof pointsMap] || 10),
      0
    )

  // Identify current user in the leaderboard list or use dynamic data
  const enrichedData = leaderboardData.map((u) => ({
    ...u,
    isCurrentUser:
      authUser?.name === u.name || authUser?.username === u.username,
  }))

  const currentUser =
    enrichedData.find((u) => u.isCurrentUser) ||
    (authUser
      ? {
          rank: '>100',
          name: authUser.name,
          username: authUser.username,
          avatar: authUser.image || '',
          college: authUser.college || 'Unknown',
          points: dynamicPoints,
          problemsSolved: solvedCount,
          weeklyPoints: 0,
          weeklySolved: 0,
          streak: 0,
          tier: dynamicTier,
          isCurrentUser: true,
        }
      : null)

  // Filter by Tab
  let filteredData = [...enrichedData]

  if (activeTab === 'college') {
    const currentUserCollege = currentUser?.college
    if (currentUserCollege) {
      filteredData = filteredData.filter(
        (u) => u.college === currentUserCollege
      )
    }
  } else if (activeTab === 'friends') {
    // Placeholder for friends logic
    filteredData = filteredData.filter((u) => u.isCurrentUser)
  }

  // Pure Sort (creates sorted copy)
  const sortedData = filteredData
    .filter(
      (u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.college.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (timeRange === 'weekly') {
        return (b.weeklyPoints ?? 0) - (a.weeklyPoints ?? 0)
      }
      return b.points - a.points
    })

  const top3 = sortedData.slice(0, 3)
  const others = sortedData.slice(3)

  // Pagination State & Logic
  const [page, setPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const paginatedOthers = others.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  const currentUserRank = sortedData.findIndex((u) => u.isCurrentUser) + 1

  if (!mounted) return <div className="min-h-screen bg-background" />

  return (
    <div className="relative min-h-screen pb-32 bg-background text-foreground overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 p-4 lg:p-6 max-w-7xl mx-auto space-y-8">
        {/* Top Headers Section */}
        <div className="space-y-6">
          {/* Header Row 1: Title & Standing */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/50 backdrop-blur-md">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Global Alpha Standings
                </span>
              </div>
              <div className="space-y-1">
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic leading-[0.8] text-foreground">
                  The <span className="text-orange-500">Elite</span>
                  <br />
                  <span>Builders</span>
                </h1>
              </div>
              <p className="text-muted-foreground font-bold max-w-md text-[10px] uppercase tracking-widest leading-relaxed">
                Proof of Work based rankings. Solve challenges, earn XP.
              </p>
            </div>

            {/* Top Standing Card - Redesigned */}
            {currentUser && (
              <div className="relative group max-w-[500px] w-full lg:ml-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-[32px] blur opacity-10 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-card border border-border rounded-[32px] p-4 flex items-center justify-between gap-6 shadow-xl backdrop-blur-xl">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl border border-border overflow-hidden shadow-2xl">
                        <Image
                          src={currentUser.avatar}
                          className="w-full h-full object-cover"
                          alt={currentUser.name}
                          width={48}
                          height={48}
                          unoptimized
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-card bg-green-500 shadow-lg" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black italic text-orange-500">
                          #{currentUserRank}
                        </span>
                        <h4 className="font-black text-[9px] uppercase tracking-widest text-muted-foreground">
                          Your Identity
                        </h4>
                      </div>
                      <div className="font-black text-lg uppercase tracking-tighter italic text-foreground">
                        {currentUser.name.split(' ').slice(0, 2).join(' ')}
                      </div>
                    </div>
                  </div>

                  <div className="h-10 w-[1px] bg-border" />

                  <div className="flex items-center gap-4 text-right">
                    <div className="space-y-0.5">
                      <div className="text-xl font-black text-foreground italic leading-none tabular-nums">
                        {(timeRange === 'weekly'
                          ? currentUser.weeklyPoints
                          : currentUser.points
                        )?.toLocaleString()}
                      </div>
                      <div className="text-[9px] font-black uppercase text-orange-500/50 tracking-widest leading-none">
                        Total XP
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Header Row 2: Filters & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex bg-secondary/20 p-1 rounded-xl border border-border shadow-inner">
                <button
                  onClick={() => {
                    setTimeRange('alltime')
                    setPage(1)
                  }}
                  className={cn(
                    'px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all',
                    timeRange === 'alltime'
                      ? 'bg-background text-foreground shadow-lg border border-border'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  All-time
                </button>
                <button
                  onClick={() => {
                    setTimeRange('weekly')
                    setPage(1)
                  }}
                  className={cn(
                    'px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all',
                    timeRange === 'weekly'
                      ? 'bg-background text-foreground shadow-lg border border-border'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  Weekly
                </button>
              </div>
              <div className="h-6 w-[1px] bg-border mx-2 hidden lg:block" />
              <div className="flex gap-2">
                <TabButton
                  active={activeTab === 'global'}
                  onClick={() => {
                    setActiveTab('global')
                    setPage(1)
                  }}
                  icon={Globe}
                >
                  Global
                </TabButton>
                <TabButton
                  active={activeTab === 'college'}
                  onClick={() => {
                    setActiveTab('college')
                    setPage(1)
                  }}
                  icon={School}
                >
                  College
                </TabButton>
                <TabButton
                  active={activeTab === 'friends'}
                  onClick={() => {
                    setActiveTab('friends')
                    setPage(1)
                  }}
                  icon={Users}
                >
                  Circle
                </TabButton>
              </div>
            </div>
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-orange-500 transition-colors" />
              <Input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setPage(1)
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search by username... (Enter to go)"
                className="pl-10 rounded-xl border-border focus:ring-orange-500/20 focus:border-orange-500/50 h-11 text-sm shadow-lg bg-card placeholder:text-muted-foreground/50 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Podium (Top 3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-2">
          <PodiumCard
            entry={top3[1]}
            place={2}
            className="md:order-1 scale-95"
            timeRange={timeRange}
          />
          <PodiumCard
            entry={top3[0]}
            place={1}
            className="md:order-2 md:scale-105 md:-translate-y-6"
            timeRange={timeRange}
          />
          <PodiumCard
            entry={top3[2]}
            place={3}
            className="md:order-3 scale-95"
            timeRange={timeRange}
          />
        </div>

        {/* Rankings Table */}
        <div className="bg-card rounded-[40px] border border-border shadow-2xl overflow-hidden backdrop-blur-3xl relative">
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/[0.01] to-transparent pointer-events-none" />

          <div className="p-8 border-b border-border flex items-center justify-between relative z-10">
            <h3 className="font-black uppercase tracking-[0.2em] flex items-center gap-4 text-sm italic text-foreground">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              {activeTab} STANDINGS
            </h3>
            <div className="flex items-center gap-4">
              <div className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.3em] bg-secondary/30 px-4 py-2 rounded-full border border-border">
                Session Live Sync
              </div>
            </div>
          </div>

          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-foreground/[0.01]">
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-muted-foreground tracking-[0.3em]">
                    Pos
                  </th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-muted-foreground tracking-[0.3em]">
                    Engineer
                  </th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-muted-foreground tracking-[0.3em]">
                    Output
                  </th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-muted-foreground tracking-[0.3em] text-center">
                    Heat
                  </th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-muted-foreground tracking-[0.3em] text-right">
                    XP Capital
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedOthers.map((user, idx) => (
                  <tr
                    key={user.name}
                    onClick={() =>
                      user.username && router.push(`/u/${user.username}`)
                    }
                    className={cn(
                      'group transition-all duration-500 cursor-pointer',
                      user.isCurrentUser
                        ? 'bg-orange-500/[0.03] hover:bg-orange-500/[0.06]'
                        : 'hover:bg-foreground/[0.02]'
                    )}
                  >
                    <td className="px-10 py-8">
                      <span
                        className={cn(
                          'font-black text-2xl italic tabular-nums transition-opacity duration-500',
                          user.isCurrentUser
                            ? 'text-orange-500 opacity-100'
                            : 'text-muted-foreground/20 group-hover:text-muted-foreground/50'
                        )}
                      >
                        #{startIndex + idx + 4}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-2xl border border-border overflow-hidden bg-secondary/50 shadow-2xl group-hover:border-orange-500/50 transition-colors">
                            <Image
                              src={user.avatar}
                              className="w-full h-full object-cover"
                              alt={user.name}
                              width={56}
                              height={56}
                              unoptimized
                            />
                          </div>
                          <div
                            className={cn(
                              'absolute -bottom-2 -right-2 px-2.5 py-1 rounded-lg text-[8px] font-black uppercase border shadow-2xl backdrop-blur-md',
                              getTierColor(user.tier)
                            )}
                          >
                            {user.tier}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div
                            className={cn(
                              'font-black text-lg uppercase tracking-tight italic transition-colors flex items-center gap-2',
                              user.isCurrentUser
                                ? 'text-orange-500'
                                : 'text-foreground group-hover:text-orange-500'
                            )}
                          >
                            {user.name
                              .replace(' (You)', '')
                              .split(' ')
                              .slice(0, 2)
                              .join(' ')}
                            {user.isCurrentUser && (
                              <span className="text-[10px] border border-orange-500/50 text-orange-500 px-2 py-0.5 rounded-full not-italic tracking-widest">
                                YOU
                              </span>
                            )}
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                          </div>
                          <div className="text-[10px] font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-widest">
                            <School className="w-3.5 h-3.5 opacity-50" />
                            {user.college}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          <span>
                            {timeRange === 'weekly'
                              ? user.weeklySolved
                              : user.problemsSolved}{' '}
                            SOLVED
                          </span>
                          <span className="text-muted-foreground/30">
                            {((user.problemsSolved / 150) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="h-1.5 w-40 bg-secondary/50 rounded-full overflow-hidden border border-border">
                          <Progress
                            value={(user.problemsSolved / 150) * 100}
                            className="bg-orange-500 h-full transition-all duration-1000"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 font-black text-2xl text-orange-600 italic">
                          <Flame className="w-5 h-5 fill-current" />
                          {user.streak}
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                          Streak
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="space-y-1.5">
                        <div className="font-black text-3xl text-foreground italic tracking-tighter tabular-nums leading-none">
                          {(timeRange === 'weekly'
                            ? user.weeklyPoints
                            : user.points
                          ).toLocaleString()}
                        </div>
                        <div className="text-[9px] font-black uppercase tracking-[0.3em] text-orange-500/40">
                          Growth XP
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        {others.length > 0 && (
          <div className="py-8">
            <Pagination>
              <PaginationContent className="gap-2">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (page > 1) setPage((p) => p - 1)
                    }}
                    className={cn(
                      'text-[10px] font-black uppercase tracking-widest rounded-xl border-border hover:border-orange-500/50 hover:bg-orange-500/5',
                      page === 1 && 'pointer-events-none opacity-50'
                    )}
                  />
                </PaginationItem>

                {/* Page Numbers */}
                {(() => {
                  const totalPages = Math.max(
                    1,
                    Math.ceil(others.length / ITEMS_PER_PAGE)
                  )
                  const pages: (number | 'ellipsis')[] = []

                  if (totalPages <= 5) {
                    for (let i = 1; i <= totalPages; i++) pages.push(i)
                  } else {
                    pages.push(1)
                    if (page > 3) pages.push('ellipsis')
                    for (
                      let i = Math.max(2, page - 1);
                      i <= Math.min(totalPages - 1, page + 1);
                      i++
                    ) {
                      pages.push(i)
                    }
                    if (page < totalPages - 2) pages.push('ellipsis')
                    pages.push(totalPages)
                  }

                  return pages.map((p, idx) => (
                    <PaginationItem key={idx}>
                      {p === 'ellipsis' ? (
                        <PaginationEllipsis className="text-muted-foreground" />
                      ) : (
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setPage(p)
                          }}
                          isActive={page === p}
                          className={cn(
                            'text-[10px] font-black uppercase tracking-widest rounded-xl w-10 h-10',
                            page === p
                              ? 'border-orange-500 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20'
                              : 'border-border hover:border-orange-500/50 hover:bg-orange-500/5'
                          )}
                        >
                          {p}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))
                })()}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (page * ITEMS_PER_PAGE < others.length)
                        setPage((p) => p + 1)
                    }}
                    className={cn(
                      'text-[10px] font-black uppercase tracking-widest rounded-xl border-border hover:border-orange-500/50 hover:bg-orange-500/5',
                      page * ITEMS_PER_PAGE >= others.length &&
                        'pointer-events-none opacity-50'
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}

function PodiumCard({
  entry,
  place,
  className,
  timeRange,
}: {
  entry?: LeaderboardEntry
  place: number
  className?: string
  timeRange: string
}) {
  if (!entry)
    return (
      <div
        className={cn('invisible min-h-[300px]', className)}
        aria-hidden="true"
      />
    )

  const colors = {
    1: {
      border: 'border-orange-500/50',
      bg: 'bg-orange-500/10',
      text: 'text-orange-500',
      glow: 'shadow-orange-500/20',
      icon: 'bg-orange-500',
    },
    2: {
      border: 'border-zinc-500/30',
      bg: 'bg-zinc-500/5',
      text: 'text-zinc-400',
      glow: 'shadow-zinc-500/10',
      icon: 'bg-zinc-600',
    },
    3: {
      border: 'border-zinc-700/30',
      bg: 'bg-zinc-700/5',
      text: 'text-zinc-500',
      glow: 'shadow-zinc-700/10',
      icon: 'bg-zinc-800',
    },
  }[place as 1 | 2 | 3] || {
    border: 'border-border',
    bg: 'bg-card/10',
    text: 'text-muted-foreground',
    glow: '',
    icon: 'bg-card',
  }

  const cardContent = (
    <>
      <div
        className={cn(
          'absolute -top-6 w-14 h-14 rounded-[20px] border-4 border-background flex items-center justify-center text-white font-black text-2xl shadow-2xl',
          colors.icon
        )}
      >
        {place}
      </div>

      <div className="relative">
        <div className="absolute -inset-4 bg-foreground/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="relative w-32 h-32 rounded-[32px] border-2 border-border overflow-hidden shadow-2xl group-hover:border-orange-500/50 transition-colors">
          <Image
            src={entry.avatar}
            className="object-cover scale-110 group-hover:scale-125 transition-transform duration-1000"
            alt={entry.name}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>

      <div className="text-center space-y-3">
        <h3 className="font-black text-2xl tracking-tight leading-none group-hover:text-orange-500 transition-colors uppercase italic text-foreground">
          {entry.name.split(' ').slice(0, 2).join(' ')}
        </h3>
        <div className="flex flex-col items-center gap-2">
          <Badge
            variant="secondary"
            className={cn(
              'text-[8px] font-black uppercase px-3 py-1 rounded-full border',
              getTierColor(entry.tier)
            )}
          >
            {entry.tier}
          </Badge>
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            {entry.college}
          </span>
        </div>
      </div>

      <div className="w-full grid grid-cols-2 gap-6 pt-6 border-t border-border">
        <div className="text-center border-r border-border space-y-1">
          <div className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">
            Growth
          </div>
          <div className="font-black text-2xl text-foreground tracking-tighter italic">
            {(timeRange === 'weekly'
              ? entry.weeklyPoints
              : entry.points
            ).toLocaleString()}
          </div>
        </div>
        <div className="text-center space-y-1">
          <div className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">
            Solved
          </div>
          <div className="font-black text-2xl text-foreground tracking-tighter italic">
            {timeRange === 'weekly' ? entry.weeklySolved : entry.problemsSolved}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 px-6 py-2 rounded-2xl bg-secondary/50 border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:bg-orange-500 group-hover:text-white transition-all duration-500">
        <Flame className="w-3.5 h-3.5 fill-current" />
        {entry.streak} Day Heat
      </div>
    </>
  )

  // Wrap with Link if username exists
  if (entry.username) {
    return (
      <Link
        href={`/u/${entry.username}`}
        className={cn(
          'relative p-8 rounded-[40px] border-2 bg-card shadow-2xl flex flex-col items-center gap-8 transition-all duration-700 hover:scale-[1.05] group cursor-pointer',
          colors.border,
          colors.glow,
          className
        )}
      >
        {cardContent}
      </Link>
    )
  }

  return (
    <div
      className={cn(
        'relative p-8 rounded-[40px] border-2 bg-card shadow-2xl flex flex-col items-center gap-8 transition-all duration-700 hover:scale-[1.05] group',
        colors.border,
        colors.glow,
        className
      )}
    >
      {cardContent}
    </div>
  )
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean
  onClick: () => void
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-xl font-black uppercase tracking-[0.1em] text-[9px] transition-all duration-500',
        active
          ? 'bg-primary text-primary-foreground shadow-lg dark:shadow-[0_10px_30px_rgba(255,255,255,0.05)] scale-105'
          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
      )}
    >
      <Icon
        className={cn('w-3.5 h-3.5', active ? 'text-orange-500' : 'opacity-40')}
      />
      {children}
    </button>
  )
}

function getTier(points: number) {
  if (points >= 2000) return 'Diamond'
  if (points >= 1000) return 'Platinum'
  if (points >= 500) return 'Gold'
  if (points >= 200) return 'Silver'
  return 'Bronze'
}

function getTierColor(tier: string) {
  switch (tier) {
    case 'Diamond':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    case 'Platinum':
      return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
    case 'Gold':
      return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
    case 'Silver':
      return 'bg-zinc-400/10 text-zinc-400 border-zinc-400/20'
    case 'Bronze':
      return 'bg-orange-900/10 text-orange-700 border-orange-900/20'
    default:
      return 'bg-secondary text-muted-foreground'
  }
}
