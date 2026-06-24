'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from 'sonner'
import {
  Loader2,
  User,
  Mail,
  School,
  Camera,
  AtSign,
  Sparkles,
  Linkedin,
  Code2,
  FileText,
  Globe,
  Copy,
  Check,
  Link2,
  Eye,
  EyeOff,
  Trash2,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function ProfileForm() {
  const { user, refresh } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isUploadingResume, setIsUploadingResume] = useState(false)
  const [fullName, setFullName] = useState(user?.name || '')
  const [username, setUsername] = useState(user?.username || '')
  const [college, setCollege] = useState(user?.college || '')
  const [gender, setGender] = useState((user as any)?.gender || '')
  const [imageUrl, setImageUrl] = useState(user?.image || '')
  const [isGenerating, setIsGenerating] = useState(false)

  // New public profile fields
  const [bio, setBio] = useState((user as any)?.bio || '')
  const [linkedIn, setLinkedIn] = useState((user as any)?.linkedIn || '')
  const [leetCode, setLeetCode] = useState((user as any)?.leetCode || '')
  const [isProfilePublic, setIsProfilePublic] = useState(
    (user as any)?.isProfilePublic || false
  )
  const [isResumePublic, setIsResumePublic] = useState(
    (user as any)?.isResumePublic || false
  )
  const [resumeUrl, setResumeUrl] = useState((user as any)?.resume || '')
  const [copied, setCopied] = useState(false)
  const [initialSynced, setInitialSynced] = useState(false)
  const [isDeletingResume, setIsDeletingResume] = useState(false)

  // Sync state with user data ONLY on initial load
  useEffect(() => {
    if (user && !initialSynced) {
      setFullName(user.name || '')
      setUsername(user.username || '')
      setCollege(user.college || '')
      setGender((user as any).gender || '')
      if (!imageUrl) setImageUrl(user.image || '')
      // Public profile fields
      setBio((user as any).bio || '')
      setLinkedIn((user as any).linkedIn || '')
      setLeetCode((user as any).leetCode || '')
      setIsProfilePublic((user as any).isProfilePublic || false)
      setIsResumePublic((user as any).isResumePublic || false)
      setResumeUrl((user as any).resume || '')
      setInitialSynced(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, initialSynced])

  const handleGenerateUsername = async () => {
    setIsGenerating(true)
    try {
      const res = await fetch('/api/user/generate-username')
      const data = await res.json()
      if (res.ok && data.username) {
        setUsername(data.username)
        toast.success('Username suggested', {
          description: `How about @${data.username}?`,
        })
      }
    } catch (_error) {
      toast.error('Generation failed')
    } finally {
      setIsGenerating(false)
    }
  }

  const fileInputRef = useRef<HTMLInputElement>(null)
  const resumeInputRef = useRef<HTMLInputElement>(null)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          username: username.toLowerCase().trim(),
          college,
          gender,
          image: imageUrl,
          bio,
          linkedIn,
          leetCode,
          isProfilePublic,
          isResumePublic,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update')

      await refresh()

      toast.success('Profile updated successfully', {
        description: 'Your changes have been saved.',
      })
    } catch (error: any) {
      console.error(error)
      toast.error('Update failed', {
        description: error.message || 'Please try again later.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-save visibility settings immediately when toggled
  const handleVisibilityToggle = async (
    field: 'isProfilePublic' | 'isResumePublic',
    value: boolean
  ) => {
    // Update local state immediately
    if (field === 'isProfilePublic') {
      setIsProfilePublic(value)
    } else {
      setIsResumePublic(value)
    }

    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [field]: value,
        }),
      })

      if (!res.ok) throw new Error('Failed to update')

      await refresh()

      toast.success(
        value ? 'Public visibility enabled' : 'Visibility disabled',
        {
          description:
            field === 'isProfilePublic'
              ? value
                ? 'Your profile is now public!'
                : 'Your profile is now private'
              : value
                ? 'Resume is now visible on your profile'
                : 'Resume hidden from profile',
        }
      )
    } catch (_error) {
      // Revert on error
      if (field === 'isProfilePublic') {
        setIsProfilePublic(!value)
      } else {
        setIsResumePublic(!value)
      }
      toast.error('Failed to update visibility')
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File excessively large', {
        description: 'Please pick an image under 10MB',
      })
      return
    }

    setIsUploading(true)

    try {
      const { compressImage } = await import('@/lib/image-compression')
      const compressedBlob = await compressImage(file, 400, 0.6)

      // 1. Get Signature
      const sigRes = await fetch('/api/user/upload-signature', {
        method: 'POST',
        body: JSON.stringify({ type: 'avatar' }),
      })
      if (!sigRes.ok) throw new Error('Failed to get upload signature')
      const sigData = await sigRes.json()

      // 2. Upload to Cloudinary Direct
      const formData = new FormData()
      formData.append('file', compressedBlob, file.name)
      formData.append('api_key', sigData.apiKey)
      formData.append('timestamp', sigData.timestamp.toString())
      formData.append('signature', sigData.signature)
      formData.append('folder', sigData.folder)
      formData.append('type', 'upload')
      formData.append('access_mode', 'public')

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      const data = await uploadRes.json()
      if (!uploadRes.ok) throw new Error(data.error?.message || 'Upload failed')

      setImageUrl(data.secure_url)
      toast.success('Image uploaded', {
        description: 'Click save to apply changes.',
      })
    } catch (error: any) {
      console.error(error)
      toast.error('Upload failed', { description: error.message })
    } finally {
      setIsUploading(false)
    }
  }

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large', { description: 'Resume must be under 5MB' })
      return
    }

    setIsUploadingResume(true)

    try {
      // 1. Get Signature
      const sigRes = await fetch('/api/user/upload-signature', {
        method: 'POST',
        body: JSON.stringify({ type: 'resume' }),
      })
      if (!sigRes.ok) throw new Error('Failed to get upload signature')
      const sigData = await sigRes.json()

      // 2. Upload to Cloudinary Direct
      const formData = new FormData()
      formData.append('file', file)
      formData.append('api_key', sigData.apiKey)
      formData.append('timestamp', sigData.timestamp.toString())
      formData.append('signature', sigData.signature)
      formData.append('folder', sigData.folder)
      formData.append('type', 'upload')
      formData.append('access_mode', 'public')

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sigData.cloudName}/raw/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!uploadRes.ok) {
        const err = await uploadRes.json()
        throw new Error(err.error?.message || 'Cloudinary upload failed')
      }

      const uploadData = await uploadRes.json()

      // 3. Save Metadata to Server
      const saveRes = await fetch('/api/user/save-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeUrl: uploadData.secure_url,
          resumePublicId: uploadData.public_id,
          fileName: file.name,
        }),
      })

      if (!saveRes.ok) {
        const err = await saveRes.json()
        throw new Error(err.error || 'Failed to save resume')
      }

      const _saveData = await saveRes.json()

      setResumeUrl(uploadData.secure_url)
      await refresh()
      toast.success('Resume uploaded', {
        description: 'Your resume has been saved and posted to The Roast.',
      })
    } catch (error: any) {
      console.error(error)
      toast.error('Upload failed', { description: error.message })
    } finally {
      setIsUploadingResume(false)
    }
  }

  const handleDeleteResume = async () => {
    if (!confirm('Are you sure you want to remove your resume?')) return

    setIsDeletingResume(true)
    try {
      const res = await fetch('/api/user/delete-resume', {
        method: 'POST',
      })

      if (!res.ok) throw new Error('Failed to delete resume')

      setResumeUrl('')
      await refresh()
      toast.success('Resume removed')
    } catch (_error) {
      toast.error('Failed to remove resume')
    } finally {
      setIsDeletingResume(false)
    }
  }

  const copyProfileLink = () => {
    const link = `${window.location.origin}/u/${username}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    toast.success('Link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  if (!user) return null

  const _profileLink = username ? `/u/${username}` : null

  return (
    <div className="space-y-6">
      {/* Main Profile Card */}
      <Card className="max-w-2xl mx-auto border-border/50 bg-card/50 backdrop-blur-sm shadow-xl relative">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div className="space-y-1.5">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Profile Settings
            </CardTitle>
            <CardDescription>
              Manage your public profile and account settings.
            </CardDescription>
          </div>
          <Button
            type="submit"
            form="profile-form"
            disabled={isLoading || isUploading}
            className="min-w-[120px] h-10 rounded-xl font-black italic uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <form
            id="profile-form"
            onSubmit={handleUpdateProfile}
            className="space-y-8"
          >
            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                  <AvatarImage
                    src={imageUrl || user.image}
                    alt={fullName}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                    {fullName[0]}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                >
                  {isUploading ? (
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  ) : (
                    <Camera className="h-6 w-6 text-white" />
                  )}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const objectUrl = URL.createObjectURL(file)
                      setImageUrl(objectUrl)
                      handleImageUpload(e)
                    }
                  }}
                />
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black italic">
                  {isUploading ? 'Uploading...' : 'Click to change photo'}
                </p>
                {imageUrl && imageUrl !== user.image && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setImageUrl('')
                      toast.info('Photo removed', {
                        description: 'Click save to apply changes.',
                      })
                    }}
                    className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Loader2 className="mr-1 h-3 w-3 hidden" />
                    Remove Photo
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    value={user.email || ''}
                    disabled
                    className="pl-9 bg-muted/50 border-dashed text-xs h-12 rounded-2xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative group">
                  <AtSign className="absolute left-3 top-4 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-orange-500" />
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) =>
                      setUsername(
                        e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
                      )
                    }
                    className="pl-9 pr-14 font-mono bg-background/50 border-border/50 focus:border-orange-500/50 focus:ring-orange-500/20 transition-all rounded-2xl h-12"
                    placeholder="unique_username"
                  />
                  <button
                    type="button"
                    disabled={isGenerating}
                    onClick={handleGenerateUsername}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white transition-all active:scale-95 disabled:opacity-50 group/magic shadow-sm z-10"
                    title="Suggest unique username"
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 group-hover/magic:animate-pulse" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-9 h-12 rounded-2xl"
                    placeholder="Your Name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="college">College / University</Label>
                <div className="relative">
                  <School className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="college"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="pl-9 h-12 rounded-2xl"
                    placeholder="Enter your college"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 200))}
                className="resize-none rounded-2xl"
                placeholder="A short bio about yourself..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground text-right">
                {bio.length}/200
              </p>
            </div>

            {/* External Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-4 h-4 w-4 text-[#0077B5]" />
                  <Input
                    id="linkedin"
                    value={linkedIn}
                    onChange={(e) => setLinkedIn(e.target.value)}
                    className="pl-9 h-12 rounded-2xl"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="leetcode">LeetCode URL</Label>
                <div className="relative">
                  <Code2 className="absolute left-3 top-4 h-4 w-4 text-orange-500" />
                  <Input
                    id="leetcode"
                    value={leetCode}
                    onChange={(e) => setLeetCode(e.target.value)}
                    className="pl-9 h-12 rounded-2xl"
                    placeholder="https://leetcode.com/u/yourprofile"
                  />
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Public Profile Card */}
      <Card className="max-w-2xl mx-auto border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Public Profile
          </CardTitle>
          <CardDescription>
            Control your public visibility and share your profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Visibility Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="flex items-center gap-3">
                {isProfilePublic ? (
                  <Eye className="h-5 w-5 text-green-500" />
                ) : (
                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium">Make Profile Public</p>
                  <p className="text-xs text-muted-foreground">
                    Anyone can view your profile at /u/{username || 'username'}
                  </p>
                </div>
              </div>
              <Switch
                checked={isProfilePublic}
                onCheckedChange={(value) =>
                  handleVisibilityToggle('isProfilePublic', value)
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Make Resume Public</p>
                  <p className="text-xs text-muted-foreground">
                    Show resume link on your public profile
                  </p>
                </div>
              </div>
              <Switch
                checked={isResumePublic}
                onCheckedChange={(value) =>
                  handleVisibilityToggle('isResumePublic', value)
                }
                disabled={!resumeUrl}
              />
            </div>
          </div>

          {/* Resume Upload */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Resume</p>
                  <p className="text-xs text-muted-foreground">
                    {resumeUrl ? 'Resume uploaded' : 'No resume uploaded yet'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {resumeUrl && (
                  <>
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      View
                    </a>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleDeleteResume}
                      disabled={isDeletingResume}
                      className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10 px-2"
                    >
                      {isDeletingResume ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="mr-2 h-3.5 w-3.5" />
                          Delete
                        </>
                      )}
                    </Button>
                  </>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => resumeInputRef.current?.click()}
                  disabled={isUploadingResume || isDeletingResume}
                  className="h-8"
                >
                  {isUploadingResume ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : resumeUrl ? (
                    'Update'
                  ) : (
                    'Upload'
                  )}
                </Button>
                <input
                  type="file"
                  ref={resumeInputRef}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                />
              </div>
            </div>
          </div>

          {/* Share Link */}
          {username && (
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
              <div className="flex items-center gap-2">
                <Link2 className="h-5 w-5 text-primary" />
                <p className="font-medium text-primary">
                  Your Public Profile Link
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/u/${username}`}
                  readOnly
                  className="font-mono text-sm bg-background/50"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={copyProfileLink}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {!isProfilePublic && (
                <p className="text-xs text-amber-600 flex items-center gap-1">
                  <EyeOff className="h-3 w-3" />
                  Profile is currently private. Enable &quot;Make Profile
                  Public&quot; to share.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
