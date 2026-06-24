'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Flame,
  CheckCircle2,
  XCircle,
  FileText,
  History,
  Star,
  Clock,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { useDemoAction } from '@/hooks/use-demo-action'

export default function AdminModeration() {
  const [roasts, setRoasts] = useState<any[]>([])
  const [stories, setStories] = useState<any[]>([])
  const [_isLoading, setIsLoading] = useState(true)
  const { isDemoRestricted } = useDemoAction()

  useEffect(() => {
    fetchModerationData()
  }, [])

  const fetchModerationData = async () => {
    setIsLoading(true)
    try {
      // Simplified fetch for now
      const roastRes = await fetch('/api/admin/moderation/roasts')
      const storyRes = await fetch('/api/admin/moderation/stories')

      if (roastRes.ok) setRoasts(await roastRes.json())
      if (storyRes.ok) setStories(await storyRes.json())
    } catch (_error) {
      toast.error('Failed to fetch moderation queue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleModerate = async (
    type: 'roasts' | 'stories',
    id: string,
    status: 'APPROVED' | 'VERIFIED' | 'REJECTED'
  ) => {
    if (isDemoRestricted()) return
    try {
      const res = await fetch(`/api/admin/moderation/${type}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        toast.success(`Content ${status.toLowerCase()} successfully`)
        fetchModerationData()
      } else {
        throw new Error('Update failed')
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic text-foreground">
          Command Center
        </h1>
        <p className="text-muted-foreground font-medium">
          Moderate community submissions and verify success stories.
        </p>
      </div>

      <Tabs defaultValue="roasts" className="space-y-6">
        <TabsList className="bg-card/50 border border-border/50 p-1 h-14 rounded-2xl gap-2">
          <TabsTrigger
            value="roasts"
            className="rounded-xl h-full data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:bg-primary dark:data-[state=active]:text-white dark:data-[state=active]:border-transparent font-black italic uppercase text-[10px] tracking-widest px-8"
          >
            <Flame className="mr-2 h-4 w-4" />
            Roast Queue ({roasts.length})
          </TabsTrigger>
          <TabsTrigger
            value="stories"
            className="rounded-xl h-full data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:bg-primary dark:data-[state=active]:text-white dark:data-[state=active]:border-transparent font-black italic uppercase text-[10px] tracking-widest px-8"
          >
            <Star className="mr-2 h-4 w-4" />
            Success Stories ({stories.length})
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-xl h-full data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:bg-primary dark:data-[state=active]:text-white dark:data-[state=active]:border-transparent font-black italic uppercase text-[10px] tracking-widest px-8"
          >
            <History className="mr-2 h-4 w-4" />
            Archive
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roasts" className="space-y-4">
          {roasts.length === 0 ? (
            <EmptyState message="No pending roasts in the pit." icon={Flame} />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {roasts.map((roast) => (
                <ModerationCard
                  key={roast._id}
                  item={roast}
                  type="roasts"
                  onModerate={(status) =>
                    handleModerate('roasts', roast._id, status)
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="stories" className="space-y-4">
          {stories.length === 0 ? (
            <EmptyState
              message="No unverified stories await review."
              icon={Star}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {stories.map((story) => (
                <ModerationCard
                  key={story._id}
                  item={story}
                  type="stories"
                  onModerate={(status) =>
                    handleModerate('stories', story._id, status)
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ModerationCard({
  item,
  type,
  onModerate,
}: {
  item: any
  type: 'roasts' | 'stories'
  onModerate: (status: any) => void
}) {
  const isRoast = type === 'roasts'
  const proofUrl = isRoast ? item.resumeUrl : item.proofUrl

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden group">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row lg:items-center">
          <div className="p-6 flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full border-2 border-primary/20 p-0.5">
                  <Image
                    src={item.avatar}
                    alt={item.builder}
                    className="h-full w-full rounded-full object-cover"
                    width={40}
                    height={40}
                    unoptimized
                  />
                </div>
                <div>
                  <h3 className="font-black italic uppercase tracking-tighter text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Submitted by {item.builder}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 rounded-xl border-border/50 text-[10px] font-black italic uppercase tracking-wider"
                onClick={() => window.open(proofUrl, '_blank')}
              >
                <FileText className="mr-2 h-3.5 w-3.5" />
                {isRoast ? 'View Resume' : 'View Proof'}
              </Button>
            </div>

            {!isRoast && (
              <p className="text-sm text-muted-foreground font-medium line-clamp-3 bg-muted/20 p-4 rounded-xl italic">
                &quot;{item.content}&quot;
              </p>
            )}

            <div className="flex items-center gap-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                {new Date(item.createdAt).toLocaleDateString()}
              </div>
              {isRoast && (
                <div className="flex items-center gap-2">
                  <Flame className="h-3.5 w-3.5 text-orange-500" />
                  {item.status}
                </div>
              )}
            </div>
          </div>

          <div className="p-6 lg:w-64 lg:border-l border-border/50 bg-muted/20 flex lg:flex-col gap-3">
            <Button
              className="flex-1 rounded-xl bg-green-500 hover:bg-green-600 text-white font-black italic uppercase text-[10px] tracking-widest h-10 shadow-lg shadow-green-500/20"
              onClick={() => onModerate(isRoast ? 'APPROVED' : 'VERIFIED')}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {isRoast ? 'Approve' : 'Verify'}
            </Button>
            <Button
              variant="destructive"
              className="flex-1 rounded-xl font-black italic uppercase text-[10px] tracking-widest h-10 shadow-lg shadow-destructive/20"
              onClick={() => onModerate('REJECTED')}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({ message, icon: Icon }: { message: string; icon: any }) {
  return (
    <div className="py-32 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border/50 rounded-3xl bg-card/20 backdrop-blur-sm">
      <Icon className="h-12 w-12 mb-4 opacity-20" />
      <p className="italic font-medium">{message}</p>
    </div>
  )
}
