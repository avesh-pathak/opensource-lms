'use client'

import { useState, useRef } from 'react'
import {
  Share2,
  Download,
  Trophy,
  Flame,
  Award,
  Zap,
  BadgeCheck,
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'

interface ShareableCardProps {
  name: string
  username: string
  image?: string
  bio?: string | null
  stats: {
    totalSolved: number
    easy: number
    medium: number
    hard: number
  }
  joinedAt?: string
}

export function ShareableCardDialog({
  isOpen,
  onClose,
  profile,
}: {
  isOpen: boolean
  onClose: () => void
  profile: ShareableCardProps
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const downloadCard = async () => {
    if (!cardRef.current) {
      toast.error('Card element not found')
      return
    }

    setIsGenerating(true)

    try {
      const { toPng } = await import('html-to-image')
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#FFF7ED',
        cacheBust: true,
        useCORS: true,
      } as any)

      const link = document.createElement('a')
      link.download = `${profile.username}-proof-of-work.png`
      link.href = dataUrl
      link.click()

      toast.success('Card downloaded!', {
        description: 'Share it on social media!',
      })
    } catch (error) {
      console.error('Failed to generate card:', error)
      toast.error('Failed to generate card. Try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const shareCard = async () => {
    if (!cardRef.current) {
      toast.error('Card element not found')
      return
    }

    setIsGenerating(true)

    try {
      const { toBlob } = await import('html-to-image')
      const blob = await toBlob(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#FFF7ED',
        cacheBust: true,
        useCORS: true,
      } as any)

      if (!blob) {
        throw new Error('Failed to generate blob')
      }

      const file = new File([blob], `${profile.username}-proof-of-work.png`, {
        type: 'image/png',
      })

      if (navigator.share && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: `${profile.name}'s Proof of Work`,
            text: `I've solved ${profile.stats.totalSolved} DSA problems! Check out my progress card.`,
            files: [file],
          })
          toast.success('Shared successfully!')
        } catch (err: any) {
          // User cancelled or error
          if (err.name !== 'AbortError') {
            toast.error('Share cancelled')
          }
        }
      } else {
        // Fallback for desktop: Copy image to clipboard
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              [blob.type]: blob,
            }),
          ])
          toast.success('Image copied to clipboard!', {
            description: 'You can now paste it anywhere.',
          })
        } catch (_err) {
          // Double fallback: Download it
          const link = document.createElement('a')
          link.download = `${profile.username}-proof-of-work.png`
          link.href = URL.createObjectURL(blob)
          link.click()
          toast.success('Downloaded instead', {
            description: 'Browser sharing not supported, saved file instead.',
          })
        }
      }
    } catch (error) {
      console.error('Failed to share card:', error)
      toast.error('Failed to share card. Try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const progressPercent = Math.min((profile.stats.totalSolved / 100) * 100, 100)
  const profileUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/u/${profile.username}`
      : `babua.io/u/${profile.username}`

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden bg-transparent border-0">
        {/* Hidden title for accessibility */}
        <DialogTitle className="sr-only">
          Share Your Proof of Work Card
        </DialogTitle>
        <div className="p-6 space-y-6">
          {/* Preview Card */}
          <div
            ref={cardRef}
            className="relative w-full aspect-[3/4] bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 rounded-3xl p-6 shadow-2xl overflow-hidden"
            style={{ minHeight: '400px' }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-400 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-400 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-yellow-300 rounded-full blur-3xl" />
            </div>

            {/* Card Content */}
            <div className="relative h-full flex flex-col justify-between">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xs font-black italic uppercase tracking-[0.15em] text-orange-600">
                    Proof of Work
                  </h3>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-orange-500/70">
                    Registry Card
                  </h4>
                </div>
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[8px] font-black uppercase tracking-widest shadow-lg">
                  <BadgeCheck className="w-3 h-3" />
                  Verified
                </div>
              </div>

              {/* Profile Section with QR Code */}
              <div className="flex-1 flex flex-col items-center justify-center py-4">
                {/* QR Code + Avatar Row - Stack on small cards */}
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-4">
                  {/* QR Code */}
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl opacity-20 blur" />
                    <div className="relative bg-white p-2 rounded-2xl shadow-xl border-2 border-orange-200">
                      <QRCodeSVG
                        value={profileUrl}
                        size={80}
                        bgColor="#ffffff"
                        fgColor="#ea580c"
                        level="M"
                        includeMargin={false}
                      />
                    </div>
                    <p className="text-[6px] font-black uppercase tracking-widest text-orange-600/60 text-center mt-1">
                      Scan to verify
                    </p>
                  </div>

                  {/* Avatar */}
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full opacity-30 blur-md" />
                    <Avatar className="relative w-20 h-20 border-4 border-white shadow-2xl">
                      <AvatarImage
                        src={profile.image}
                        alt={profile.name}
                        crossOrigin="anonymous"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-orange-400 to-amber-500 text-white font-black text-2xl">
                        {profile.name?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                <h2 className="text-xl font-black text-gray-900 tracking-tight text-center">
                  {profile.name}
                </h2>
                <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                  @{profile.username}
                </p>

                {profile.bio && (
                  <p className="text-xs text-gray-600 text-center mt-2 max-w-[200px] italic">
                    &quot;{profile.bio}&quot;
                  </p>
                )}
              </div>

              {/* Stats Grid */}
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center shadow-md">
                    <Trophy className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                    <p className="text-xl font-black text-orange-600">
                      {profile.stats.totalSolved}
                    </p>
                    <p className="text-[7px] font-bold uppercase tracking-widest text-gray-500">
                      Total
                    </p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center shadow-md">
                    <Zap className="w-5 h-5 text-green-500 mx-auto mb-1" />
                    <p className="text-xl font-black text-green-600">
                      {profile.stats.easy}
                    </p>
                    <p className="text-[7px] font-bold uppercase tracking-widest text-gray-500">
                      Easy
                    </p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center shadow-md">
                    <Flame className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                    <p className="text-xl font-black text-yellow-600">
                      {profile.stats.medium}
                    </p>
                    <p className="text-[7px] font-bold uppercase tracking-widest text-gray-500">
                      Medium
                    </p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center shadow-md">
                    <Award className="w-5 h-5 text-red-500 mx-auto mb-1" />
                    <p className="text-xl font-black text-red-600">
                      {profile.stats.hard}
                    </p>
                    <p className="text-[7px] font-bold uppercase tracking-widest text-gray-500">
                      Hard
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-600">
                      DSA Blueprint
                    </p>
                    <p className="text-[8px] font-black text-orange-600">
                      {Math.round(progressPercent)}%
                    </p>
                  </div>
                  <div className="h-2 bg-orange-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">
                  babua.io/u/{profile.username}
                </p>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                  Powered by Babua DSA
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={downloadCard}
              disabled={isGenerating}
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold shadow-lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Card
            </Button>
            <Button
              onClick={shareCard}
              disabled={isGenerating}
              variant="outline"
              className="flex-1 h-12 rounded-xl border-2 border-orange-300 text-orange-600 hover:bg-orange-50 font-bold"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
