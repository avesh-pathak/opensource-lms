'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Heart,
  MessageSquare,
  FileText,
  Download,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function CommunityFeedPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [community, setCommunity] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCommunityData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const fetchCommunityData = async () => {
    try {
      // Fetch community details
      const commRes = await fetch(`/api/communities?slug=${slug}`)
      const commData = await commRes.json()

      if (Array.isArray(commData) && commData.length > 0) {
        setCommunity(commData[0])
      } else {
        toast.error('Community not found')
        return
      }

      // Fetch posts
      const postsRes = await fetch(`/api/community/posts?slug=${slug}`)
      const postsData = await postsRes.json()

      if (Array.isArray(postsData)) {
        setPosts(postsData)
      }
    } catch (error) {
      console.error('Failed to load community:', error)
      toast.error('Failed to load community feed')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
        <div className="h-64 bg-muted/20 animate-pulse rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 bg-muted/20 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      </div>
    )
  }

  if (!community) {
    return (
      <div className="p-6 lg:p-10 text-center">
        <p className="text-muted-foreground">Community not found</p>
        <Button
          onClick={() => router.push('/dashboard/community')}
          className="mt-4"
        >
          Back to Communities
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => router.push('/dashboard/community')}
        className="group text-muted-foreground hover:text-primary -ml-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Hubs
      </Button>

      {/* Community Header */}
      <div className="relative group p-10 lg:p-12 rounded-[32px] overflow-hidden bg-card border shadow-xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <Badge
            className={cn(
              'font-black uppercase text-[10px] px-4 py-1.5 h-auto border-0',
              community.status === 'active'
                ? 'bg-emerald-500/10 text-emerald-500'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {community.status}
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase italic leading-none">
            {community.name}
          </h1>
          <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-2xl">
            {community.description}
          </p>
          <div className="flex items-center gap-4 pt-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span>{posts.length} Posts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-border/50 rounded-3xl bg-card/20">
          <p className="text-muted-foreground italic">
            No posts yet. Be the first to contribute!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card
              key={post._id}
              className="border-border/50 bg-card/50 backdrop-blur-sm group hover:border-primary/50 transition-all overflow-hidden flex flex-col"
            >
              <div className="bg-muted/30 px-5 py-3 border-b border-border/50 flex justify-between items-center">
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase font-black tracking-widest bg-background/50"
                >
                  {post.category || 'General'}
                </Badge>
                {post.type === 'resume' && (
                  <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-[8px] font-black uppercase">
                    Resume
                  </Badge>
                )}
                {post.isPinned && (
                  <div className="bg-yellow-500/10 p-1.5 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-3 h-3 text-yellow-500"
                    >
                      <path d="M18.75 12.75h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zM12 6a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 6zM12 18a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 18zM3.75 6.75h1.5a.75.75 0 100-1.5h-1.5a.75.75 0 000 1.5zM5.25 18.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 010 1.5zM3 12a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 013 12zM9 3.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM12.75 12a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0zM9 20.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
                    </svg>
                  </div>
                )}
              </div>
              <CardContent className="p-5 flex-1 flex flex-col gap-4">
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-black italic tracking-tight leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {post.content}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-4 pt-2 border-t border-border/10">
                    <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-red-500 transition-colors">
                      <Heart className="h-4 w-4" />
                      <span>{post.likes?.length || 0}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.commentsCount || 0}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
                        {post.authorId?.name?.[0] || post.author?.[0] || 'A'}
                      </div>
                      <span>
                        {post.authorId?.name || post.author || 'Anonymous'}
                      </span>
                    </div>
                    <span className="opacity-70">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Resume Action Buttons */}
                  {post.type === 'resume' && post.resumeUrl && (
                    <div className="flex gap-2 pt-3 border-t border-border/30">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-8 text-xs font-black uppercase"
                        onClick={() =>
                          window.open(
                            post.resumeUrl,
                            '_blank',
                            'noopener,noreferrer'
                          )
                        }
                      >
                        <FileText className="h-3 w-3 mr-1.5" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-8 text-xs font-black uppercase"
                        onClick={() => {
                          const link = document.createElement('a')
                          link.href = post.resumeUrl
                          link.download = post.fileName || 'resume.pdf'
                          link.target = '_blank'
                          document.body.appendChild(link)
                          link.click()
                          document.body.removeChild(link)
                        }}
                      >
                        <Download className="h-3 w-3 mr-1.5" />
                        Download
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
