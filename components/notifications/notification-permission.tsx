'use client'

import { useState, useEffect } from 'react'
import { BellRing, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getFCMToken } from '@/lib/firebase/client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface NotificationPermissionProps {
  className?: string
}

export function NotificationPermission({
  className,
}: NotificationPermissionProps) {
  const [permission, setPermission] = useState<
    NotificationPermission | 'loading'
  >('loading')
  const [isRegistering, setIsRegistering] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if already dismissed
    if (typeof window !== 'undefined') {
      const wasDismissed = localStorage.getItem(
        'notification-permission-dismissed'
      )
      if (wasDismissed) {
        setDismissed(true)
      }
    }

    // Check current permission
    if (typeof Notification !== 'undefined') {
      setPermission(Notification.permission)
    } else {
      setPermission('denied')
    }
  }, [])

  const handleEnable = async () => {
    setIsRegistering(true)
    try {
      // Request permission
      const result = await Notification.requestPermission()
      setPermission(result)

      if (result !== 'granted') {
        toast.error('Notification permission denied')
        return
      }

      // Get FCM token
      const token = await getFCMToken()
      if (!token) {
        toast.error('Failed to get notification token')
        return
      }

      // Register token with server
      const res = await fetch('/api/notifications/register-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, platform: 'web' }),
      })

      if (res.ok) {
        toast.success('Notifications enabled!')
        localStorage.setItem('notification-permission-granted', 'true')
      } else {
        toast.error('Failed to register for notifications')
      }
    } catch (error) {
      console.error('Error enabling notifications:', error)
      toast.error('Failed to enable notifications')
    } finally {
      setIsRegistering(false)
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem('notification-permission-dismissed', 'true')
  }

  // Don't show if already granted, denied, or dismissed
  if (
    permission === 'loading' ||
    permission === 'granted' ||
    permission === 'denied' ||
    dismissed
  ) {
    return null
  }

  return (
    <div
      className={cn(
        'relative flex items-center gap-3 p-4 rounded-2xl border border-border bg-card/50 backdrop-blur-sm shadow-lg',
        className
      )}
    >
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted/50 transition-colors"
      >
        <X className="h-3 w-3 text-muted-foreground" />
      </button>

      <div className="p-2 rounded-xl bg-primary/10">
        <BellRing className="h-5 w-5 text-primary" />
      </div>

      <div className="flex-1 space-y-1">
        <p className="text-sm font-bold">Enable Push Notifications</p>
        <p className="text-[11px] text-muted-foreground">
          Get instant updates on announcements and activity
        </p>
      </div>

      <Button
        size="sm"
        onClick={handleEnable}
        disabled={isRegistering}
        className="text-[10px] font-bold uppercase tracking-widest rounded-xl"
      >
        {isRegistering ? 'Enabling...' : 'Enable'}
      </Button>
    </div>
  )
}
