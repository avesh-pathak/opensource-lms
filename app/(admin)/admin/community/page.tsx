'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, Heart } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDemoAction } from '@/hooks/use-demo-action'

export default function AdminCommunity() {
  const { isDemoRestricted } = useDemoAction()
  const [posts, setPosts] = useState<any[]>([])
  const [communities, setCommunities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newPost, setNewPost] = useState({
    title: '',
    category: 'General',
    content: '',
    author: 'Babua Team',
    communityId: '',
    status: 'PUBLISHED',
    isPinned: false,
  })

  useEffect(() => {
    fetchPosts()
    fetchCommunities()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchCommunities = async () => {
    try {
      const res = await fetch('/api/communities')
      const data = await res.json()
      if (res.ok && Array.isArray(data)) {
        setCommunities(data)
        // Set first community as default
        if (data.length > 0 && !newPost.communityId) {
          setNewPost((prev) => ({ ...prev, communityId: data[0]._id }))
        }
      }
    } catch (error) {
      console.error('Failed to fetch communities', error)
    }
  }

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/community')
      const data = await res.json()
      if (res.ok) {
        setPosts(data)
      }
    } catch (_error) {
      toast.error('Failed to fetch posts')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async (id: string, data: any) => {
    if (isDemoRestricted()) return
    try {
      const res = await fetch('/api/admin/community', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      })
      if (res.ok) {
        toast.success('Updated successfully')
        fetchPosts()
      }
    } catch (_error) {
      toast.error('Failed to update')
    }
  }

  const handleCreate = async () => {
    if (isDemoRestricted()) return
    try {
      const res = await fetch('/api/admin/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      })
      if (res.ok) {
        toast.success('Post created successfully')
        setIsCreateOpen(false)
        fetchPosts()
        setNewPost({
          title: '',
          category: 'General',
          content: '',
          author: 'Babua Team',
          communityId: communities[0]?._id || '',
          status: 'PUBLISHED',
          isPinned: false,
        })
      } else {
        throw new Error('Failed to create post')
      }
    } catch (_error) {
      toast.error('Error creating post')
    }
  }

  const handleDelete = async (id: string) => {
    if (isDemoRestricted()) return
    if (!confirm('Are you sure you want to remove this post?')) return
    try {
      const res = await fetch(`/api/admin/community?id=${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        toast.success('Post removed')
        fetchPosts()
      }
    } catch (_error) {
      toast.error('Failed to delete post')
    }
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        {/* Header ... */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-foreground">
            Community Hub
          </h1>
          <p className="text-muted-foreground font-medium">
            Broadcast updates and manage community discussions.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 px-6 rounded-2xl font-black italic uppercase tracking-wider shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              <Plus className="mr-2 h-5 w-5" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Community Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Title */}
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({ ...newPost, title: e.target.value })
                  }
                  placeholder="Enter post title"
                />
              </div>

              {/* Community & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Community</Label>
                  <Select
                    value={newPost.communityId}
                    onValueChange={(val: string) =>
                      setNewPost({ ...newPost, communityId: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select community" />
                    </SelectTrigger>
                    <SelectContent>
                      {communities.map((comm) => (
                        <SelectItem key={comm._id} value={comm._id}>
                          {comm.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={newPost.status}
                    onValueChange={(val: string) =>
                      setNewPost({ ...newPost, status: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Category & Author */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={newPost.category}
                    onValueChange={(val: string) =>
                      setNewPost({ ...newPost, category: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="Announcements">
                        Announcements
                      </SelectItem>
                      <SelectItem value="Frontend">Frontend</SelectItem>
                      <SelectItem value="Backend">Backend</SelectItem>
                      <SelectItem value="System Design">
                        System Design
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Author Name</Label>
                  <Input
                    value={newPost.author}
                    onChange={(e) =>
                      setNewPost({ ...newPost, author: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Pin */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={newPost.isPinned}
                  onChange={(e) =>
                    setNewPost({ ...newPost, isPinned: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="isPinned">Pin this post</Label>
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({ ...newPost, content: e.target.value })
                  }
                  placeholder="Write your update here..."
                  className="h-32"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreate}>Create Post</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="text-center py-20 italic animate-pulse">
          Loading Feed...
        </div>
      ) : posts.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-border/50 rounded-3xl bg-card/20 text-muted-foreground italic">
          No active posts found. Start the conversation!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card
              key={post._id}
              className="border-border/50 bg-card/50 backdrop-blur-sm group hover:border-primary/50 transition-all overflow-hidden flex flex-col"
            >
              <div className="bg-muted/30 px-5 py-3 border-b border-border/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase font-black tracking-widest bg-background/50"
                  >
                    {post.category}
                  </Badge>
                  <Badge
                    className={
                      post.status === 'PUBLISHED'
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-gray-500/10 text-gray-500'
                    }
                  >
                    {post.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={
                      post.isPinned
                        ? 'text-yellow-500'
                        : 'text-muted-foreground'
                    }
                    onClick={() =>
                      handleUpdate(post._id, { isPinned: !post.isPinned })
                    }
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(post._id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
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

                {/* Controls */}
                <div className="flex gap-2 w-full">
                  {post.status === 'DRAFT' ? (
                    <Button
                      size="sm"
                      className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold"
                      onClick={() =>
                        handleUpdate(post._id, { status: 'PUBLISHED' })
                      }
                    >
                      Publish
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs font-bold"
                      onClick={() =>
                        handleUpdate(post._id, { status: 'DRAFT' })
                      }
                    >
                      Unpublish
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground font-medium pt-2 border-t border-border/10">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
                      {post.author?.[0] || 'B'}
                    </div>
                    <span>{post.author}</span>
                  </div>
                  <span className="opacity-70">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
