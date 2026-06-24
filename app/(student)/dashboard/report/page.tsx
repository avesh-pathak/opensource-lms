'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Bug, Send, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { FormSkeleton } from '@/components/skeletons/form-skeleton'

export default function ReportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    type: 'BUG',
    title: '',
    description: '',
    priority: 'LOW',
    screenshot: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setIsSuccess(true)
        toast.success('Report submitted successfully')
      } else {
        throw new Error('Failed to submit report')
      }
    } catch (_error) {
      toast.error('Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex h-[80vh] items-center justify-center p-6">
        <Card className="max-w-md w-full border-green-500/20 bg-green-500/5">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">
              Report Received!
            </h2>
            <p className="text-muted-foreground font-medium">
              Thank you for helping us improve the platform. Our team will
              review this shortly.
            </p>
            <Button
              onClick={() => {
                setIsSuccess(false)
                setFormData({
                  type: 'BUG',
                  title: '',
                  description: '',
                  priority: 'LOW',
                  screenshot: '',
                })
              }}
              className="mt-4"
            >
              Submit Another
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (false) {
    // Placeholder for future data fetching
    return (
      <div className="p-6 lg:p-10 max-w-2xl mx-auto space-y-8">
        <FormSkeleton fieldCount={4} />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-10 max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic text-foreground flex items-center gap-3">
          <Bug className="h-8 w-8 text-orange-500" />
          Report Center
        </h1>
        <p className="text-muted-foreground font-medium">
          Found a glitch? Want a new feature? Let us know.
        </p>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-left block">
                  Type
                </label>
                <Select
                  value={formData.type}
                  onValueChange={(val) =>
                    setFormData({ ...formData, type: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BUG">Bug Report</SelectItem>
                    <SelectItem value="FEATURE">Feature Request</SelectItem>
                    <SelectItem value="CONTENT_ISSUE">Content Issue</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-left block">
                  Priority
                </label>
                <Select
                  value={formData.priority}
                  onValueChange={(val) =>
                    setFormData({ ...formData, priority: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Title
              </label>
              <Input
                placeholder="Brief summary of the issue..."
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2 text-left">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Description
              </label>
              <Textarea
                placeholder="Steps to reproduce, expected behavior, or details about your request..."
                className="min-h-[150px]"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2 text-left">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Screenshot (Optional)
              </label>
              <Input
                type="file"
                accept="image/*"
                className="cursor-pointer"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    try {
                      const { compressImage } =
                        await import('@/lib/image-compression')
                      const compressedBlob = await compressImage(file, 800, 0.7)
                      const reader = new FileReader()
                      reader.readAsDataURL(compressedBlob)
                      reader.onloadend = () => {
                        setFormData((prev) => ({
                          ...prev,
                          screenshot: reader.result as string,
                        }))
                      }
                    } catch (_error) {
                      toast.error('Failed to process image')
                    }
                  }
                }}
              />
              <p className="text-[10px] text-muted-foreground">
                Max 800px width. Auto-compressed.
              </p>
            </div>

            <div className="bg-muted/30 border border-border/50 rounded-xl p-4 flex gap-3 text-sm text-muted-foreground">
              <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-500" />
              <p>
                Please do not include sensitive personal information. By
                submitting, you agree to our terms regarding user feedback.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full font-black italic uppercase tracking-wider h-12 text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Transmitting...'
              ) : (
                <span className="flex items-center gap-2">
                  Submit Report <Send className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
