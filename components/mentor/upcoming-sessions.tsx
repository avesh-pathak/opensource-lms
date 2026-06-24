'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
// import { useMentorship } from "@/hooks/use-mentorship"
import { Video, Calendar, Clock, ArrowRight, Zap } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns/format'
import { parseISO } from 'date-fns/parseISO'

export function UpcomingSessions() {
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([])

  const fetchSessions = async () => {
    try {
      // Fetch from the new my-sessions endpoint that reads from Booking model
      const res = await fetch('/api/mentorship/my-sessions')
      if (res.ok) {
        const sessions = await res.json()
        setUpcomingSessions(sessions)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSessions()
    // Poll every 5s for updates (simple real-time for demo)
    const interval = setInterval(fetchSessions, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleCancelSession = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/mentorship/cancel?id=${sessionId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('Session cancelled successfully')
        // Refresh sessions list
        fetchSessions()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to cancel session')
      }
    } catch (_error) {
      toast.error('Failed to cancel session')
    }
  }

  if (upcomingSessions.length === 0) {
    return (
      <div className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Upcoming Sessions</h3>
            <p className="text-xs text-muted-foreground">
              No sessions scheduled
            </p>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-primary/10 bg-muted/5 p-10 text-center transition-all hover:bg-muted/10 hover:border-primary/20">
          <div className="relative z-10 space-y-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-background border border-border/50 shadow-sm group-hover:scale-105 transition-transform">
              <Calendar className="h-6 w-6 text-primary/40" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                No active sessions scheduled
              </p>
              <p className="text-xs text-muted-foreground max-w-[280px] mx-auto">
                Book a session with our elite mentors to accelerate your
                technical growth.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Upcoming Sessions</h3>
          <p className="text-xs text-muted-foreground">
            Your mentorship schedule
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 rounded-lg font-medium text-xs text-primary hover:bg-primary/5 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
        >
          View All <ArrowRight className="ml-1.5 h-3 w-3" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {upcomingSessions.slice(0, 2).map((session) => (
          <div
            key={session.id}
            className="group relative p-5 rounded-2xl border border-border/50 bg-muted/30 hover:border-primary/50 hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -mr-10 -mt-10 rounded-full group-hover:bg-primary/10 transition-all duration-500 pointer-events-none" />

            <div className="flex items-center gap-4 relative z-10 mb-6">
              <div className="relative">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-background shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={session.mentorImage}
                    alt={session.mentorName}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-primary rounded-full flex items-center justify-center border-2 border-background shadow-sm">
                  <Video className="h-2 w-2 text-white" />
                </div>
              </div>
              <div className="space-y-0.5">
                <h4 className="font-semibold text-sm">{session.mentorName}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-primary bg-primary/5 px-1.5 py-0.5 rounded">
                    {session.mentorCompany}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    • {session.mentorTitle}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
              <div className="p-3.5 rounded-xl bg-muted/50 border border-border/50 space-y-1 group-hover:bg-muted/70 transition-colors">
                <div className="flex items-center gap-2 text-primary font-medium">
                  <Calendar className="h-3 w-3" />
                  <span className="text-[10px] uppercase tracking-wide">
                    Date
                  </span>
                </div>
                <span className="text-xs font-semibold block">
                  {format(parseISO(session.date), 'EEE, MMM dd')}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-muted/50 border border-border/50 space-y-1 group-hover:bg-muted/70 transition-colors">
                <div className="flex items-center gap-2 text-primary font-medium">
                  <Clock className="h-3 w-3" />
                  <span className="text-[10px] uppercase tracking-wide">
                    Time
                  </span>
                </div>
                <span className="text-xs font-semibold block">
                  {session.time}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full relative z-10">
              <Button
                asChild
                className="flex-1 h-10 rounded-xl font-medium text-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm shadow-primary/20 active:scale-[0.97] transition-all"
              >
                <a
                  href={session.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join Session <Zap className="ml-2 h-3.5 w-3.5 fill-current" />
                </a>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 px-4 rounded-xl border-red-500/20 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/40 text-red-500 transition-all active:scale-[0.97] font-medium text-sm"
                  >
                    <span className="mr-1.5">✕</span> Cancel
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Cancel Mentorship Session?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel this session? This action
                      cannot be undone and you may lose your reserved slot.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Session</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleCancelSession(session.id)}
                      className="bg-red-500 hover:bg-red-600 font-bold"
                    >
                      Yes, Cancel It
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
