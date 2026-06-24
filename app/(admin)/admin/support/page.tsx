'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Bug,
  Lightbulb,
  AlertCircle,
  MessageSquare,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { toast } from 'sonner'

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/support/tickets')
      if (res.ok) {
        setTickets(await res.json())
      }
    } catch (_error) {
      toast.error('Failed to fetch tickets')
    } finally {
      setIsLoading(false)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'BUG':
        return <Bug className="h-4 w-4 text-red-500" />
      case 'FEATURE':
        return <Lightbulb className="h-4 w-4 text-yellow-500" />
      case 'CONTENT_ISSUE':
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      default:
        return <MessageSquare className="h-4 w-4 text-blue-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'border-red-500 text-red-500 bg-red-500/10'
      case 'HIGH':
        return 'border-orange-500 text-orange-500 bg-orange-500/10'
      case 'MEDIUM':
        return 'border-yellow-500 text-yellow-500 bg-yellow-500/10'
      default:
        return 'border-blue-500 text-blue-500 bg-blue-500/10'
    }
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic text-foreground flex items-center gap-3">
          <Bug className="h-8 w-8 text-red-500" />
          Support Command
        </h1>
        <p className="text-muted-foreground font-medium">
          Manage user reports and feature requests.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-red-500/5 border-red-500/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                Open Bugs
              </p>
              <p className="text-3xl font-black italic">
                {
                  tickets.filter((t) => t.type === 'BUG' && t.status === 'OPEN')
                    .length
                }
              </p>
            </div>
            <Bug className="h-8 w-8 text-red-500 opacity-50" />
          </CardContent>
        </Card>
        <Card className="bg-yellow-500/5 border-yellow-500/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                Requests
              </p>
              <p className="text-3xl font-black italic">
                {tickets.filter((t) => t.type === 'FEATURE').length}
              </p>
            </div>
            <Lightbulb className="h-8 w-8 text-yellow-500 opacity-50" />
          </CardContent>
        </Card>
        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                Total Tickets
              </p>
              <p className="text-3xl font-black italic">{tickets.length}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-500 opacity-50" />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="py-20 text-center text-muted-foreground italic font-medium animate-pulse">
            Scanning frequency...
          </div>
        ) : tickets.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground italic border-2 border-dashed border-border/50 rounded-3xl">
            All systems nominal. No active tickets.
          </div>
        ) : (
          tickets.map((ticket) => (
            <Card
              key={ticket._id}
              className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden hover:border-primary/50 transition-all"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={`flex items-center gap-1.5 font-bold uppercase tracking-widest text-[10px] ${getPriorityColor(ticket.priority)}`}
                      >
                        {getIcon(ticket.type)}
                        {ticket.type}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="uppercase font-mono text-[10px] text-muted-foreground"
                      >
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </Badge>
                      {ticket.priority === 'CRITICAL' && (
                        <Badge className="bg-red-500 text-white animate-pulse uppercase font-black text-[10px]">
                          Critical
                        </Badge>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{ticket.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {ticket.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback>
                            {ticket.userName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          {ticket.userName} ({ticket.userEmail})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {ticket.screenshot && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-10 px-4 rounded-xl font-bold uppercase tracking-wider text-[10px]"
                          >
                            <ImageIcon className="mr-2 h-3.5 w-3.5" />{' '}
                            Screenshot
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl bg-black/90 border-zinc-800 p-1">
                          <div className="relative">
                            <Image
                              src={ticket.screenshot}
                              alt="Evidence"
                              className="w-full h-auto rounded-lg"
                              width={1200}
                              height={800}
                              unoptimized
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}

                    <Button
                      size="sm"
                      className="h-10 px-6 rounded-xl font-black italic uppercase tracking-wider bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Resolve
                    </Button>
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
