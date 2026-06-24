'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Radio, Megaphone, Trash2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDemoAction } from '@/hooks/use-demo-action'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function AnnouncementsPage() {
  const { isDemoRestricted } = useDemoAction()
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Form State
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [priority, setPriority] = useState('NORMAL')

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/admin/announcements')
      if (res.ok) {
        setAnnouncements(await res.json())
      }
    } catch (_error) {
      toast.error('Failed to load announcements')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isDemoRestricted()) return
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, priority }),
      })

      if (res.ok) {
        setIsSuccess(true)
        toast.success('Announcement broadcasted successfully')
        fetchAnnouncements()
        // Reset form
        setTitle('')
        setContent('')
        setPriority('NORMAL')
        setTimeout(() => setIsSuccess(false), 3000)
      } else {
        throw new Error('Failed')
      }
    } catch (_error) {
      toast.error('Failed to broadcast')
    } finally {
      setIsSubmitting(false)
    }
  }

  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    if (isDemoRestricted()) return
    setDeleteId(id)
  }

  const confirmDelete = async () => {
    if (!deleteId) return

    try {
      const res = await fetch(`/api/admin/announcements/${deleteId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('Broadcast deleted')
        setAnnouncements((prev) => prev.filter((a) => a._id !== deleteId))
      } else {
        throw new Error('Failed to delete')
      }
    } catch (_error) {
      toast.error('Failed to delete broadcast')
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic text-foreground flex items-center gap-3">
          <Radio className="h-8 w-8 text-red-500 animate-pulse" />
          Broadcast Center
        </h1>
        <p className="text-muted-foreground font-medium">
          Send global alerts and updates to all users.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="lg:col-span-1">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg font-black uppercase italic tracking-tighter">
                New Announcement
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isSuccess ? (
                <div className="py-10 text-center space-y-4 animate-in fade-in zoom-in">
                  <div className="mx-auto w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold">Sent!</h3>
                    <p className="text-xs text-muted-foreground">
                      Broadcast is live.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsSuccess(false)}
                  >
                    Send Another
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleBroadcast} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Headline
                    </label>
                    <Input
                      placeholder="e.g. Server Maintenance Tonight"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Priority Level
                    </label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NORMAL">Normal Update</SelectItem>
                        <SelectItem value="HIGH">Critical Alert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Content
                    </label>
                    <Textarea
                      placeholder="Details of the announcement..."
                      className="min-h-[120px]"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full font-black italic uppercase tracking-wider"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Broadcasting...'
                    ) : (
                      <span className="flex items-center gap-2">
                        Broadcast Now <Megaphone className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* History List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-xl font-bold">Recent Broadcasts</h2>
            <Badge variant="outline" className="font-mono">
              {announcements.length} Total
            </Badge>
          </div>

          {isLoading ? (
            <div className="py-10 text-center text-muted-foreground italic">
              Loading feed...
            </div>
          ) : announcements.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground italic border-2 border-dashed border-border/50 rounded-xl">
              No announcements found. Silence is golden?
            </div>
          ) : (
            announcements.map((ann) => (
              <Card
                key={ann._id}
                className="border-border/50 bg-card/50 hover:bg-muted/30 transition-all"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {ann.priority === 'HIGH' && (
                          <Badge
                            variant="destructive"
                            className="uppercase font-bold tracking-widest text-[10px]"
                          >
                            Critical
                          </Badge>
                        )}
                        <Badge
                          variant="secondary"
                          className="uppercase font-bold tracking-widest text-[10px] text-muted-foreground"
                        >
                          {new Date(ann.createdAt).toLocaleDateString()}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-black italic tracking-tight">
                        {ann.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {ann.content}
                      </p>
                    </div>
                    <div className="shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        onClick={() => handleDelete(ann._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              broadcast from the system and remove it from all users&apos;
              notification feeds.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Broadcast
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
