'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Users,
  Star,
  Calendar,
  Clock,
  X,
} from 'lucide-react'
import { toast } from 'sonner'

interface Mentor {
  _id: string
  name: string
  title: string
  company: string
  image: string
  bio: string
  expertise: string[]
  hourlyRate: number
  rating: number
  sessionsCompleted: number
  languages: string[]
  education: string
  experience: string[]
  linkedinUrl?: string
  isActive: boolean
}

interface TimeSlot {
  id: string
  day: string
  startTime: string
  endTime: string
  isBooked: boolean
}

const emptyMentor = {
  name: '',
  title: '',
  company: '',
  image: '',
  bio: '',
  expertise: [] as string[],
  hourlyRate: 300,
  rating: 5,
  sessionsCompleted: 0,
  languages: [] as string[],
  education: '',
  experience: [] as string[],
  linkedinUrl: '',
}

type MentorFormData = typeof emptyMentor

interface MentorFormProps {
  formData: MentorFormData
  setFormData: React.Dispatch<React.SetStateAction<MentorFormData>>
  expertiseText: string
  setExpertiseText: React.Dispatch<React.SetStateAction<string>>
  languagesText: string
  setLanguagesText: React.Dispatch<React.SetStateAction<string>>
  experienceText: string
  setExperienceText: React.Dispatch<React.SetStateAction<string>>
  isSaving: boolean
  onSubmit: () => void
  submitLabel: string
}

