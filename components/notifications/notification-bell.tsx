'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Megaphone, MessageCircle, Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { onForegroundMessage, getFCMToken } from '@/lib/firebase/client'

interface Notification {
  _id: string
  type: 'announcement' | 'personal'
  title?: string
  message?: string
  link?: string
  createdAt: string
  isRead: boolean
  priority?: string
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMarkingRead, setIsMarkingRead] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasFetchedRef = useRef(false)

  // Fetch notifications function
  const fetchNotifications = useCallback(async () => {
    // Prevent duplicate fetches
    if (isLoading) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/notifications')
      if (res.ok) {
        const data = await res.json()
        if (data.notifications) {
          setNotifications(data.notifications)
          setUnreadCount(data.unreadCount ?? 0)
        } else if (Array.isArray(data)) {
          setNotifications(data)
          setUnreadCount(data.filter((n: Notification) => !n.isRead).length)
        }
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading])

  // Initial fetch + focus listener (NO POLLING)
  useEffect(() => {
    // Fetch once on mount
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true
      fetchNotifications()
    }

    // Refetch when tab becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchNotifications()
      }
    }

    // Refetch on window focus
    const handleFocus = () => {
      fetchNotifications()
    }

    // Click outside to close
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [fetchNotifications])

  // FCM Foreground Push Listener
  useEffect(() => {
    const unsubscribe = onForegroundMessage((payload) => {
      console.log('Push notification received:', payload)

      // Silently refetch notifications to update the list (no popup)
      fetchNotifications()
    })

    return () => unsubscribe()
  }, [fetchNotifications])

  const router = useRouter()

  // Handle notification click (Mark read + Redirect)
  const handleNotificationClick = async (notification: Notification) => {
    // 1. Navigation Logic
    if (notification.type === 'announcement') {
      router.push('/dashboard/announcements')
    } else if (notification.type === 'personal' && notification.link) {
      // If it has a link (e.g. from the new automated contents), go there
      router.push(notification.link)
    }

    // 2. Mark as Read Logic (Optimistic)
    if (notification.isRead || isMarkingRead) return

    // OPTIMISTIC UPDATE - immediately update UI
    const previousNotifications = [...notifications]
    const previousUnreadCount = unreadCount

    setNotifications((prev) =>
      prev.map((n) => (n._id === notification._id ? { ...n, isRead: true } : n))
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))

    // Don't block navigation with async marking
    markReadAsync(notification, previousNotifications, previousUnreadCount)
  }

  const markReadAsync = async (
    notification: Notification,
    _prevList: Notification[],
    _prevCount: number
  ) => {
    try {
      let res: Response
      if (notification.type === 'announcement') {
        res = await fetch('/api/notifications/mark-read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ announcementId: notification._id }),
        })
      } else {
        res = await fetch('/api/notifications', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: notification._id }),
        })
      }

      if (!res.ok) {
        // Silent fail on network error, user already navigated
        console.error('Failed to mark as read in background')
      } else {
        const data = await res.json()
        if (typeof data.unreadCount === 'number') {
          setUnreadCount(data.unreadCount)
        }
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  // Optimistic mark all as read
  const markAllRead = async () => {
    if (isMarkingRead || unreadCount === 0) return

    // OPTIMISTIC UPDATE
    const previousNotifications = [...notifications]
    const previousUnreadCount = unreadCount

    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    setUnreadCount(0)

    setIsMarkingRead(true)
    try {
      // Mark all announcements as read
      const announcementRes = await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'all' }),
      })

      // Also mark personal notifications as read
      const personalRes = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      })

      if (!announcementRes.ok || !personalRes.ok) {
        throw new Error('Failed to mark all as read')
      }
    } catch (error) {
      // REVERT on failure
      setNotifications(previousNotifications)
      setUnreadCount(previousUnreadCount)
      toast.error('Failed to mark all as read')
      console.error('Failed to mark all read:', error)
    } finally {
      setIsMarkingRead(false)
    }
  }

  const [showClearConfirm, setShowClearConfirm] = useState(false)

  // Clear all notifications
  const confirmClearAll = () => {
    if (notifications.length > 0) {
      setShowClearConfirm(true)
    }
  }

  const executeClearAll = async () => {
    setShowClearConfirm(false)
    if (isMarkingRead || notifications.length === 0) return

    // OPTIMISTIC UPDATE
    const previousNotifications = [...notifications]
    const previousUnreadCount = unreadCount

    setNotifications([])
    setUnreadCount(0)

    setIsMarkingRead(true)
    try {
      // Clear all for this user
      const res = await fetch('/api/notifications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clearAll: true }),
      })

      if (!res.ok) {
        throw new Error('Failed to clear notifications')
      }

      toast.success('All notifications cleared')
    } catch (error) {
      // REVERT on failure
      setNotifications(previousNotifications)
      setUnreadCount(previousUnreadCount)
      toast.error('Failed to clear notifications')
      console.error('Failed to clear notifications:', error)
    } finally {
      setIsMarkingRead(false)
    }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  const handleBellClick = async () => {
    setIsOpen(!isOpen)

    if (!isOpen) {
      // Only check permission when OPENING the bell
      if (typeof Notification !== 'undefined') {
        if (Notification.permission === 'default') {
          const result = await Notification.requestPermission()
          if (result === 'granted') {
            registerToken()
          } else {
            toast.error('Enable notifications from browser settings')
          }
        } else if (Notification.permission === 'granted') {
          // Ensure token is registered (idempotent)
          registerToken()
        }
      }
    }
  }

  const registerToken = async () => {
    try {
      const token = await getFCMToken()
      if (token) {
        await fetch('/api/notifications/register-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, platform: 'web' }),
        })
      }
    } catch (e) {
      console.error('Token registration failed', e)
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative h-9 w-9 rounded-xl hover:bg-muted"
        onClick={handleBellClick}
      >
        <Bell className="h-5 w-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background animate-pulse" />
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border/50 shadow-2xl bg-card/95 backdrop-blur-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/20">
            <h4 className="font-black italic uppercase tracking-wider text-sm">
              Notifications
            </h4>
            <div className="flex items-center gap-1">
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={confirmClearAll}
                  disabled={isMarkingRead}
                  className="h-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-destructive px-2 disabled:opacity-50"
                  title="Clear All"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllRead}
                  disabled={isMarkingRead}
                  className="h-6 text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary/80 px-2 disabled:opacity-50"
                >
                  {isMarkingRead ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    'Mark Read'
                  )}
                </Button>
              )}
            </div>
          </div>

          <div className="max-h-[300px] overflow-y-auto scrollbar-thin">
            {isLoading && notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-xs font-medium italic flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-xs font-medium italic">
                All caught up! No notifications.
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={cn(
                      'p-4 transition-colors hover:bg-muted/50 cursor-pointer',
                      !notification.isRead && 'bg-muted/30',
                      notification.type === 'announcement' &&
                        !notification.isRead &&
                        'bg-orange-500/5 border-l-2 border-orange-500'
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'mt-0.5 p-1.5 rounded-lg shrink-0',
                          notification.type === 'announcement'
                            ? 'bg-orange-500/10 text-orange-500'
                            : 'bg-primary/10 text-primary'
                        )}
                      >
                        {notification.type === 'announcement' ? (
                          <Megaphone className="h-3.5 w-3.5" />
                        ) : (
                          <MessageCircle className="h-3.5 w-3.5" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1 min-w-0">
                        {notification.title && (
                          <p className="text-xs font-bold text-foreground truncate">
                            {notification.title}
                          </p>
                        )}
                        <p
                          className={cn(
                            'text-xs leading-snug',
                            !notification.isRead
                              ? 'font-medium text-foreground'
                              : 'text-muted-foreground'
                          )}
                        >
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-muted-foreground opacity-70">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all notifications?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all notifications from your list. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeClearAll}>
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
