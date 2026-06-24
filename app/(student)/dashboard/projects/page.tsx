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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, CheckCircle2, Loader2, Trash2, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type Project = {
  _id?: string
  title: string
  description: string
  techStack: string[]
  status: 'In Progress' | 'Completed' | 'Research' | 'Published'
  progress: number
  githubUrl?: string
  liveUrl?: string
  lastActivity: string
  milestones: { title: string; completed: boolean }[]
  isOfficial?: boolean
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'
  requirements?: string[]
}

export default function ProjectsPage() {
  const [, setActiveTab] = useState('mine')
  const [projects, setProjects] = useState<Project[]>([])
  const [officialProjects, setOfficialProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // New Project Form State
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '',
    description: '',
    techStack: [],
    status: 'In Progress',
    progress: 0,
    milestones: [],
  })
  const [techInput, setTechInput] = useState('')
  const [milestoneInput, setMilestoneInput] = useState('')

  useEffect(() => {
    fetchProjects('mine')
    fetchProjects('official')
  }, [])

  const fetchProjects = async (filter: 'mine' | 'official') => {
    try {
      setLoading(true)
      const res = await fetch(`/api/projects?filter=${filter}`)
      const { data } = await res.json()
      if (Array.isArray(data)) {
        if (filter === 'mine') setProjects(data)
        else setOfficialProjects(data)
      }
    } catch (_err) {
      toast.error('Cloud registry connection failed')
    } finally {
      setLoading(false)
    }
  }

  const handleStartChallenge = async (challenge: Project) => {
    if (confirm(`Start mission: ${challenge.title}?`)) {
      setIsSaving(true)
      try {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: challenge.title,
            description: challenge.description,
            techStack: [],
            status: 'In Progress',
            progress: 0,
            milestones:
              challenge.requirements?.map((r) => ({
                title: r,
                completed: false,
              })) || [],
          }),
        })
        if (res.ok) {
          toast.success('Mission Accepted!')
          fetchProjects('mine')
          setActiveTab('mine')
        }
      } catch (_error) {
        toast.error('Failed to accept mission')
      } finally {
        setIsSaving(false)
      }
    }
  }

  const handleCreateProject = async () => {
    if (!newProject.title) return toast.error('Project identity required')
    setIsSaving(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      })
      if (res.ok) {
        toast.success('Build mission initialized')
        setIsDialogOpen(false)
        fetchProjects('mine')
        setNewProject({
          title: '',
          description: '',
          techStack: [],
          status: 'In Progress',
          progress: 0,
          milestones: [],
        })
      }
    } catch (_err) {
      toast.error('Build initialization failed')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleMilestone = async (project: Project, mIdx: number) => {
    // ... same toggle logic ...
    const updatedMilestones = [...project.milestones]
    updatedMilestones[mIdx].completed = !updatedMilestones[mIdx].completed
    const completedCount = updatedMilestones.filter((m) => m.completed).length
    const newProgress = Math.round(
      (completedCount / updatedMilestones.length) * 100
    )

    try {
      await fetch('/api/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: project._id,
          milestones: updatedMilestones,
          progress:
            updatedMilestones.length > 0 ? newProgress : project.progress,
          status: newProgress === 100 ? 'Completed' : project.status,
        }),
      })
      fetchProjects('mine')
    } catch (_err) {
      toast.error('Milestone update failed')
    }
  }

  // ... addTech, addMilestone ...
  const addTech = () => {
    if (techInput && !newProject.techStack?.includes(techInput)) {
      setNewProject((prev: any) => ({
        ...prev,
        techStack: [...(prev.techStack || []), techInput],
      }))
      setTechInput('')
    }
  }

  const addMilestone = () => {
    if (milestoneInput) {
      setNewProject((prev: any) => ({
        ...prev,
        milestones: [
          ...(prev.milestones || []),
          { title: milestoneInput, completed: false },
        ],
      }))
      setMilestoneInput('')
    }
  }

  const deleteProject = async (id: string) => {
    if (!confirm('Terminate mission? This action is irreversible.')) return
    try {
      await fetch(`/api/projects?id=${id}`, { method: 'DELETE' })
      fetchProjects('mine')
      toast.success('Mission terminated')
    } catch (_err) {
      toast.error('Decommissioning failed')
    }
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/50 pb-8">
        <div className="space-y-4">
          <h1 className="text-4xl lg:text-6xl font-black italic uppercase tracking-tighter text-primary">
            Proof of <span className="text-foreground">Work</span>
          </h1>
          <p className="text-muted-foreground font-medium max-w-2xl text-lg text-balance">
            Execute your vision. Track your architectural milestones and
            showcase your high-signal builds to the registry.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-14 px-8 rounded-2xl bg-primary text-white font-black italic uppercase tracking-widest text-lg shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all">
                <Plus className="mr-2 h-6 w-6" /> Initialize Build
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-card border-border/50 rounded-[32px] overflow-hidden">
              {/* ... Dialog Content ... */}
              <DialogHeader>
                <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter text-primary">
                  Mission Prototype
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto px-1 scrollbar-hide">
                <div className="grid gap-2">
                  <Input
                    placeholder="Project Name"
                    className="bg-muted/50 border-border/50 h-12 rounded-xl"
                    value={newProject.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewProject((prev: any) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                  <Textarea
                    placeholder="Mission description..."
                    className="bg-muted/50 border-border/50 min-h-[100px] rounded-xl"
                    value={newProject.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setNewProject((prev: any) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />

                  {/* Simplified form for brevity, assuming standard inputs */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Input
                        placeholder="Tech Stack (Press Enter)"
                        value={techInput}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setTechInput(e.target.value)
                        }
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                          e.key === 'Enter' && addTech()
                        }
                      />
                      <div className="flex flex-wrap gap-1">
                        {newProject.techStack?.map((t: string) => (
                          <Badge key={t} variant="secondary">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Input
                        placeholder="Milestone (Press Enter)"
                        value={milestoneInput}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setMilestoneInput(e.target.value)
                        }
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                          e.key === 'Enter' && addMilestone()
                        }
                      />
                      <div className="space-y-1">
                        {newProject.milestones?.map(
                          (m: { title: string }, i: number) => (
                            <div key={i} className="text-xs">
                              {m.title}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateProject} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    'Initialize Mission'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs
        defaultValue="mine"
        onValueChange={setActiveTab}
        className="space-y-8"
      >
        <TabsList className="h-12 bg-muted/50 p-1 rounded-2xl w-full md:w-auto inline-flex">
          <TabsTrigger
            value="mine"
            className="h-10 rounded-xl px-6 font-bold uppercase text-xs tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm dark:data-[state=active]:bg-background dark:data-[state=active]:border-transparent"
          >
            My Missions
          </TabsTrigger>
          <TabsTrigger
            value="explore"
            className="h-10 rounded-xl px-6 font-bold uppercase text-xs tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm dark:data-[state=active]:bg-background dark:data-[state=active]:border-transparent"
          >
            Explore Challenges
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mine" className="space-y-8">
          {/* My Projects Grid */}
          {loading && projects.length === 0 ? (
            <div className="text-center py-20 italic">Syncing...</div>
          ) : projects.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-border/50 rounded-[48px] bg-muted/5">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">
                Ready for a new prototype?
              </h3>
              <p className="text-sm text-muted-foreground">
                Initialize a new mission today.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {projects.map((project: Project) => (
                <Card
                  key={project._id}
                  className="relative group bg-card/40 backdrop-blur-2xl border-border/50 rounded-[40px] overflow-hidden hover:border-primary/40 transition-all shadow-xl shadow-black/5"
                >
                  <CardHeader className="p-8 pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge variant="secondary" className="mb-2">
                          {project.status}
                        </Badge>
                        <CardTitle className="text-2xl font-black">
                          {project.title}
                        </CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() =>
                          project._id && deleteProject(project._id)
                        }
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 pt-4 space-y-6">
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    {/* Milestones */}
                    <div className="grid grid-cols-1 gap-2">
                      {project.milestones.map(
                        (
                          ms: { title: string; completed: boolean },
                          idx: number
                        ) => (
                          <button
                            key={idx}
                            onClick={() => toggleMilestone(project, idx)}
                            className={cn(
                              'flex items-center gap-3 p-2 rounded-xl border text-left transition-all',
                              ms.completed
                                ? 'bg-green-500/10 border-green-500/20'
                                : 'bg-muted/30 border-border/50'
                            )}
                          >
                            {ms.completed ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border-2 border-current opacity-30" />
                            )}
                            <span className="text-[10px] font-bold uppercase tracking-widest truncate">
                              {ms.title}
                            </span>
                          </button>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="explore" className="space-y-8">
          {/* Official Challenges */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {officialProjects.map((proj: Project) => (
              <Card
                key={proj._id}
                className="group border-border/50 hover:border-primary/50 transition-all bg-card/30"
              >
                <CardHeader>
                  <div className="flex gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className="text-[10px] font-black uppercase tracking-widest border-primary/20 text-primary"
                    >
                      Official Challenge
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-black uppercase tracking-widest"
                    >
                      {proj.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-black italic uppercase tracking-tight">
                    {proj.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {proj.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-6">
                    <Label className="text-[10px] uppercase font-black tracking-widest opacity-50">
                      Requirements
                    </Label>
                    <ul className="text-xs space-y-1 list-disc list-inside text-muted-foreground">
                      {proj.requirements
                        ?.slice(0, 3)
                        .map((r: string, i: number) => (
                          <li key={i} className="truncate">
                            {r}
                          </li>
                        ))}
                      {(proj.requirements?.length || 0) > 3 && (
                        <li>+{proj.requirements!.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                  <Button
                    onClick={() => handleStartChallenge(proj)}
                    className="w-full rounded-xl font-bold uppercase tracking-widest"
                  >
                    <Play className="mr-2 h-4 w-4" /> Start Challenge
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