function MentorForm({
  formData,
  setFormData,
  expertiseText,
  setExpertiseText,
  languagesText,
  setLanguagesText,
  experienceText,
  setExperienceText,
  isSaving,
  onSubmit,
  submitLabel,
}: MentorFormProps) {
  return (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Name *</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <Label>Company *</Label>
          <Input
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            placeholder="Google"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Title *</Label>
          <Input
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Senior Software Engineer"
          />
        </div>
        <div className="space-y-2">
          <Label>Hourly Rate (₹) *</Label>
          <Input
            type="number"
            value={formData.hourlyRate}
            onChange={(e) =>
              setFormData({ ...formData, hourlyRate: Number(e.target.value) })
            }
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Rating (1-5)</Label>
          <Input
            type="number"
            min={1}
            max={5}
            step={0.1}
            value={formData.rating}
            onChange={(e) =>
              setFormData({ ...formData, rating: Number(e.target.value) })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Sessions Completed</Label>
          <Input
            type="number"
            min={0}
            value={formData.sessionsCompleted}
            onChange={(e) =>
              setFormData({
                ...formData,
                sessionsCompleted: Number(e.target.value),
              })
            }
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Image URL *</Label>
        <Input
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="/assets/mentors/name.png"
        />
      </div>
      <div className="space-y-2">
        <Label>Bio *</Label>
        <Textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Brief description..."
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label>Expertise * (comma-separated)</Label>
        <Input
          value={expertiseText}
          onChange={(e) => setExpertiseText(e.target.value)}
          placeholder="React, Node.js, TypeScript"
        />
      </div>
      <div className="space-y-2">
        <Label>Languages * (comma-separated)</Label>
        <Input
          value={languagesText}
          onChange={(e) => setLanguagesText(e.target.value)}
          placeholder="English, Hindi"
        />
      </div>
      <div className="space-y-2">
        <Label>Education *</Label>
        <Input
          value={formData.education}
          onChange={(e) =>
            setFormData({ ...formData, education: e.target.value })
          }
          placeholder="B.Tech in Computer Science"
        />
      </div>
      <div className="space-y-2">
        <Label>Experience * (comma-separated)</Label>
        <Input
          value={experienceText}
          onChange={(e) => setExperienceText(e.target.value)}
          placeholder="Senior at Google, Engineer at Meta"
        />
      </div>
      <div className="space-y-2">
        <Label>LinkedIn URL</Label>
        <Input
          value={formData.linkedinUrl}
          onChange={(e) =>
            setFormData({ ...formData, linkedinUrl: e.target.value })
          }
          placeholder="https://linkedin.com/in/..."
        />
      </div>
      <DialogFooter className="pt-4">
        <Button onClick={onSubmit} disabled={isSaving}>
          {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          {submitLabel}
        </Button>
      </DialogFooter>
    </div>
  )
}

export default function AdminMentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isScheduleOpen, setIsScheduleOpen] = useState(false) // NEW
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
  const [formData, setFormData] = useState(emptyMentor)
  const [isSaving, setIsSaving] = useState(false)

  // Form field helpers for comma-separated arrays
  const [expertiseText, setExpertiseText] = useState('')
  const [languagesText, setLanguagesText] = useState('')
  const [experienceText, setExperienceText] = useState('')

  // Schedule state
  const [availability, setAvailability] = useState<TimeSlot[]>([])
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false)
  const [newSlot, setNewSlot] = useState({
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:00',
  })

  const fetchMentors = async () => {
    try {
      const res = await fetch('/api/admin/mentors')
      if (res.ok) {
        const { data } = await res.json()
        setMentors(data)
      }
    } catch (_error) {
      toast.error('Failed to fetch mentors')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMentors()
  }, [])

  const handleCreate = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/admin/mentors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          expertise: expertiseText
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          languages: languagesText
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          experience: experienceText
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      })

      if (res.ok) {
        toast.success('Mentor created successfully')
        setIsCreateOpen(false)
        resetForm()
        fetchMentors()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to create mentor')
      }
    } catch (_error) {
      toast.error('Failed to create mentor')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = async () => {
    if (!selectedMentor) return
    setIsSaving(true)
    try {
      const res = await fetch(`/api/admin/mentors/${selectedMentor._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          expertise: expertiseText
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          languages: languagesText
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          experience: experienceText
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      })

      if (res.ok) {
        toast.success('Mentor updated successfully')
        setIsEditOpen(false)
        resetForm()
        fetchMentors()
      } else {
        toast.error('Failed to update mentor')
      }
    } catch (_error) {
      toast.error('Failed to update mentor')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (mentor: Mentor) => {
    if (!confirm(`Are you sure you want to deactivate ${mentor.name}?`)) return

    try {
      const res = await fetch(`/api/admin/mentors/${mentor._id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('Mentor deactivated')
        fetchMentors()
      } else {
        toast.error('Failed to delete mentor')
      }
    } catch (_error) {
      toast.error('Failed to delete mentor')
    }
  }

  const openEditDialog = (mentor: Mentor) => {
    setSelectedMentor(mentor)
    setFormData({
      name: mentor.name,
      title: mentor.title,
      company: mentor.company,
      image: mentor.image,
      bio: mentor.bio,
      expertise: mentor.expertise,
      hourlyRate: mentor.hourlyRate,
      rating: mentor.rating || 5,
      sessionsCompleted: mentor.sessionsCompleted || 0,
      languages: mentor.languages,
      education: mentor.education,
      experience: mentor.experience,
      linkedinUrl: mentor.linkedinUrl || '',
    })
    setExpertiseText(mentor.expertise.join(', '))
    setLanguagesText(mentor.languages.join(', '))
    setExperienceText(mentor.experience.join(', '))
    setIsEditOpen(true)
  }

  const resetForm = () => {
    setFormData(emptyMentor)
    setExpertiseText('')
    setLanguagesText('')
    setExperienceText('')
    setSelectedMentor(null)
  }

  // Schedule Handlers
  const openScheduleDialog = async (mentor: Mentor) => {
    setSelectedMentor(mentor)
    setIsScheduleOpen(true)
    setIsLoadingSchedule(true)
    try {
      const res = await fetch(`/api/admin/mentors/${mentor._id}/availability`)
      if (res.ok) {
        const { data } = await res.json()
        setAvailability(data)
      }
    } catch (_error) {
      toast.error('Failed to load schedule')
    } finally {
      setIsLoadingSchedule(false)
    }
  }

  const handleAddSlot = () => {
    const slot: TimeSlot = {
      id: Date.now().toString(),
      day: newSlot.day,
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      isBooked: false,
    }
    setAvailability([...availability, slot])
  }

  const removeSlot = (id: string) => {
    setAvailability(availability.filter((slot) => slot.id !== id))
  }

  const handleSaveSchedule = async () => {
    if (!selectedMentor) return
    setIsSaving(true)
    try {
      const res = await fetch(
        `/api/admin/mentors/${selectedMentor._id}/availability`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(availability),
        }
      )

      if (res.ok) {
        toast.success('Schedule updated successfully')
        setIsScheduleOpen(false)
      } else {
        toast.error('Failed to update schedule')
      }
    } catch (_error) {
      toast.error('Failed to save schedule')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">
            Mentors Management
          </h1>
          <p className="text-muted-foreground font-medium">
            Add, edit, or remove mentors from the platform.
          </p>
        </div>

        <Dialog
          open={isCreateOpen}
          onOpenChange={(open) => {
            setIsCreateOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button className="shadow-lg shadow-primary/20 font-black uppercase tracking-wider">
              <Plus className="mr-2 h-4 w-4" /> Add Mentor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Mentor</DialogTitle>
            </DialogHeader>
            <MentorForm
              formData={formData}
              setFormData={setFormData}
              expertiseText={expertiseText}
              setExpertiseText={setExpertiseText}
              languagesText={languagesText}
              setLanguagesText={setLanguagesText}
              experienceText={experienceText}
              setExperienceText={setExperienceText}
              isSaving={isSaving}
              onSubmit={handleCreate}
              submitLabel="Create Mentor"
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : mentors.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground font-medium">
              No mentors yet. Add your first mentor!
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/50 bg-card/50">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mentor</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Expertise</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mentors.map((mentor) => (
                <TableRow key={mentor._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={mentor.image} />
                        <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold">{mentor.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {mentor.title}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{mentor.company}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {mentor.expertise.slice(0, 2).map((e) => (
                        <Badge
                          key={e}
                          variant="secondary"
                          className="text-[10px]"
                        >
                          {e}
                        </Badge>
                      ))}
                      {mentor.expertise.length > 2 && (
                        <Badge variant="outline" className="text-[10px]">
                          +{mentor.expertise.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">
                    ₹{mentor.hourlyRate}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      <span className="font-bold">{mentor.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={mentor.isActive ? 'default' : 'secondary'}>
                      {mentor.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Manage Schedule"
                        onClick={() => openScheduleDialog(mentor)}
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditDialog(mentor)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(mentor)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open)
          if (!open) resetForm()
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Mentor</DialogTitle>
          </DialogHeader>
          <MentorForm
            formData={formData}
            setFormData={setFormData}
            expertiseText={expertiseText}
            setExpertiseText={setExpertiseText}
            languagesText={languagesText}
            setLanguagesText={setLanguagesText}
            experienceText={experienceText}
            setExperienceText={setExperienceText}
            isSaving={isSaving}
            onSubmit={handleEdit}
            submitLabel="Save Changes"
          />
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Schedule</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <Label className="text-xs uppercase font-bold text-muted-foreground">
                Add New Slot
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={newSlot.day}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, day: e.target.value })
                  }
                >
                  {[
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                  ].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <Input
                  type="time"
                  value={newSlot.startTime}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, startTime: e.target.value })
                  }
                />
                <Input
                  type="time"
                  value={newSlot.endTime}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, endTime: e.target.value })
                  }
                />
              </div>
              <Button size="sm" className="w-full" onClick={handleAddSlot}>
                <Plus className="h-4 w-4 mr-2" /> Add Slot
              </Button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              <Label className="text-xs uppercase font-bold text-muted-foreground">
                Current Slots
              </Label>
              {isLoadingSchedule ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : availability.length === 0 ? (
                <p className="text-sm text-center text-muted-foreground py-4">
                  No slots added yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {availability.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-card"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-bold">{slot.day}</p>
                          <p className="text-xs text-muted-foreground">
                            {slot.startTime} - {slot.endTime}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeSlot(slot.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button onClick={handleSaveSchedule} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Save Schedule
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
