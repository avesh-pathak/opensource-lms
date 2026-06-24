'use client'

import { useState, useEffect, use } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  ChevronLeft,
  Plus,
  Trash2,
  Search,
  Edit2,
  ExternalLink,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'

export default function PatternDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const id = resolvedParams.id

  const [pattern, setPattern] = useState<any>(null)
  const [linkedProblems, setLinkedProblems] = useState<any[]>([])
  const [allProblems, setAllProblems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Dialog States
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProblems, setSelectedProblems] = useState<string[]>([])

  // Create/Edit State
  const [problemForm, setProblemForm] = useState({
    title: '',
    problem_link: '',
    difficulty: 'Easy',
    status: 'Pending',
    _id: '', // For edit mode
  })

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchData = async () => {
    try {
      // 1. Fetch Pattern Details
      const pRes = await fetch('/api/admin/patterns')
      const pData = await pRes.json()
      const currentPattern = pData.find((p: any) => p._id === id)
      setPattern(currentPattern)

      // 2. Fetch Linked Problems
      const lRes = await fetch(`/api/admin/patterns/${id}/problems`)
      if (lRes.ok) {
        const lData = await lRes.json()
        setLinkedProblems(lData)
      }

      // 3. Fetch All Problems (for linking)
      const aRes = await fetch('/api/admin/problems')
      if (aRes.ok) {
        const aData = await aRes.json()
        setAllProblems(aData)
      }
    } catch (_error) {
      toast.error('Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateProblem = async () => {
    if (!problemForm.title) {
      toast.error('Title is required')
      return
    }

    try {
      // Create the problem properly via API, linking it globaly to this topic
      const res = await fetch('/api/admin/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: problemForm.title,
          problem_link: problemForm.problem_link,
          difficulty: problemForm.difficulty,
          status: problemForm.status,
          topic: pattern.name, // Auto-link via topic name logic
        }),
      })

      if (res.ok) {
        toast.success('Problem created and linked')
        setIsCreateOpen(false)
        resetForm()
        fetchData()
      } else {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create problem')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error creating problem')
    }
  }

  const handleUpdateProblem = async () => {
    try {
      const res = await fetch('/api/admin/problems', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: problemForm._id,
          title: problemForm.title,
          problem_link: problemForm.problem_link,
          difficulty: problemForm.difficulty,
          status: problemForm.status,
          topic: pattern.name,
        }),
      })

      if (res.ok) {
        toast.success('Problem updated')
        setIsEditOpen(false)
        resetForm()
        fetchData()
      } else {
        throw new Error('Failed to update problem')
      }
    } catch (_error) {
      toast.error('Error updating problem')
    }
  }

  const handleAddProblems = async () => {
    if (selectedProblems.length === 0) return

    try {
      const res = await fetch(`/api/admin/patterns/${id}/problems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          problemIds: selectedProblems,
        }),
      })

      if (res.ok) {
        toast.success(`Linked ${selectedProblems.length} problems`)
        setIsAddOpen(false)
        setSelectedProblems([])
        fetchData()
      } else {
        throw new Error('Failed to link problems')
      }
    } catch (_error) {
      toast.error('Error linking problems')
    }
  }

  const handleRemoveProblem = async (problemId: string) => {
    if (!confirm('Remove this problem from the pattern?')) return

    try {
      const res = await fetch(`/api/admin/patterns/${id}/problems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove',
          problemIds: [problemId],
        }),
      })

      if (res.ok) {
        toast.success('Problem removed')
        fetchData()
      }
    } catch (_error) {
      toast.error('Error removing problem')
    }
  }

  const openEdit = (problem: any) => {
    setProblemForm({
      ...problem,
      difficulty: problem.difficulty || 'Easy',
      status: problem.status || 'Pending',
    })
    setIsEditOpen(true)
  }

  const resetForm = () => {
    setProblemForm({
      title: '',
      problem_link: '',
      difficulty: 'Easy',
      status: 'Pending',
      _id: '',
    })
  }

  // Filter problems for the picker
  const availableProblems = allProblems.filter(
    (p) => !linkedProblems.some((lp) => lp._id === p._id)
  )
  const filteredAvailable = availableProblems.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading)
    return (
      <div className="p-10 text-center animate-pulse">Loading Studio...</div>
    )
  if (!pattern)
    return (
      <div className="p-10 text-center text-red-500">Pattern not found</div>
    )

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild size="icon" className="rounded-xl">
          <Link href="/admin/patterns">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">
              {pattern.name}
            </h1>
            <Badge
              variant="outline"
              className="text-xs uppercase tracking-widest"
            >
              {pattern.domain}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {pattern.subject} • {linkedProblems.length} Problems
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-black uppercase italic tracking-tight">
              Curated Problems
            </CardTitle>
            <CardDescription>
              Manage problems for this pattern below.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {/* Create New Problem */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-primary text-primary-foreground font-black uppercase tracking-wider"
                  onClick={resetForm}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Problem</DialogTitle>
                  <DialogDescription>
                    Add a fresh problem to the bank and link it here.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={problemForm.title}
                      onChange={(e) =>
                        setProblemForm({
                          ...problemForm,
                          title: e.target.value,
                        })
                      }
                      placeholder="e.g. Invert Binary Tree"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Link</Label>
                    <Input
                      value={problemForm.problem_link}
                      onChange={(e) =>
                        setProblemForm({
                          ...problemForm,
                          problem_link: e.target.value,
                        })
                      }
                      placeholder="https://leetcode.com/..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Difficulty</Label>
                      <select
                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={problemForm.difficulty}
                        onChange={(e) =>
                          setProblemForm({
                            ...problemForm,
                            difficulty: e.target.value,
                          })
                        }
                      >
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <select
                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={problemForm.status}
                        onChange={(e) =>
                          setProblemForm({
                            ...problemForm,
                            status: e.target.value,
                          })
                        }
                      >
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateProblem}>Create & Link</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Link Existing */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="font-black uppercase tracking-wider"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Link Existing
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>Link Existing Problems</DialogTitle>
                  <DialogDescription>
                    Search and select from the global problem bank.
                  </DialogDescription>
                </DialogHeader>
                <div className="relative my-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search problems..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 min-h-[300px]">
                  {filteredAvailable.map((p) => (
                    <div
                      key={p._id}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        id={`p-${p._id}`}
                        checked={selectedProblems.includes(p._id)}
                        onCheckedChange={(checked: boolean) => {
                          if (checked)
                            setSelectedProblems([...selectedProblems, p._id])
                          else
                            setSelectedProblems(
                              selectedProblems.filter((id) => id !== p._id)
                            )
                        }}
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`p-${p._id}`}
                          className="font-bold text-sm cursor-pointer select-none block"
                        >
                          {p.title}
                        </label>
                        <span
                          className={`text-[10px] uppercase font-black px-1.5 py-0.5 rounded ${
                            p.difficulty === 'Easy'
                              ? 'bg-green-100 text-green-700'
                              : p.difficulty === 'Medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {p.difficulty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <DialogFooter className="pt-4 border-t">
                  <Button
                    onClick={handleAddProblems}
                    disabled={selectedProblems.length === 0}
                  >
                    Link Selected
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {linkedProblems.length > 0 ? (
            linkedProblems.map((p, index) => (
              <div
                key={p._id}
                className="flex items-center justify-between p-4 rounded-xl border bg-background group hover:border-primary/50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center font-mono text-xs text-muted-foreground">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-bold group-hover:text-primary transition-colors">
                      {p.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px] h-5">
                        {p.difficulty}
                      </Badge>
                      <Badge
                        variant={
                          p.status === 'Completed' ? 'default' : 'outline'
                        }
                        className="text-[10px] h-5"
                      >
                        {p.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-muted-foreground hover:text-blue-500"
                    onClick={() => openEdit(p)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemoveProblem(p._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {p.problem_link && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      asChild
                    >
                      <a
                        href={p.problem_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-xl text-muted-foreground">
              No problems linked to this pattern yet.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Problem</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={problemForm.title}
                onChange={(e) =>
                  setProblemForm({ ...problemForm, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Link</Label>
              <Input
                value={problemForm.problem_link}
                onChange={(e) =>
                  setProblemForm({
                    ...problemForm,
                    problem_link: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <select
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={problemForm.difficulty}
                  onChange={(e) =>
                    setProblemForm({
                      ...problemForm,
                      difficulty: e.target.value,
                    })
                  }
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={problemForm.status}
                  onChange={(e) =>
                    setProblemForm({ ...problemForm, status: e.target.value })
                  }
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateProblem}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
