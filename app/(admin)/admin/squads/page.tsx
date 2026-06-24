'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Zap,
  DollarSign,
  Calendar,
  Loader2,
  X,
  Save,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useDemoAction } from '@/hooks/use-demo-action'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Squad {
  _id: string
  name: string
  slug: string
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
}

const EMPTY_SQUAD = {
  name: '',
  slug: '',
  mentorId: '',
  mentorName: '',
  mentorImage: '/assets/mentors/image.png',
  mentorTitle: '',
  mentorCompany: '',
  category: 'DSA',
  description: '',
  manifesto: [''],
  monthlyPrice: 1499,
  maxMembers: 20,
  weeklySchedule: [''],
  nextSession: '',
  status: 'active',
}

export default function AdminSquads() {
  const { isDemoRestricted } = useDemoAction()
  const [squads, setSquads] = useState<Squad[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSquad, setEditingSquad] = useState<Squad | null>(null)
  const [formData, setFormData] = useState(EMPTY_SQUAD)
  const [isSaving, setIsSaving] = useState(false)
  const [isSeeding, setIsSeeding] = useState(false)

  useEffect(() => {
    fetchSquads()
  }, [])

  const fetchSquads = async () => {
    try {
      const res = await fetch('/api/admin/squads')
      if (res.ok) {
        const { data } = await res.json()
        setSquads(data)
      }
    } catch (_error) {
      toast.error('Failed to fetch squads')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSeed = async () => {
    if (isDemoRestricted()) return
    setIsSeeding(true)
    try {
      const res = await fetch('/api/admin/squads/seed', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        toast.success(data.message)
        fetchSquads()
      } else {
        toast.info(data.message)
      }
    } catch (_error) {
      toast.error('Failed to seed squads')
    } finally {
      setIsSeeding(false)
    }
  }

  const openCreateDialog = () => {
    if (isDemoRestricted()) return
    setEditingSquad(null)
    setFormData(EMPTY_SQUAD)
    setIsDialogOpen(true)
  }

  const openEditDialog = (squad: Squad) => {
    if (isDemoRestricted()) return
    setEditingSquad(squad)
    setFormData({
      name: squad.name,
      slug: squad.slug,
      mentorId: squad.mentorId,
      mentorName: squad.mentorName,
      mentorImage: squad.mentorImage,
      mentorTitle: squad.mentorTitle,
      mentorCompany: squad.mentorCompany,
      category: squad.category,
      description: squad.description,
      manifesto: squad.manifesto,
      monthlyPrice: squad.monthlyPrice,
      maxMembers: squad.maxMembers,
      weeklySchedule: squad.weeklySchedule,
      nextSession: squad.nextSession,
      status: squad.status,
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (isDemoRestricted()) return
    setIsSaving(true)
    try {
      const url = editingSquad
        ? `/api/admin/squads/${editingSquad._id}`
        : '/api/admin/squads'
      const method = editingSquad ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(editingSquad ? 'Squad updated!' : 'Squad created!')
        setIsDialogOpen(false)
        fetchSquads()
      } else {
        toast.error(data.error || 'Failed to save squad')
      }
    } catch (_error) {
      toast.error('Failed to save squad')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (isDemoRestricted()) return
    if (!confirm('Are you sure you want to delete this squad?')) return
    try {
      const res = await fetch(`/api/admin/squads/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Squad deleted!')
        fetchSquads()
      }
    } catch (_error) {
      toast.error('Failed to delete squad')
    }
  }

  const updateManifesto = (index: number, value: string) => {
    const newManifesto = [...formData.manifesto]
    newManifesto[index] = value
    setFormData({ ...formData, manifesto: newManifesto })
  }

  const addManifestoItem = () => {
    setFormData({ ...formData, manifesto: [...formData.manifesto, ''] })
  }

  const removeManifestoItem = (index: number) => {
    const newManifesto = formData.manifesto.filter((_, i) => i !== index)
    setFormData({ ...formData, manifesto: newManifesto })
  }

  const [members, setMembers] = useState<any[]>([])
  const [isLoadingMembers, setIsLoadingMembers] = useState(false)
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false)

  const handleViewStudents = async (squadId: string) => {
    setIsMemberDialogOpen(true)
    setIsLoadingMembers(true)
    try {
      const res = await fetch(`/api/squads/${squadId}/members`)
      if (res.ok) {
        const { data } = await res.json()
        setMembers(data)
      } else {
        setMembers([])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoadingMembers(false)
    }
  }

  const filteredSquads = squads.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.mentorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-foreground">
            Squad Command
          </h1>
          <p className="text-muted-foreground font-medium">
            Manage mentor-led coalitions and subscriptions.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          {squads.length === 0 && (
            <Button
              variant="outline"
              className="h-12 px-6 rounded-2xl font-black italic uppercase tracking-wider border-border/50 bg-card/50"
              onClick={handleSeed}
              disabled={isSeeding}
            >
              {isSeeding ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Zap className="mr-2 h-4 w-4" />
              )}
              Seed Data
            </Button>
          )}
          <Button
            className="h-12 px-6 rounded-2xl font-black italic uppercase tracking-wider shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            onClick={openCreateDialog}
          >
            <Plus className="mr-2 h-5 w-5" />
            Create Squad
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search squads..."
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

      {/* Squads List */}
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="py-20 text-center text-muted-foreground italic font-medium animate-pulse">
            Loading Squads...
          </div>
        ) : filteredSquads.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground italic font-medium border-2 border-dashed border-border/50 rounded-3xl">
            <p>No squads found.</p>
            <p className="text-sm mt-2 opacity-60">
              Click &quot;Seed Data&quot; to populate from mock data or
              &quot;Create Squad&quot; to add manually.
            </p>
          </div>
        ) : (
          filteredSquads.map((squad) => (
            <Card
              key={squad._id}
              className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all overflow-hidden group"
            >
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row lg:items-center">
                  <div className="p-6 flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={squad.status} />
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                            {squad.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-black italic tracking-tighter uppercase group-hover:text-primary transition-colors">
                          {squad.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                          onClick={() => openEditDialog(squad)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDelete(squad._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 font-medium">
                      {squad.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5" />
                        {squad.memberCount}/{squad.maxMembers} Members
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-3.5 w-3.5 text-green-500" />₹
                        {squad.monthlyPrice}/month
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        Next: {squad.nextSession}
                      </div>
                    </div>
                    <div className="pt-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs font-bold"
                        onClick={() => handleViewStudents(squad._id)}
                      >
                        <Users className="h-3 w-3 mr-2" /> View Students
                      </Button>
                    </div>
                  </div>
                  <div className="lg:w-48 p-6 lg:border-l border-border/50 bg-muted/20 flex flex-col items-center justify-center gap-2">
                    <div className="text-center">
                      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Led By
                      </div>
                      <div className="font-black italic text-sm">
                        {squad.mentorName}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {squad.mentorTitle}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-xl border-border/50">
          <DialogHeader>
            <DialogTitle className="font-black italic uppercase tracking-tighter">
              {editingSquad ? 'Edit Squad' : 'Create Squad'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                  Squad Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      // Auto-generate slug from name if slug is empty
                      slug:
                        formData.slug ||
                        e.target.value.toLowerCase().replace(/ /g, '-'),
                    })
                  }
                  placeholder="e.g., Distributed Titans"
                  className="h-12 rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                  Slug (URL)
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="e.g., distributed-titans"
                  className="h-12 rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                  Category
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(v) =>
                    setFormData({ ...formData, category: v })
                  }
                >
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="System Design">System Design</SelectItem>
                    <SelectItem value="DSA">DSA</SelectItem>
                    <SelectItem value="Frontend">Frontend</SelectItem>
                    <SelectItem value="Backend">Backend</SelectItem>
                    <SelectItem value="AI/ML">AI/ML</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                  Status
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => setFormData({ ...formData, status: v })}
                >
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="starting-soon">Starting Soon</SelectItem>
                    <SelectItem value="full">Full</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Mentor Info */}
            <div className="space-y-4">
              <h4 className="text-sm font-black uppercase tracking-wider text-primary">
                Mentor Details
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                    Mentor Name
                  </label>
                  <Input
                    value={formData.mentorName}
                    onChange={(e) =>
                      setFormData({ ...formData, mentorName: e.target.value })
                    }
                    placeholder="e.g., Vikram Singh"
                    className="h-12 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                    Mentor ID
                  </label>
                  <Input
                    value={formData.mentorId}
                    onChange={(e) =>
                      setFormData({ ...formData, mentorId: e.target.value })
                    }
                    placeholder="e.g., 1"
                    className="h-12 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                    Title
                  </label>
                  <Input
                    value={formData.mentorTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, mentorTitle: e.target.value })
                    }
                    placeholder="e.g., Senior Staff Engineer"
                    className="h-12 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                    Company
                  </label>
                  <Input
                    value={formData.mentorCompany}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mentorCompany: e.target.value,
                      })
                    }
                    placeholder="e.g., Google"
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Squad description..."
                className="min-h-[100px] rounded-xl"
              />
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                  Monthly Price (₹)
                </label>
                <Input
                  type="number"
                  value={formData.monthlyPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      monthlyPrice: Number(e.target.value),
                    })
                  }
                  className="h-12 rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                  Max Members
                </label>
                <Input
                  type="number"
                  value={formData.maxMembers}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxMembers: Number(e.target.value),
                    })
                  }
                  className="h-12 rounded-xl"
                />
              </div>
            </div>

            {/* Manifesto */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                Manifesto Items
              </label>
              <div className="space-y-2">
                {formData.manifesto.map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={item}
                      onChange={(e) => updateManifesto(i, e.target.value)}
                      placeholder={`Item ${i + 1}`}
                      className="h-10 rounded-xl"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-xl hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => removeManifestoItem(i)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={addManifestoItem}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Item
                </Button>
              </div>
            </div>

            {/* Next Session */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                Next Session
              </label>
              <Input
                value={formData.nextSession}
                onChange={(e) =>
                  setFormData({ ...formData, nextSession: e.target.value })
                }
                placeholder="e.g., Saturday, Jan 03"
                className="h-12 rounded-xl"
              />
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full h-14 rounded-2xl font-black italic uppercase tracking-widest shadow-lg shadow-primary/20"
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Save className="mr-2 h-5 w-5" />
              )}
              {editingSquad ? 'Update Squad' : 'Create Squad'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Members Dialog */}
      <Dialog open={isMemberDialogOpen} onOpenChange={setIsMemberDialogOpen}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-border/50">
          <DialogHeader>
            <DialogTitle className="font-black italic uppercase">
              Enrolled Students
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto space-y-4 py-4">
            {isLoadingMembers ? (
              <div className="flex justify-center">
                <Loader2 className="animate-spin" />
              </div>
            ) : members.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm">
                No students enrolled yet.
              </p>
            ) : (
              members.map((member: any) => (
                <div
                  key={member._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/50"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold">{member.studentName}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.studentEmail}
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-500">
                    Active
                  </span>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === 'active'
  const isStartingSoon = status === 'starting-soon'
  const isFull = status === 'full'

  return (
    <span
      className={cn(
        'px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5',
        isActive
          ? 'bg-green-500/10 text-green-500'
          : isStartingSoon
            ? 'bg-orange-500/10 text-orange-500'
            : isFull
              ? 'bg-red-500/10 text-red-500'
              : 'bg-muted text-muted-foreground'
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          isActive
            ? 'bg-green-500 animate-pulse'
            : isStartingSoon
              ? 'bg-orange-500'
              : isFull
                ? 'bg-red-500'
                : 'bg-muted-foreground'
        )}
      />
      {status}
    </span>
  )
}
