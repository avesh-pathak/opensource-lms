'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface LikeButtonProps {
  postId: string
  initialLiked: boolean
  initialCount: number
  userId?: string
  onUpdate?: () => void
  className?: string
}

export function LikeButton({
  postId,
  initialLiked,
  initialCount,
  userId,
  onUpdate,
  className,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [isLoading, setIsLoading] = useState(false)

  const toggleLike = async () => {
    if (!userId) {
      toast.error('Please login to like posts')
      return
    }

    setIsLoading(true)

    // Optimistic update
    const prevLiked = liked
    const prevCount = count
    setLiked(!liked)
    setCount(liked ? count - 1 : count + 1)

    try {
      const res = await fetch('/api/community/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, userId }),
      })

      if (!res.ok) throw new Error('Failed to toggle like')

      const data = await res.json()
      setLiked(data.liked)
      setCount(data.likesCount)

      // Notify parent to refresh if needed
      if (onUpdate) {
        onUpdate()
      }
    } catch (error) {
      // Revert on error
      setLiked(prevLiked)
      setCount(prevCount)
      toast.error('Failed to update like')
      console.error('Like error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={(e: any) => {
        e.stopPropagation()
        toggleLike()
      }}
      disabled={isLoading}
      className={cn(
        'gap-2 h-auto p-2 active:scale-95 transition-transform',
        liked && 'text-red-500 hover:text-red-600',
        className
      )}
    >
      <Heart className={cn('h-4 w-4', liked && 'fill-current')} />
      <span className="text-xs font-medium">{count}</span>
    </Button>
  )
}
