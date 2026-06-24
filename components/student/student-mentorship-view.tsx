'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { MentorCard } from '@/components/mentor/mentor-card'
import { UpcomingSessions } from '@/components/mentor/upcoming-sessions'
import {
  Search,
  Filter,
  Sparkles,
  Radio,
  Flame,
  Zap,
  Clock,
  ChevronUp,
  ChevronDown,
  Loader2,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function StudentMentorshipView() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeSessionType, setActiveSessionType] = useState<
    '1-1' | 'sos' | 'roast' | 'consult'
  >('1-1')

  const [mentors, setMentors] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await fetch('/api/mentors')
        if (res.ok) {
          const data = await res.json()
          // Map _id to id for compatibility
          setMentors(data.map((m: any) => ({ ...m, id: m._id })))
        }
      } catch (_error) {
        console.error('Failed to fetch mentors')
      } finally {
        setIsLoading(false)
      }
    }
    fetchMentors()
  }, [])

  const filteredMentors = React.useMemo(
    () =>
      mentors.filter(
        (mentor) =>
          mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mentor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mentor.expertise.some((e: string) =>
            e.toLowerCase().includes(searchTerm.toLowerCase())
          )
      ),
    [searchTerm, mentors]
  )

  const handleSetSessionType = useCallback(
    (type: '1-1' | 'sos' | 'roast' | 'consult') => {
      setActiveSessionType(type)
    },
    []
  )

  const handleClearSearch = useCallback(() => {
    setSearchTerm('')
  }, [])

  const getSectionTitle = useCallback(() => {
    switch (activeSessionType) {
      case 'sos':
        return 'SOS Mentors'
      case 'roast':
        return 'Code Roast Mentors'
      case 'consult':
        return 'Flash Consult Mentors'
      default:
        return 'All Mentors'
    }
  }, [activeSessionType])

  const getSectionDesc = useCallback(() => {
    switch (activeSessionType) {
      case 'sos':
        return 'Select an engineer to help with your critical blocker.'
      case 'roast':
        return 'Select a mentor to review your code or resume.'
      case 'consult':
        return 'Select a mentor for rapid tactical advice.'
      default:
        return 'Select a mentor to start a session.'
    }
  }, [activeSessionType])

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Grid & Globs */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-20" />

      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full blur-[64px] pointer-events-none" />
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-orange-500/5 rounded-full blur-[64px] pointer-events-none" />

      <div className="relative z-10 p-4 lg:p-10 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
        {/* Tagline Section */}
        <div className="flex flex-col space-y-2 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 w-fit rounded-full bg-primary/5 border border-primary/10">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">
              Premier Mentorship
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
            Mastery Requires <span className="text-primary">Mentorship</span>
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Access 1-on-1 sessions with experienced engineers for rapid
            technical growth.
          </p>
        </div>

        {/* UPCOMING SESSIONS / MY SESSIONS */}
        <UpcomingSessions />

        {/* 4 Support Module Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1-HOUR MISSION CONTROL */}
          <Card
            className={`group relative overflow-hidden flex flex-col items-center text-center p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${activeSessionType === '1-1' ? 'border-primary bg-primary/[0.02] shadow-lg shadow-primary/10' : 'border-border/50 bg-card hover:border-primary/50 hover:shadow-md'}`}
            onClick={() => handleSetSessionType('1-1')}
          >
            <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center mb-3 shadow-sm relative z-10 transition-transform group-hover:scale-105">
              <Clock className="h-5 w-5" />
            </div>
            <div className="space-y-1 relative z-10 flex-1">
              <h3 className="text-sm font-semibold">1-Hour Session</h3>
              <p className="text-[10px] text-muted-foreground leading-relaxed px-1">
                Deep-dive architectural planning
              </p>
            </div>
            <div className="mt-4 w-full relative z-10 px-2">
              <Button
                variant={activeSessionType === '1-1' ? 'default' : 'outline'}
                className={`w-full h-8 rounded-lg font-medium text-xs transition-all ${activeSessionType === '1-1' ? 'bg-primary text-primary-foreground border-0 hover:bg-primary/90' : 'border hover:bg-primary/5 hover:text-primary hover:border-primary'}`}
              >
                {activeSessionType === '1-1' ? 'Selected' : <span>₹499</span>}
              </Button>
            </div>
          </Card>

          {/* TRANSMITTER SOS */}
          <Card
            onClick={() => handleSetSessionType('sos')}
            className={`group relative overflow-hidden flex flex-col items-center text-center p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${activeSessionType === 'sos' ? 'border-primary bg-primary/[0.02] shadow-lg shadow-primary/10' : 'border-border/50 bg-card hover:border-primary/50 hover:shadow-md'}`}
          >
            <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center mb-3 shadow-sm relative z-10 transition-transform group-hover:scale-105">
              <Radio className="h-5 w-5" />
            </div>
            <div className="space-y-1 relative z-10 flex-1">
              <h3 className="text-sm font-semibold">SOS</h3>
              <p className="text-[10px] text-muted-foreground leading-relaxed px-1">
                Critical blocker resolution
              </p>
            </div>
            <div className="mt-4 w-full relative z-10 px-2">
              <Button
                variant={activeSessionType === 'sos' ? 'default' : 'outline'}
                className={`w-full h-8 rounded-lg font-medium text-xs transition-all ${activeSessionType === 'sos' ? 'bg-primary text-primary-foreground border-0 hover:bg-primary/90' : 'border hover:bg-primary/5 hover:text-primary hover:border-primary'}`}
              >
                {activeSessionType === 'sos' ? 'Selected' : <span>₹299</span>}
              </Button>
            </div>
          </Card>

          {/* CLINICAL ROAST */}
          <Card
            onClick={() => handleSetSessionType('roast')}
            className={`group relative overflow-hidden flex flex-col items-center text-center p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${activeSessionType === 'roast' ? 'border-primary bg-primary/[0.02] shadow-lg shadow-primary/10' : 'border-border/50 bg-card hover:border-primary/50 hover:shadow-md'}`}
          >
            <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center mb-3 shadow-sm relative z-10 transition-transform group-hover:scale-105">
              <Flame className="h-5 w-5" />
            </div>
            <div className="space-y-1 relative z-10 flex-1">
              <h3 className="text-sm font-semibold">Code Roast</h3>
              <p className="text-[10px] text-muted-foreground leading-relaxed px-1">
                Resume/code audit by leads
              </p>
            </div>
            <div className="mt-4 w-full relative z-10 px-2">
              <Button
                variant={activeSessionType === 'roast' ? 'default' : 'outline'}
                className={`w-full h-8 rounded-lg font-medium text-xs transition-all ${activeSessionType === 'roast' ? 'bg-primary text-primary-foreground border-0 hover:bg-primary/90' : 'border hover:bg-primary/5 hover:text-primary hover:border-primary'}`}
              >
                {activeSessionType === 'roast' ? 'Selected' : <span>₹199</span>}
              </Button>
            </div>
          </Card>

          {/* FLASH CONSULT */}
          <Card
            onClick={() => handleSetSessionType('consult')}
            className={`group relative overflow-hidden flex flex-col items-center text-center p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${activeSessionType === 'consult' ? 'border-primary bg-primary/[0.02] shadow-lg shadow-primary/10' : 'border-border/50 bg-card hover:border-primary/50 hover:shadow-md'}`}
          >
            <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center mb-3 shadow-sm relative z-10 transition-transform group-hover:scale-105">
              <Zap className="h-5 w-5" />
            </div>
            <div className="space-y-1 relative z-10 flex-1">
              <h3 className="text-sm font-semibold">Flash Consult</h3>
              <p className="text-[10px] text-muted-foreground leading-relaxed px-1">
                15m rapid guidance
              </p>
            </div>
            <div className="mt-4 w-full relative z-10 px-2">
              <Button
                variant={
                  activeSessionType === 'consult' ? 'default' : 'outline'
                }
                className={`w-full h-8 rounded-lg font-medium text-xs transition-all ${activeSessionType === 'consult' ? 'bg-primary text-primary-foreground border-0 hover:bg-primary/90' : 'border hover:bg-primary/5 hover:text-primary hover:border-primary'}`}
              >
                {activeSessionType === 'consult' ? (
                  'Selected'
                ) : (
                  <span>₹149</span>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* BOOKING SYSTEMS */}
        {/* SEPARATOR */}
        <div className="border-t border-border/10 pt-4" />

        {/* ACTIVE MODULE VIEW */}
        <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-3 border-t border-border/10 pt-6">
            <div className="space-y-1">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                {getSectionTitle()}
              </h2>
              <p className="text-muted-foreground text-sm">
                {getSectionDesc()}
              </p>
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-[280px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search mentors..."
                  className="pl-10 h-11 rounded-xl bg-card border-border/50 text-sm font-medium shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                className="h-11 w-11 rounded-xl shrink-0 border-border/50 hover:bg-muted p-0"
              >
                <Filter className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4 pb-20">
            {isLoading ? (
              <div className="col-span-full flex justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
              </div>
            ) : (
              filteredMentors.map((mentor) => (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                  sessionType={activeSessionType} // Pass selected type!
                />
              ))
            )}
          </div>

          {filteredMentors.length === 0 && (
            <div className="text-center py-12 bg-muted/20 rounded-2xl border border-dashed border-border/50">
              <p className="text-muted-foreground text-sm">
                No mentors found matching your search.
              </p>
              <Button
                variant="link"
                onClick={handleClearSearch}
                className="text-primary text-sm font-medium mt-2"
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
