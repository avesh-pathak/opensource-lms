'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Code2,
  Linkedin,
  FileText,
  Calendar,
  Trophy,
  Flame,
  Lock,
  Award,
  Share2,
  Check,
  BadgeCheck,
  Zap,
  TrendingUp,
  ArrowLeft,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ActivityHeatmap } from '@/components/profile/activity-heatmap'
import { ShareableCardDialog } from '@/components/shared/shareable-card-dialog'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { toast } from 'sonner'

interface PublicProfile {
  username: string
  name: string
  image: string
  bio: string | null
  linkedIn: string | null
  leetCode: string | null
  resume: string | null
  joinedAt: string
  stats: {
    totalSolved: number
    easy: number
    medium: number
    hard: number
    domains: Record<string, number>
  }
  activityData: { date: string; count: number }[]
}

export default function PublicProfilePage() {
  const params = useParams()
  const router = useRouter()
  const username = params.username as string

  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/public/user/${username}`)
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Profile not found')
        }
        const data = await res.json()
        setProfile(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (username) fetchProfile()
  }, [username])

  const handleShare = () => {
    setShowShareDialog(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="space-y-4 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 animate-pulse mx-auto shadow-xl shadow-orange-500/30" />
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">
            Loading profile...
          </p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-md w-full mx-4">
          <Card className="border-2 border-dashed border-orange-200 dark:border-orange-900/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardContent className="pt-12 pb-8 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto">
                <Lock className="w-10 h-10 text-orange-400" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-black uppercase italic tracking-tighter">
                  Profile Not Found
                </h1>
                <p className="text-muted-foreground">
                  This profile doesn&apos;t exist or is set to private.
                </p>
              </div>
              <Link href="/">
                <Button className="mt-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold">
                  Go Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const { stats } = profile
  const topDomains = Object.entries(stats.domains)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const progressPercent = Math.min((stats.totalSolved / 100) * 100, 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/50 to-yellow-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-orange-200/30 to-amber-200/30 dark:from-orange-900/10 dark:to-amber-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-yellow-200/30 to-orange-200/30 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-8 lg:py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 group hover:bg-orange-500/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:text-orange-500 transition-colors" />
          <span className="text-sm font-bold uppercase tracking-widest group-hover:text-orange-500 transition-colors">
            Back
          </span>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Proof of Work Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Premium Card */}
              <div className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 dark:from-orange-950/40 dark:via-amber-950/30 dark:to-orange-900/40 rounded-3xl p-6 shadow-2xl shadow-orange-500/10 border border-orange-200/50 dark:border-orange-800/30 overflow-hidden">
                {/* Background Glow */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-orange-400 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-400 rounded-full blur-3xl" />
                </div>

                <div className="relative space-y-5">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <h3 className="text-xs font-black italic uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">
                      Proof of Work Registry
                    </h3>
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/30">
                      <BadgeCheck className="w-3 h-3" />
                      Verified
                    </div>
                  </div>

                  {/* Avatar & Name */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full opacity-30 blur" />
                      <Avatar className="relative w-20 h-20 border-4 border-white dark:border-orange-900/50 shadow-xl">
                        <AvatarImage src={profile.image} alt={profile.name} />
                        <AvatarFallback className="bg-gradient-to-br from-orange-400 to-amber-500 text-white font-black text-2xl">
                          {profile.name?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                        {profile.name}
                      </h2>
                      <p className="text-sm font-bold text-orange-600/80 dark:text-orange-400/80 uppercase tracking-wider">
                        @{profile.username}
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  {profile.bio && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic border-l-2 border-orange-300 dark:border-orange-700 pl-3">
                      &quot;{profile.bio}&quot;
                    </p>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-orange-200/50 dark:border-orange-800/30 text-center">
                      <Trophy className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                      <p className="text-3xl font-black text-orange-600 dark:text-orange-400">
                        {stats.totalSolved}
                      </p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                        Total Solved
                      </p>
                    </div>
                    <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-green-200/50 dark:border-green-800/30 text-center">
                      <Zap className="w-6 h-6 text-green-500 mx-auto mb-1" />
                      <p className="text-3xl font-black text-green-600 dark:text-green-400">
                        {stats.easy}
                      </p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                        Easy
                      </p>
                    </div>
                    <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-yellow-200/50 dark:border-yellow-800/30 text-center">
                      <Flame className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                      <p className="text-3xl font-black text-yellow-600 dark:text-yellow-400">
                        {stats.medium}
                      </p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                        Medium
                      </p>
                    </div>
                    <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-red-200/50 dark:border-red-800/30 text-center">
                      <Award className="w-6 h-6 text-red-500 mx-auto mb-1" />
                      <p className="text-3xl font-black text-red-600 dark:text-red-400">
                        {stats.hard}
                      </p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                        Hard
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">
                        Engineering Blueprint
                      </p>
                      <p className="text-xs font-black text-orange-600 dark:text-orange-400">
                        {Math.round(progressPercent)}% Complete
                      </p>
                    </div>
                    <div className="h-3 bg-orange-200/50 dark:bg-orange-900/30 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-full shadow-inner" />
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex flex-wrap gap-2">
                    {profile.linkedIn && (
                      <a
                        href={profile.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0077B5]/10 text-[#0077B5] hover:bg-[#0077B5]/20 transition-colors text-xs font-bold"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                        LinkedIn
                      </a>
                    )}
                    {profile.leetCode && (
                      <a
                        href={profile.leetCode}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 transition-colors text-xs font-bold"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        LeetCode
                      </a>
                    )}
                    {profile.resume && (
                      <a
                        href={profile.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors text-xs font-bold"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Resume
                      </a>
                    )}
                  </div>

                  {/* Share Button */}
                  <Button
                    onClick={handleShare}
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 text-white font-black uppercase tracking-wider shadow-xl shadow-orange-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] border-0"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Link Copied!
                      </>
                    ) : (
                      <>
                        <Share2 className="w-5 h-5 mr-2" />
                        Share Profile
                      </>
                    )}
                  </Button>

                  {/* Joined Date */}
                  <p className="text-[10px] text-center text-gray-500 dark:text-gray-500 flex items-center justify-center gap-1 uppercase tracking-widest font-bold">
                    <Calendar className="w-3 h-3" />
                    Joined{' '}
                    {new Date(profile.joinedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Activity & Domains */}
          <div className="lg:col-span-2 space-y-6">
            {/* 30-Day Activity */}
            <Card className="border-orange-200/50 dark:border-orange-800/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl shadow-orange-500/5 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <Flame className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">
                    30-Day Activity
                  </h3>
                </div>
                <ActivityHeatmap data={profile.activityData} />
                <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest font-bold mt-4">
                  Rolling 30-Day Execution Protocol
                </p>
              </div>
            </Card>

            {/* Domain Progress */}
            {topDomains.length > 0 && (
              <Card className="border-orange-200/50 dark:border-orange-800/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl shadow-orange-500/5 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">
                      Domain Mastery
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {topDomains.map(([domain, count], i) => (
                      <div key={domain} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-bold text-gray-700 dark:text-gray-300">
                            {domain}
                          </span>
                          <span className="font-black text-orange-600 dark:text-orange-400">
                            {count} solved
                          </span>
                        </div>
                        <div className="h-2.5 bg-orange-100 dark:bg-orange-900/30 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              i === 0
                                ? 'bg-gradient-to-r from-orange-500 to-amber-500'
                                : i === 1
                                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                  : i === 2
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                    : 'bg-gradient-to-r from-gray-400 to-gray-500'
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-12 pb-8">
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-black">
            Powered by Babua DSA
          </p>
        </div>
      </div>

      {/* Shareable Card Dialog */}
      {profile && (
        <ShareableCardDialog
          isOpen={showShareDialog}
          onClose={() => setShowShareDialog(false)}
          profile={{
            name: profile.name,
            username: profile.username,
            image: profile.image,
            bio: profile.bio,
            stats: {
              totalSolved: profile.stats.totalSolved,
              easy: profile.stats.easy,
              medium: profile.stats.medium,
              hard: profile.stats.hard,
            },
            joinedAt: profile.joinedAt,
          }}
        />
      )}
    </div>
  )
}
