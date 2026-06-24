'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Trophy,
  Plus,
  Search,
  Trash2,
  Calendar,
  Users,
  List,
  Rocket,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useDemoAction } from '@/hooks/use-demo-action'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CardListSkeleton } from '@/components/skeletons/card-list-skeleton'

export default function AdminHackathons() {
  const { isDemoRestricted } = useDemoAction()
  const [hackathons, setHackathons] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchHackathons()
  }, [])

  const fetchHackathons = async () => {
    try {
      const res = await fetch('/api/admin/hackathons')
      if (res.ok) {
        const { data } = await res.json()
        setHackathons(data)
      }
    } catch (_error) {
      toast.error('Failed to fetch hackathons')
    } finally {
      setIsLoading(false)
    }
  }

  const updateHackathon = async (id: string, data: any) => {
    if (isDemoRestricted()) return
    try {
      const res = await fetch(`/api/admin/hackathons/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        toast.success('Updated successfully')
        fetchHackathons()
      }
    } catch (_error) {
      toast.error('Failed to update')
    }
  }

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newHackathon, setNewHackathon] = useState({
    title: '',
    description: '',
    difficulty: 'BEGINNER',
    startDate: '',
    endDate: '',
    prize: '',
    tags: '',
    rules: '', // New
    requirements: '', // New
    pattern: 'General',
    status: 'DRAFT', // Visibility
    eventStatus: 'UPCOMING', // Lifecycle
  })

  const handleCreate = async () => {
    if (isDemoRestricted()) return
    try {
      const res = await fetch('/api/admin/hackathons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newHackathon,
          tags: newHackathon.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          rules: newHackathon.rules
            .split('\n')
            .map((t) => t.trim())
            .filter(Boolean),
          requirements: newHackathon.requirements
            .split('\n')
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      })
      if (res.ok) {
        toast.success('Sprint created successfully')
        setIsCreateOpen(false)
        setNewHackathon({
          title: '',
          description: '',
          difficulty: 'BEGINNER',
          startDate: '',
          endDate: '',
          prize: '',
          tags: '',
          rules: '',
          requirements: '',
          pattern: 'General',
          status: 'DRAFT',
          eventStatus: 'UPCOMING',
        })
        fetchHackathons()
      } else {
        toast.error('Failed to create sprint')
      }
    } catch (_error) {
      toast.error('Error creating sprint')
    }
  }

  const filteredHackathons = hackathons.filter(
    (h) =>
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-foreground">
            Hackathon Arena
          </h1>
          <p className="text-muted-foreground font-medium">
            Manage sprints, rewards, and participant engagement.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            className="h-12 px-6 rounded-2xl font-black italic uppercase tracking-wider shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            onClick={() => {
              if (isDemoRestricted()) return
              setIsCreateOpen(true)
            }}
          >
            <Plus className="mr-2 h-5 w-5" />
            Create Sprint
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sprints..."
            className="pl-11 h-12 bg-card/50 border-border/50 rounded-2xl focus:ring-primary/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <CardListSkeleton count={6} />
        ) : filteredHackathons.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground italic font-medium border-2 border-dashed border-border/50 rounded-3xl">
            No hackathons found in the arena.
          </div>
        ) : (
          filteredHackathons.map((hackathon) => (
            <Card
              key={hackathon._id}
              className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all overflow-hidden group"
            >
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row lg:items-center">
                  <div className="p-6 flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <StatusBadge
                            status={hackathon.status}
                            eventStatus={hackathon.eventStatus}
                          />
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                            {hackathon.difficulty}
                          </span>
                        </div>
                        <h3 className="text-xl font-black italic tracking-tighter uppercase group-hover:text-primary transition-colors">
                          {hackathon.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <WaitlistDialog hackathon={hackathon} />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => {
                            if (confirm('Are you sure?')) {
                              fetch(`/api/admin/hackathons/${hackathon._id}`, {
                                method: 'DELETE',
                              }).then(() => fetchHackathons())
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 font-medium">
                      {hackathon.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(
                          hackathon.startDate
                        ).toLocaleDateString()} -{' '}
                        {new Date(hackathon.endDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5" />
                        {hackathon.participants} Enrolled
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="h-3.5 w-3.5 text-orange-500" />
                        {hackathon.prize}
                      </div>
                    </div>
                  </div>
                  <div className="lg:w-48 p-6 lg:border-l border-border/50 bg-muted/20 flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-4">
                    {/* Visibility Control */}
                    {hackathon.status === 'DRAFT' ? (
                      <Button
                        size="sm"
                        className="w-full rounded-xl font-black italic uppercase text-[10px] tracking-widest bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                        onClick={() =>
                          updateHackathon(hackathon._id, {
                            status: 'PUBLISHED',
                          })
                        }
                      >
                        Publish
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full rounded-xl font-black italic uppercase text-[10px] tracking-widest"
                        onClick={() =>
                          updateHackathon(hackathon._id, { status: 'DRAFT' })
                        }
                      >
                        Unpublish
                      </Button>
                    )}

                    {/* Lifecycle Control */}
                    {hackathon.eventStatus === 'UPCOMING' ? (
                      <Button
                        size="sm"
                        className="w-full rounded-xl font-black italic uppercase text-[10px] tracking-widest bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20"
                        onClick={() =>
                          updateHackathon(hackathon._id, {
                            eventStatus: 'ACTIVE',
                          })
                        }
                      >
                        Start Event
                      </Button>
                    ) : hackathon.eventStatus === 'ACTIVE' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full rounded-xl font-black italic uppercase text-[10px] tracking-widest border-green-500/50 text-green-500"
                        onClick={() =>
                          updateHackathon(hackathon._id, {
                            eventStatus: 'COMPLETED',
                          })
                        }
                      >
                        Complete
                      </Button>
                    ) : null}

                    <div className="text-center w-full">
                      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                        Progress
                      </div>
                      <div className="text-2xl font-black italic tracking-tighter text-foreground">
                        {hackathon.progress}%
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-xl border-border/50 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-black italic uppercase tracking-tighter">
              Create New Sprint
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Title
                </label>
                <Input
                  value={newHackathon.title}
                  onChange={(e) =>
                    setNewHackathon({ ...newHackathon, title: e.target.value })
                  }
                  placeholder="e.g. System Design Sprint"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Difficulty
                </label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                  value={newHackathon.difficulty}
                  onChange={(e) =>
                    setNewHackathon({
                      ...newHackathon,
                      difficulty: e.target.value,
                    })
                  }
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="LEGENDARY">Legendary</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Description
              </label>
              <Input
                value={newHackathon.description}
                onChange={(e) =>
                  setNewHackathon({
                    ...newHackathon,
                    description: e.target.value,
                  })
                }
                placeholder="Brief description of the challenge..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={newHackathon.startDate}
                  onChange={(e) =>
                    setNewHackathon({
                      ...newHackathon,
                      startDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  End Date
                </label>
                <Input
                  type="date"
                  value={newHackathon.endDate}
                  onChange={(e) =>
                    setNewHackathon({
                      ...newHackathon,
                      endDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Prize Pool
                </label>
                <Input
                  value={newHackathon.prize}
                  onChange={(e) =>
                    setNewHackathon({ ...newHackathon, prize: e.target.value })
                  }
                  placeholder="e.g. $500 + Swag"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Tags
                </label>
                <Input
                  value={newHackathon.tags}
                  onChange={(e) =>
                    setNewHackathon({ ...newHackathon, tags: e.target.value })
                  }
                  placeholder="e.g. React, Node (comma separated)"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Pattern
              </label>
              <Input
                value={newHackathon.pattern}
                onChange={(e) =>
                  setNewHackathon({ ...newHackathon, pattern: e.target.value })
                }
                placeholder="e.g. Sliding Window, DFS..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Rules (One per line)
              </label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newHackathon.rules}
                onChange={(e) =>
                  setNewHackathon({ ...newHackathon, rules: e.target.value })
                }
                placeholder="e.g. No usage of AI..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Requirements (One per line)
              </label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newHackathon.requirements}
                onChange={(e) =>
                  setNewHackathon({
                    ...newHackathon,
                    requirements: e.target.value,
                  })
                }
                placeholder="e.g. Github Repo..."
              />
            </div>

            <Button
              className="w-full mt-4 h-12 rounded-xl font-black italic uppercase tracking-wider"
              onClick={handleCreate}
            >
              <Rocket className="mr-2 h-4 w-4" /> Launch Sprint
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function StatusBadge({
  status,
  eventStatus,
}: {
  status: string
  eventStatus?: string
}) {
  const checkStatus = (eventStatus || status).toLowerCase()
  const isLive = checkStatus === 'active'
  const isUpcoming = checkStatus === 'upcoming'
  const isDraft = status.toLowerCase() === 'draft'

  return (
    <span
      className={cn(
        'px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5',
        isLive
          ? 'bg-green-500/10 text-green-500'
          : isUpcoming
            ? 'bg-orange-500/10 text-orange-500'
            : isDraft
              ? 'bg-yellow-500/10 text-yellow-500'
              : 'bg-muted text-muted-foreground'
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          isLive
            ? 'bg-green-500 animate-pulse'
            : isUpcoming
              ? 'bg-orange-500'
              : isDraft
                ? 'bg-yellow-500'
                : 'bg-muted-foreground'
        )}
      />
      {status} ({eventStatus || 'N/A'})
    </span>
  )
}

function WaitlistDialog({ hackathon }: { hackathon: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [waitlist, setWaitlist] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let isMounted = true
    if (isOpen && hackathon._id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true)
      fetch(`/api/admin/hackathons/${hackathon._id}`)
        .then((res) => res.json())
        .then(({ data }) => {
          if (!isMounted) return
          setWaitlist(data.waitlistUsers || [])
          setLoading(false)
        })
        .catch(() => {
          if (isMounted) setLoading(false)
        })
    }
    return () => {
      isMounted = false
    }
  }, [isOpen, hackathon._id])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg hover:bg-indigo-500/10 hover:text-indigo-500"
          title="View Waitlist"
        >
          <List className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="font-black italic uppercase tracking-tighter">
            Waitlist: {hackathon.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground italic">
              Loading users...
            </div>
          ) : waitlist.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground italic border-2 border-dashed border-border/50 rounded-xl">
              Waitlist is empty.
            </div>
          ) : (
            waitlist.map((user: any) => (
              <div
                key={user._id}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-transparent hover:border-border/50 transition-all"
              >
                <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                  <AvatarImage src={user.image} />
                  <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <p className="text-sm font-bold leading-none">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
