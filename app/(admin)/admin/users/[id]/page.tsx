'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Mail,
  User,
  Calendar,
  MapPin,
  Trophy,
  Flame,
  Star,
  ShieldAlert,
  CheckCircle2,
  PenTool,
  Clock,
  FileText,
  ExternalLink,
  Linkedin,
  Code2,
  Globe,
  Target,
  Award,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function UserProfileView() {
  const params = useParams()
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [activityLogs, setActivityLogs] = useState<any[]>([])

  const fetchUserDetails = async () => {
    try {
      const res = await fetch(`/api/admin/users/${params.id}`)
      if (res.ok) {
        const { data } = await res.json()
        setData(data)
      } else {
        throw new Error('Failed to fetch user')
      }
    } catch (_error) {
      toast.error('Could not load user profile')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchActivityLogs = async () => {
    try {
      const res = await fetch(`/api/admin/users/${params.id}/activity`)
      if (res.ok) {
        const { data } = await res.json()
        setActivityLogs(data)
      }
    } catch (_error) {
      console.error('Failed to fetch logs')
    }
  }

  useEffect(() => {
    if (params.id) {
      fetchUserDetails()
      fetchActivityLogs()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const toggleBan = async () => {
    if (!data || !data.user) return
    const newStatus = !data.user.isBanned
    const action = newStatus ? 'ban' : 'unban'

    if (!confirm(`Are you sure you want to ${action} this user?`)) return

    try {
      const res = await fetch(`/api/admin/users/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBanned: newStatus }),
      })

      if (res.ok) {
        toast.success(`User ${action}ned successfully`)
        fetchUserDetails()
      } else {
        throw new Error('Failed to update user status')
      }
    } catch (_error) {
      toast.error('Error updating status')
    }
  }

  if (isLoading)
    return (
      <div className="p-10 text-center animate-pulse">Loading Profile...</div>
    )
  if (!data || !data.user)
    return <div className="p-10 text-center text-red-500">User not found</div>

  const { user, stats } = data

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="hover:bg-transparent pl-0 gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Directory
      </Button>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-card shadow-2xl">
            <AvatarImage src={user.image} />
            <AvatarFallback className="text-2xl font-black">
              {user.name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">
                {user.name}
              </h1>
              {user.isBanned && (
                <Badge
                  variant="destructive"
                  className="uppercase tracking-widest font-black"
                >
                  Banned
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" /> {user.email}
            </p>
            <div className="flex items-center gap-3 pt-1">
              <Badge
                variant="outline"
                className="uppercase tracking-widest font-bold text-[10px]"
              >
                {user.role || 'Student'}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {user.username && (
            <Link href={`/u/${user.username}`} target="_blank">
              <Button variant="outline" className="font-bold">
                <Globe className="mr-2 h-4 w-4" />
                View Public Profile
                <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          )}
          <Button
            variant={user.isBanned ? 'outline' : 'destructive'}
            className="font-black italic uppercase tracking-wider"
            onClick={toggleBan}
          >
            <ShieldAlert className="mr-2 h-4 w-4" />
            {user.isBanned ? 'Unban User' : 'Ban User'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="md:col-span-1 border-border/50 bg-card/50 backdrop-blur-sm h-fit">
          <CardHeader>
            <CardTitle className="text-lg font-black uppercase italic tracking-tighter">
              Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm font-medium text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 opacity-70" />@
              {user.username || 'No username'}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 opacity-70" />
              {user.college || 'No college set'}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 opacity-70" />
              Joined{' '}
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : 'N/A'}
            </div>
            {user.bio && (
              <div className="pt-2 border-t border-border/50">
                <p className="text-xs italic text-foreground/80">
                  &quot;{user.bio}&quot;
                </p>
              </div>
            )}
            {user.linkedIn && (
              <div className="flex items-center gap-2">
                <Linkedin className="h-4 w-4 text-[#0077B5]" />
                <a
                  href={user.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0077B5] hover:underline truncate text-xs"
                >
                  LinkedIn Profile
                </a>
              </div>
            )}
            {user.leetCode && (
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-orange-500" />
                <a
                  href={user.leetCode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:underline truncate text-xs"
                >
                  LeetCode Profile
                </a>
              </div>
            )}
            {user.resume && (
              <div className="pt-2 border-t border-border/50 w-full">
                <Button
                  variant="outline"
                  className="w-full justify-start text-primary hover:text-primary hover:bg-primary/10 border-primary/20"
                  asChild
                >
                  <a
                    href={user.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    View / Download Resume
                    <ExternalLink className="ml-auto h-3 w-3 opacity-50" />
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats & Activity */}
        <div className="md:col-span-2 space-y-6">
          {/* Proof of Work Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-primary/10 border-primary/20">
              <CardContent className="p-4 text-center">
                <Trophy className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-black text-primary">
                  {user.solvedProblems?.length || 0}
                </p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                  Solved
                </p>
              </CardContent>
            </Card>
            <Card className="bg-green-500/10 border-green-500/20">
              <CardContent className="p-4 text-center">
                <Target className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-black text-green-500">
                  {stats.easyCount || 0}
                </p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                  Easy
                </p>
              </CardContent>
            </Card>
            <Card className="bg-yellow-500/10 border-yellow-500/20">
              <CardContent className="p-4 text-center">
                <Flame className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-black text-yellow-500">
                  {stats.mediumCount || 0}
                </p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                  Medium
                </p>
              </CardContent>
            </Card>
            <Card className="bg-red-500/10 border-red-500/20">
              <CardContent className="p-4 text-center">
                <Award className="h-6 w-6 text-red-500 mx-auto mb-2" />
                <p className="text-2xl font-black text-red-500">
                  {stats.hardCount || 0}
                </p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                  Hard
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Legacy Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-orange-500/10 border-orange-500/20">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500">
                  <Flame className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Roasts
                  </p>
                  <p className="text-3xl font-black italic">
                    {stats.roastCount}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-yellow-500/10 border-yellow-500/20">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                  <Star className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Stories
                  </p>
                  <p className="text-3xl font-black italic">
                    {stats.storyCount}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-black italic uppercase tracking-tighter">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activityLogs.length > 0 ? (
                <div className="space-y-4">
                  {activityLogs.map((log) => (
                    <div
                      key={log._id}
                      className="flex items-start gap-4 p-4 rounded-xl bg-muted/20 border border-border/50"
                    >
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary mt-1">
                        <ActivityIcon action={log.action} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {formatAction(log.action)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(log.createdAt).toLocaleString()}
                        </p>
                        {log.metadata && (
                          <pre className="text-[10px] bg-black/20 p-2 rounded mt-2 overflow-x-auto text-muted-foreground">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 text-muted-foreground italic font-medium border-2 border-dashed border-border/50 rounded-xl">
                  No recent activity found.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ActivityIcon({ action }: { action: string }) {
  if (action.includes('SOLVED')) return <CheckCircle2 className="h-4 w-4" />
  if (action.includes('POSTED')) return <PenTool className="h-4 w-4" />
  return <Clock className="h-4 w-4" />
}

function formatAction(action: string) {
  return action
    .split('_')
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ')
}
