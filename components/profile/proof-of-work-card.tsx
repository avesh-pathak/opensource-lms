'use client'

import { useState, useRef } from 'react'
import { Share2, Check, BadgeCheck } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ProofOfWorkCardProps {
  name: string
  username: string
  image?: string
  bio?: string | null
  stats: {
    totalSolved: number
    easy: number
    medium: number
    hard: number
    domains: Record<string, number>
  }
  isVerified?: boolean
}

export function ProofOfWorkCard({
  name,
  username,
  image,
  bio: _bio,
  stats,
  isVerified = false,
}: ProofOfWorkCardProps) {
  const [copied, setCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Calculate mastery
  const _totalTopics = 20 // You can make this dynamic based on your curriculum
  const topicsMastered = Object.keys(stats.domains).length
  const progressPercent = Math.min((stats.totalSolved / 100) * 100, 100) // 100 problems = 100%

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/u/${username}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${name}'s Proof of Work`,
          text: `Check out ${name}'s DSA progress - ${stats.totalSolved} problems solved!`,
          url: shareUrl,
        })
      } catch (_err) {
        // User cancelled or share failed, fallback to copy
        copyToClipboard(shareUrl)
      }
    } else {
      copyToClipboard(shareUrl)
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success('Link copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div ref={cardRef} className="relative w-full max-w-md mx-auto">
      {/* Card */}
      <div className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 dark:from-orange-950/30 dark:via-amber-950/20 dark:to-orange-900/30 rounded-3xl p-6 shadow-2xl shadow-orange-500/10 border border-orange-200/50 dark:border-orange-800/30 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-black italic uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Proof of Work Registry
            </h3>
            {isVerified && (
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider">
                <BadgeCheck className="w-3 h-3" />
                Verified
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-4 border-white dark:border-orange-900/50 shadow-lg">
              <AvatarImage src={image} alt={name} />
              <AvatarFallback className="bg-orange-500 text-white font-bold text-xl">
                {name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                {name}
              </h2>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                @{username}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-orange-200/30 dark:border-orange-800/20">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1">
                Problems Solved
              </p>
              <p className="text-3xl font-black text-orange-600 dark:text-orange-400">
                {stats.totalSolved}
              </p>
            </div>
            <div className="bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-orange-200/30 dark:border-orange-800/20">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1">
                Domains Covered
              </p>
              <p className="text-3xl font-black text-gray-900 dark:text-white">
                {String(topicsMastered).padStart(2, '0')}
              </p>
            </div>
          </div>

          {/* Difficulty Split */}
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-xl px-3 py-2 text-center border border-green-200/50 dark:border-green-800/20">
              <p className="text-xs font-bold text-green-600 dark:text-green-400">
                {stats.easy}
              </p>
              <p className="text-[8px] font-bold uppercase text-gray-500">
                Easy
              </p>
            </div>
            <div className="flex-1 bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-xl px-3 py-2 text-center border border-yellow-200/50 dark:border-yellow-800/20">
              <p className="text-xs font-bold text-yellow-600 dark:text-yellow-400">
                {stats.medium}
              </p>
              <p className="text-[8px] font-bold uppercase text-gray-500">
                Medium
              </p>
            </div>
            <div className="flex-1 bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-xl px-3 py-2 text-center border border-red-200/50 dark:border-red-800/20">
              <p className="text-xs font-bold text-red-600 dark:text-red-400">
                {stats.hard}
              </p>
              <p className="text-[8px] font-bold uppercase text-gray-500">
                Hard
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">
                DSA Blueprint Progress
              </p>
              <p className="text-xs font-bold text-orange-600 dark:text-orange-400">
                {Math.round(progressPercent)}% Complete
              </p>
            </div>
            <div className="h-3 bg-orange-200/50 dark:bg-orange-900/30 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" />
            </div>
          </div>

          {/* Share Button */}
          <Button
            onClick={handleShare}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black uppercase tracking-wider shadow-lg shadow-orange-500/30 transition-[transform,background-color] hover:scale-[1.02] active:scale-[0.98]"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5 mr-2" />
                Share Profile
              </>
            )}
          </Button>
        </div>

        {/* Corner Accent */}
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-2xl" />
      </div>
    </div>
  )
}
