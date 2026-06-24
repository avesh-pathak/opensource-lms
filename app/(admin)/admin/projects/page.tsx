'use client'

import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// Mock role check - in real app use session
const isDemoRestricted = () => false

type Project = {
  _id: string
  title: string
  description: string
  status: 'Published' | 'DRAFT' | 'ARCHIVED'
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  requirements: string[]
  isOfficial: boolean
  createdAt: string
  tags: string[]
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    difficulty: 'Intermediate',
    status: 'Published',
    requirements: [''],
    tags: [] as string[],
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects')
      const data = await res.json()
      if (res.ok) {
        setProjects(data)
      }
    } catch (_error) {
      toast.error('Failed to fetch projects')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    if (isDemoRestricted()) return
    try {
      // Filter empty reqs
      const cleanedReqs = newProject.requirements.filter((r) => r.trim() !== '')

      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newProject, requirements: cleanedReqs }),
      })

      if (res.ok) {
        toast.success('Project created')
        setIsCreateOpen(false)
        fetchProjects()
        setNewProject({
          title: '',
          description: '',
          difficulty: 'Intermediate',
          status: 'Published',
          requirements: [''],
          tags: [],
        })
      } else {
        toast.error('Failed to create')
      }
    } catch (_error) {
      toast.error('Error creating project')
    }
  }

  const handleDelete = async (id: string) => {
    if (isDemoRestricted()) return
    if (!confirm('Delete this project?')) return
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        toast.success('Project deleted')
        fetchProjects()
      }
    } catch (_error) {
      toast.error('Failed to delete')
    }
  }

  const handleUpdate = async (id: string, updates: any) => {
    if (isDemoRestricted()) return
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      })
      if (res.ok) {
        toast.success('Updated')
        fetchProjects()
      }
    } catch (_error) {
      toast.error('Update failed')
    }
  }

  const handleRequirementChange = (idx: number, val: string) => {
    const newReqs = [...newProject.requirements]
    newReqs[idx] = val
    setNewProject({ ...newProject, requirements: newReqs })
  }

  const addRequirement = () => {
    setNewProject({
      ...newProject,
      requirements: [...newProject.requirements, ''],
    })
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-foreground">
            Project Challenges
          </h1>
          <p className="text-muted-foreground font-medium">
            Manage official project specifications and challenges.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 px-6 rounded-2xl font-black italic uppercase tracking-wider shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              <Plus className="mr-2 h-5 w-5" />
              New Challenge
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Challenge</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={newProject.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                  placeholder="e.g. distributed-rate-limiter"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select
                    value={newProject.difficulty}
                    onValueChange={(val: any) =>
                      setNewProject({ ...newProject, difficulty: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={newProject.status}
                    onValueChange={(val: any) =>
                      setNewProject({ ...newProject, status: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Published">Published</SelectItem>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newProject.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                  className="h-24"
                  placeholder="Review of the challenge..."
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Requirements</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addRequirement}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {newProject.requirements.map((req, idx) => (
                  <Input
                    key={idx}
                    value={req}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleRequirementChange(idx, e.target.value)
                    }
                    placeholder={`Requirement ${idx + 1}`}
                    className="mb-2"
                  />
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreate}>Create Challenge</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-20 italic animate-pulse">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project._id}
              className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all flex flex-col"
            >
              <CardHeader className="bg-muted/20 pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px] uppercase font-black tracking-widest',
                        project.difficulty === 'Advanced'
                          ? 'text-red-500 border-red-500/20'
                          : project.difficulty === 'Intermediate'
                            ? 'text-yellow-500 border-yellow-500/20'
                            : 'text-green-500 border-green-500/20'
                      )}
                    >
                      {project.difficulty}
                    </Badge>
                    <Badge
                      className={cn(
                        'text-[10px] uppercase font-black tracking-widest',
                        project.status === 'Published'
                          ? 'bg-primary/20 text-primary border-primary/20'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {project.status}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-xl font-black italic uppercase tracking-tight line-clamp-1">
                  {project.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 flex-1 flex flex-col justify-end gap-3">
                <div className="space-y-1">
                  {project.requirements?.slice(0, 3).map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <CheckCircle2 className="h-3 w-3 text-primary" />
                      <span className="truncate">{r}</span>
                    </div>
                  ))}
                  {(project.requirements?.length || 0) > 3 && (
                    <div className="text-xs text-muted-foreground pl-5 opacity-50">
                      +{project.requirements.length - 3} more...
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      handleUpdate(project._id, {
                        status:
                          project.status === 'Published'
                            ? 'DRAFT'
                            : 'Published',
                      })
                    }
                  >
                    {project.status === 'Published' ? 'Unpublish' : 'Publish'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(project._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
