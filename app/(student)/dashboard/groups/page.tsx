'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Users,
  Zap,
  ShieldCheck,
  Search,
  Filter,
  Clock,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

interface Squad {
  _id: string
  name: string
  mentorId: string
  mentorName: string
  mentorImage: string
  mentorTitle: string
  mentorCompany: string
  category: string
  description: string
  manifesto: string[]
  monthlyPrice: number
  memberCount: number
  maxMembers: number
  weeklySchedule: string[]
  nextSession: string
  status: string
  members: string[]
  isJoined?: boolean
}

export default function GroupsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [squads, setSquads] = useState<Squad[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSquads()
  }, [])

  const fetchSquads = async () => {
    try {
      const res = await fetch('/api/squads')
      if (res.ok) {
        const data = await res.json()
        setSquads(data)
      }
    } catch (error) {
      console.error('Failed to fetch squads:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredSquads = squads.filter(
    (squad) =>
      squad.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      squad.mentorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      squad.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Grid & Globs */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-20" />

      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-orange-500/5 rounded-full blur-[128px] pointer-events-none" />

      <div className="relative z-10 p-4 lg:p-10 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
        {/* Header Section */}
        <div className="flex flex-col space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 w-fit rounded-full bg-primary/5 border border-primary/10">
            <Users className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">
              Active Squads
            </span>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
              Exclusive <span className="text-primary">Squads</span>
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
              Join mentor-led groups for focused technical guidance and
              community accountability.
            </p>
          </div>
        </div>

        {/* Filters Area */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-card/40 backdrop-blur-xl p-4 rounded-2xl border border-border/50">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-40" />
            <Input
              placeholder="Find your squad (e.g., System Design, Frontend)..."
              className="pl-12 h-11 rounded-xl bg-background border-none text-sm font-medium shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-11 rounded-xl px-5 font-medium text-sm border"
            >
              <Filter className="h-4 w-4 mr-2" /> Filters
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredSquads.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground italic font-medium border-2 border-dashed border-border/50 rounded-3xl">
            <p className="text-lg">No squads available yet.</p>
            <p className="text-sm mt-2 opacity-60">
              Check back soon for new coalitions or contact admin to seed data.
            </p>
          </div>
        ) : (
          /* Squads Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSquads.map((squad) => (
              <Link
                key={squad._id}
                href={`/dashboard/groups/${squad._id}`}
                className="group"
              >
                <Card className="h-full relative overflow-hidden flex flex-col p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl hover:border-primary/50 hover:bg-card/80 hover:shadow-lg transition-all duration-300">
                  {/* Background Glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 group-hover:bg-primary/10 transition-colors" />

                  <div className="space-y-5 relative z-10 flex-1">
                    <div className="flex justify-between items-start">
                      <Badge
                        variant="secondary"
                        className="px-3 py-1 bg-primary/10 text-primary border-primary/10 font-medium text-xs"
                      >
                        {squad.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                        <Users className="w-3.5 h-3.5" /> {squad.memberCount}/
                        {squad.maxMembers}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                        {squad.name}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {squad.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 py-3 border-y border-dashed border-border/50">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-background shadow-sm">
                        <Image
                          src={squad.mentorImage}
                          alt={squad.mentorName}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold">
                          {squad.mentorName}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {squad.mentorTitle} @ {squad.mentorCompany}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs font-medium text-muted-foreground">
                          Next: {squad.nextSession}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-muted/30 border border-border/50 group-hover:bg-muted/50 transition-colors">
                        <div className="text-lg font-bold">
                          ₹{squad.monthlyPrice}
                          <span className="text-xs text-muted-foreground ml-1 font-normal">
                            / month
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 relative z-10">
                    {squad.isJoined ? (
                      <Button
                        disabled
                        className="w-full h-11 rounded-xl font-medium text-sm bg-green-500/20 text-green-500 border border-green-500/50 cursor-default opacity-100"
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Active Member
                      </Button>
                    ) : (
                      <Button className="w-full h-11 rounded-xl font-medium text-sm bg-foreground text-background group-hover:bg-primary group-hover:text-white shadow-sm transition-all active:scale-[0.97]">
                        Join Squad <Zap className="ml-2 h-4 w-4 fill-current" />
                      </Button>
                    )}
                  </div>

                  {squad.status === 'starting-soon' && (
                    <Badge className="absolute top-4 right-4 bg-orange-500 text-white text-[10px] font-medium">
                      Starting Soon
                    </Badge>
                  )}

                  {squad.status === 'full' && (
                    <Badge className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-medium">
                      Full
                    </Badge>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom Guarantee */}
        <div className="max-w-xl mx-auto p-6 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/10 text-center space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-emerald-500/20" />
          <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
            <span className="font-semibold text-sm">
              The Collective Guarantee
            </span>
          </div>
          <p className="text-xs text-emerald-900/60 dark:text-emerald-100/60 leading-relaxed">
            If your Squad doesn&apos;t accelerate your technical intuition in
            the first 14 days, we will terminate your subscription and issue an{' '}
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              full refund
            </span>
            . No questions asked.
          </p>
        </div>
      </div>
    </div>
  )
}
