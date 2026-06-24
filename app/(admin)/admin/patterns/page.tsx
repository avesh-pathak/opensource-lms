'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Filter, Plus, Edit2, Trash2, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { useDemoAction } from '@/hooks/use-demo-action'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

export default function AdminPatterns() {
  const [patterns, setPatterns] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [newPattern, setNewPattern] = useState({
    name: '',
    domain: 'DSA',
    subject: '',
  })
  const [editPattern, setEditPattern] = useState<any>(null)
  const { isDemoRestricted } = useDemoAction()

  useEffect(() => {
    fetchPatterns()
  }, [])

  const fetchPatterns = async () => {
    try {
      const res = await fetch('/api/topics')
      const data = await res.json()
      if (res.ok) {
        setPatterns(
          data.map((t: any) => ({
            _id: t.id,
            name: t.name,
            domain: t.domain || 'DSA',
            subject: t.subject || 'General',
            total: t.total,
            solved: t.solved,
            problems: t.problems || [],
          }))
        )
      }
    } catch (_error) {
      toast.error('Failed to fetch patterns')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    if (isDemoRestricted()) return
    try {
      const res = await fetch('/api/admin/patterns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPattern),
      })
      if (res.ok) {
        toast.success('Pattern created successfully')
        setIsCreateOpen(false)
        fetchPatterns()
        setNewPattern({ name: '', domain: 'DSA', subject: '' })
      } else {
        throw new Error('Failed to create pattern')
      }
    } catch (_error) {
      toast.error('Error creating pattern')
    }
  }

  const handleEdit = async () => {
    if (!editPattern) return
    if (isDemoRestricted()) return
    try {
      const res = await fetch('/api/admin/topics', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldName: editPattern.originalName || editPattern.name,
          newName: editPattern.name,
        }),
      })
      if (res.ok) {
        toast.success('Topic renamed successfully')
        setIsEditOpen(false)
        setEditPattern(null)
        fetchPatterns()
      } else {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update topic')
      }
    } catch (_error) {
      toast.error('Error updating pattern')
    }
  }

  const handleDelete = async (id: string, name: string, total: number = 0) => {
    if (isDemoRestricted()) return
    if (total > 0) {
      toast.error(
        `Cannot delete "${name}" - it has ${total} problems. Reassign them first.`
      )
      return
    }
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return
    try {
      const res = await fetch(
        `/api/admin/topics?topic=${encodeURIComponent(name)}`,
        {
          method: 'DELETE',
        }
      )
      if (res.ok) {
        toast.success('Topic deleted successfully')
        fetchPatterns()
      } else {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete topic')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error deleting topic')
    }
  }

  const filteredPatterns = patterns.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.domain.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const groupedPatterns: Record<string, any[]> = {}
  filteredPatterns.forEach((p) => {
    if (!groupedPatterns[p.domain]) groupedPatterns[p.domain] = []
    groupedPatterns[p.domain].push(p)
  })

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-foreground">
            Pattern Taxonomy
          </h1>
          <p className="text-muted-foreground font-medium">
            Manage learning paths, subjects, and topics.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 px-6 rounded-2xl font-black italic uppercase tracking-wider shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              <Plus className="mr-2 h-5 w-5" />
              New Pattern
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Pattern/Topic</DialogTitle>
              <DialogDescription>
                Define a new learning pattern or subject.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Select Domain</Label>
                <select
                  className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newPattern.domain}
                  onChange={(e) =>
                    setNewPattern({ ...newPattern, domain: e.target.value })
                  }
                >
                  <option value="DSA">DSA</option>
                  <option value="System Design">System Design</option>
                  <option value="LLD">Low Level Design</option>
                  <option value="Core Engineering">Core Engineering</option>
                  <option value="AI/ML">AI/ML</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>
                  Subject (e.g. &quot;Arrays&quot;, &quot;DBMS&quot;)
                </Label>
                <Input
                  value={newPattern.subject}
                  onChange={(e) =>
                    setNewPattern({ ...newPattern, subject: e.target.value })
                  }
                  placeholder="Enter Subject Name"
                />
                <p className="text-[10px] text-muted-foreground">
                  Type a new subject to create it instantly.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Pattern Name (e.g. &quot;Sliding Window&quot;)</Label>
                <Input
                  value={newPattern.name}
                  onChange={(e) =>
                    setNewPattern({ ...newPattern, name: e.target.value })
                  }
                  placeholder="Enter Pattern Name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreate}>Create Pattern</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Pattern</DialogTitle>
              <DialogDescription>
                Modify the details of this learning pattern.
              </DialogDescription>
            </DialogHeader>
            {editPattern && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Select Domain</Label>
                  <select
                    className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={editPattern.domain}
                    onChange={(e) =>
                      setEditPattern({ ...editPattern, domain: e.target.value })
                    }
                  >
                    <option value="DSA">DSA</option>
                    <option value="System Design">System Design</option>
                    <option value="LLD">Low Level Design</option>
                    <option value="Core Engineering">Core Engineering</option>
                    <option value="AI/ML">AI/ML</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input
                    value={editPattern.subject}
                    onChange={(e) =>
                      setEditPattern({
                        ...editPattern,
                        subject: e.target.value,
                      })
                    }
                    placeholder="Enter Subject Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pattern Name</Label>
                  <Input
                    value={editPattern.name}
                    onChange={(e) =>
                      setEditPattern({ ...editPattern, name: e.target.value })
                    }
                    placeholder="Enter Pattern Name"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={handleEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patterns or subjects..."
            className="pl-11 h-12 bg-card/50 border-border/50 rounded-2xl focus:ring-primary/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="h-12 w-12 rounded-2xl border-border/50 bg-card/50"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-20 italic animate-pulse">
          Loading Taxonomy...
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedPatterns).map(([domain, items]) => (
            <div key={domain} className="space-y-4">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-foreground bg-primary/10 px-4 py-1 rounded-lg border-l-4 border-primary">
                  {domain}
                </h3>
                <div className="h-px flex-1 bg-border/50" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((pattern: any) => {
                  const proficiency =
                    pattern.total > 0
                      ? Math.round((pattern.solved / pattern.total) * 100)
                      : 0
                  return (
                    <Link
                      href={`/admin/patterns/${pattern._id}`}
                      key={pattern._id}
                      className="block"
                    >
                      <Card className="border-border/50 bg-card/50 backdrop-blur-sm group hover:border-primary/50 transition-all cursor-pointer h-full relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="h-4 w-4 text-primary" />
                        </div>
                        <CardContent className="p-5 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h4 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors italic uppercase">
                                {pattern.name}
                              </h4>
                              <p className="text-[10px] font-black text-muted-foreground tracking-widest uppercase opacity-60">
                                {pattern.solved} / {pattern.total} Completed
                              </p>
                            </div>
                            <div
                              className="flex gap-1"
                              onClick={(e) => e.preventDefault()}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  e.preventDefault()
                                  setEditPattern({
                                    ...pattern,
                                    originalName: pattern.name,
                                  })
                                  setIsEditOpen(true)
                                }}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  e.preventDefault()
                                  handleDelete(
                                    pattern._id,
                                    pattern.name,
                                    pattern.total
                                  )
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                              <span className="opacity-40">Proficiency</span>
                              <span className="text-primary font-black">
                                {proficiency}%
                              </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all duration-500"
                                style={{ width: `${proficiency}%` }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
