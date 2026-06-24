'use client'

import React, { useState, useEffect } from 'react'
import { Loader2, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Squad {
  _id: string
  name: string
  category: string
  memberCount: number
  maxMembers: number
  status: string
  nextSession: string
  monthlyPrice: number
}

export function MentorDashboardView({ mentorId }: { mentorId: string }) {
  const [squads, setSquads] = useState<Squad[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch squads where mentorId matches appropriate ID
    // For now, fetching ALL squads and filtering (inefficient but safe if API doesn't support filter)
    // Ideally we should have an API /api/mentors/me/squads or similar.
    // Assuming /api/squads returns all active squads, but we need admin/mentor view.

    const fetchMySquads = async () => {
      try {
        // Determine if we need a specific endpoint.
        // Let's rely on /api/squads for now and client filter?
        // Or better: use the admin route if we are admin.
        // But mentors might not be admins.
        // Let's assume mentors see all squads they lead.

        // TEMP: Fetching all public squads for now, filtering by mentor in real app
        const res = await fetch('/api/squads')
        if (res.ok) {
          const data = await res.json()
          // Filter by mentorId properly once we have that link.
          // For now, showing all squads to demonstrate UI.
          setSquads(data)
        }
      } catch (_error) {
        console.error('Failed to fetch squads')
      } finally {
        setIsLoading(false)
      }
    }
    fetchMySquads()
  }, [mentorId])

  if (isLoading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin" />
      </div>
    )

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">
          Mentor Command Center
        </h1>
        <p className="text-muted-foreground font-medium">
          Manage your active squads and student progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {squads.map((squad) => (
          <Card
            key={squad._id}
            className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all overflow-hidden"
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <Badge
                  variant="outline"
                  className="text-[10px] font-black uppercase tracking-widest bg-primary/5 border-primary/20 text-primary"
                >
                  {squad.category}
                </Badge>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                  <Users className="w-3 h-3" />
                  {squad.memberCount}/{squad.maxMembers}
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black italic uppercase tracking-tighter">
                  {squad.name}
                </h3>
                <p className="text-xs font-medium text-muted-foreground">
                  Next Session: {squad.nextSession}
                </p>
              </div>

              <div className="pt-4 border-t border-border/50 flex gap-2">
                <Button size="sm" className="w-full font-bold text-xs">
                  View Students
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full font-bold text-xs"
                >
                  Manage Content
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {squads.length === 0 && (
        <div className="text-center py-20 text-muted-foreground italic">
          No active squads assigned.
        </div>
      )}
    </div>
  )
}
