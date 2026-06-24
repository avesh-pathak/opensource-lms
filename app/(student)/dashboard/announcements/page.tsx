'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Radio, AlertTriangle, Pin } from 'lucide-react'

export default function StudentAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch('/api/announcements') // Using public student API
        if (res.ok) {
          setAnnouncements(await res.json())
        }
      } catch (_error) {
        console.error('Failed to load announcements')
      } finally {
        setIsLoading(false)
      }
    }
    fetchAnnouncements()
  }, [])

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic text-foreground flex items-center justify-center lg:justify-start gap-3">
          <Radio className="h-8 w-8 text-primary animate-pulse" />
          Transmission Log
        </h1>
        <p className="text-muted-foreground font-medium">
          Important updates from command.
        </p>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="py-20 text-center text-muted-foreground italic font-medium animate-pulse">
            Scanning frequencies...
          </div>
        ) : announcements.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground italic border-2 border-dashed border-border/50 rounded-3xl">
            No transmissions received. Radio silence.
          </div>
        ) : (
          announcements.map((ann) => (
            <Card
              key={ann._id}
              className="border-l-4 border-l-primary border-y-border/50 border-r-border/50 bg-card/50 backdrop-blur-sm overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {ann.priority === 'HIGH' && (
                        <Badge
                          variant="destructive"
                          className="uppercase font-bold tracking-widest text-[10px] flex items-center gap-1"
                        >
                          <AlertTriangle className="h-3 w-3" /> Critical
                        </Badge>
                      )}
                      {ann.priority !== 'HIGH' && (
                        <Badge
                          variant="secondary"
                          className="uppercase font-bold tracking-widest text-[10px] bg-primary/10 text-primary hover:bg-primary/20"
                        >
                          <Pin className="h-3 w-3 mr-1" /> Update
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground font-mono">
                        {new Date(ann.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{ann.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {ann.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
