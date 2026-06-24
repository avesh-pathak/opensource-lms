'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Github, Video, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function HackathonSubmissions() {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/admin/hackathons/submissions')
      const data = await res.json()
      if (res.ok) {
        setSubmissions(data)
      }
    } catch (_error) {
      toast.error('Failed to fetch submissions')
    } finally {
      setIsLoading(false)
    }
  }

  const filtered = submissions.filter(
    (s) =>
      s.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.hackathon.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic text-foreground">
          Global Submissions
        </h1>
        <p className="text-muted-foreground font-medium">
          Review and grade hackathon artifacts.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by student or hackathon..."
          className="pl-11 h-12 bg-card/50 border-border/50 rounded-2xl focus:ring-primary/20 max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="text-center py-20 italic animate-pulse">
          Scanning Repositories...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-border/50 rounded-3xl bg-card/20 text-muted-foreground italic">
          No submissions found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((sub) => (
            <Card
              key={sub._id}
              className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col group hover:border-primary/50 transition-all"
            >
              <div className="bg-muted/30 px-5 py-3 border-b border-border/50 flex justify-between items-center">
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase font-black tracking-widest bg-background/50 opacity-70"
                >
                  {sub.hackathon.title}
                </Badge>
                <span className="text-[10px] font-bold text-muted-foreground">
                  {new Date(sub.createdAt).toLocaleDateString()}
                </span>
              </div>
              <CardContent className="p-5 flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-primary/10">
                    <AvatarImage src={sub.userAvatar} />
                    <AvatarFallback>{sub.userName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-bold leading-none">{sub.userName}</div>
                    <div className="text-xs text-muted-foreground font-medium mt-1 truncate max-w-[150px]">
                      {sub.repoUrl.replace('https://github.com/', '')}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed h-10">
                  {sub.description}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs font-bold gap-2"
                    onClick={() => window.open(sub.repoUrl, '_blank')}
                  >
                    <Github className="h-3.5 w-3.5" /> Repo
                  </Button>
                  {sub.deployedUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs font-bold gap-2"
                      onClick={() => window.open(sub.deployedUrl, '_blank')}
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Demo
                    </Button>
                  )}
                </div>

                {sub.videoUrl && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full text-xs font-bold gap-2"
                    onClick={() => window.open(sub.videoUrl, '_blank')}
                  >
                    <Video className="h-3.5 w-3.5" /> Watch Presentation
                  </Button>
                )}

                <div className="flex gap-2 pt-2 border-t border-border/10">
                  <Button className="flex-1 bg-green-500/10 text-green-500 hover:bg-green-500/20 text-xs font-black uppercase tracking-wider">
                    Accept
                  </Button>
                  <Button className="flex-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs font-black uppercase tracking-wider">
                    Reject
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
