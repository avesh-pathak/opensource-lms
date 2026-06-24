'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Edit2, Save, StickyNote } from 'lucide-react'
import { toast } from 'sonner'

export function AdminNotesWidget() {
  const [content, setContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/admin/notes')
      if (res.ok) {
        const data = await res.json()
        setContent(data.content || '')
      }
    } catch (_error) {
      console.error('Failed to fetch notes')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const res = await fetch('/api/admin/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      if (res.ok) {
        toast.success('Notes saved')
        setIsEditing(false)
      }
    } catch (_error) {
      toast.error('Failed to save notes')
    }
  }

  if (isLoading)
    return <div className="h-64 animate-pulse bg-muted/20 rounded-3xl" />

  return (
    <Card className="h-full border-border/50 bg-yellow-100/10 dark:bg-yellow-900/10 backdrop-blur-sm group hover:border-yellow-500/30 transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-black uppercase tracking-widest text-yellow-600 dark:text-yellow-500 flex items-center gap-2">
          <StickyNote className="h-4 w-4" />
          Quick Notes
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-500/10"
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
        >
          {isEditing ? (
            <Save className="h-4 w-4" />
          ) : (
            <Edit2 className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent className="h-[200px]">
        {isEditing ? (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-full resize-none border-0 bg-transparent focus-visible:ring-0 p-0 text-sm font-medium leading-relaxed font-mono text-foreground/80 placeholder:text-muted-foreground/30"
            placeholder="Write something important..."
          />
        ) : (
          <div
            className="h-full overflow-y-auto text-sm font-medium leading-relaxed font-mono whitespace-pre-wrap text-foreground/80 cursor-text focus:outline-none focus:ring-1 focus:ring-yellow-500/50 rounded-md p-1"
            onClick={() => setIsEditing(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsEditing(true)
              }
            }}
            role="button"
            tabIndex={0}
          >
            {content || (
              <span className="text-muted-foreground/40 italic">
                Empty note. Click to add...
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
