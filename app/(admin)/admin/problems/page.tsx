'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Terminal, Edit3, Trash2, Eye } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useDemoAction } from '@/hooks/use-demo-action'

export default function AdminProblemsPage() {
  const router = useRouter()
  const [problems, setProblems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { isDemoRestricted } = useDemoAction()

  useEffect(() => {
    fetchProblems()
  }, [])

  const fetchProblems = async () => {
    try {
      const res = await fetch('/api/admin/problems')
      if (res.ok) setProblems(await res.json())
    } catch (_error) {
      console.error('Failed to fetch problems')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (isDemoRestricted()) return

    if (
      !confirm(
        `Are you sure you want to delete "${title}"? This action cannot be undone.`
      )
    ) {
      return
    }

    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/problems?id=${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        toast.success(`"${title}" deleted successfully`)
        setProblems(problems.filter((p) => p._id !== id))
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to delete problem')
      }
    } catch (_error) {
      toast.error('Failed to delete problem')
    } finally {
      setDeletingId(null)
    }
  }

  const filteredProblems = problems.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  )

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'text-green-500 bg-green-500/10 border-green-500/20'
      case 'Medium':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
      case 'Hard':
        return 'text-red-500 bg-red-500/10 border-red-500/20'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-foreground flex items-center gap-3">
            <Terminal className="h-8 w-8 text-purple-500" />
            Problem Bank
          </h1>
          <p className="text-muted-foreground font-medium">
            Create and manage coding challenges.
          </p>
        </div>
        <Button
          onClick={() => {
            if (isDemoRestricted()) return
            router.push('/admin/problems/new')
          }}
          className="h-12 px-6 rounded-2xl font-black italic uppercase tracking-wider shadow-lg shadow-purple-500/20 hover:scale-105 transition-all bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Plus className="mr-2 h-5 w-5" /> New Problem
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12 h-14 rounded-2xl bg-card/50 border-border/50 text-lg"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="py-20 text-center text-muted-foreground italic font-medium animate-pulse">
            Loading Problems...
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground italic border-2 border-dashed border-border/50 rounded-3xl">
            No problems found. Start building the library.
          </div>
        ) : (
          filteredProblems.map((problem) => (
            <Card
              key={problem._id}
              className="border-border/50 bg-card/50 hover:bg-muted/50 transition-all group overflow-hidden"
            >
              <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={`uppercase font-bold tracking-widest text-[10px] ${getDifficultyColor(problem.difficulty)}`}
                    >
                      {problem.difficulty}
                    </Badge>
                    <span className="text-xs font-mono text-muted-foreground">
                      Order: {problem.order}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Eye className="h-3 w-3" /> {problem.likes}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    {problem.title}
                    <span className="text-muted-foreground font-normal text-sm font-mono">
                      /{problem.slug}
                    </span>
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Badge
                      variant="secondary"
                      className="text-[10px] uppercase font-bold"
                    >
                      {problem.category}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      if (isDemoRestricted()) return
                      router.push(`/admin/problems/${problem._id}/edit`)
                    }}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    onClick={() => handleDelete(problem._id, problem.title)}
                    disabled={deletingId === problem._id}
                  >
                    <Trash2
                      className={`h-4 w-4 ${deletingId === problem._id ? 'animate-spin' : ''}`}
                    />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
