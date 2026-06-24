'use client'

import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { StudentBookingView } from '@/components/student/student-booking-view'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  ChevronLeft,
  Flame,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Zap,
  ShieldCheck,
  Star,
} from 'lucide-react'
import { toast } from 'sonner'

function MentorBookingContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const _router = useRouter()
  const type = searchParams.get('type') || '1-1'

  const [mentor, setMentor] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const res = await fetch(`/api/mentors/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          setMentor({ ...data, id: data._id })
        } else {
          setMentor(null)
        }
      } catch (_error) {
        console.error('Failed to fetch mentor')
      } finally {
        setIsLoading(false)
      }
    }
    if (params.id) fetchMentor()
  }, [params.id])

  const [resumeUrl, setResumeUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )

  if (!mentor) {
    return <div className="p-10 text-center">Mentor not found</div>
  }

  const handleSubmitRoast = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resumeUrl) {
      toast.error('Please provide a resume link')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/roasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorId: mentor.id,
          resumeUrl,
          notes,
          type: 'ROAST',
        }),
      })

      if (res.ok) {
        setIsSuccess(true)
        toast.success('Roast request submitted!')
      } else {
        throw new Error('Failed to submit')
      }
    } catch (_error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isRoast = type === 'roast'

  const getSessionDetails = () => {
    switch (type) {
      case 'sos':
        return {
          title: 'Transmitter SOS',
          price: 299,
          desc: 'Critical Blocker Resolution',
        }
      case 'roast':
        return { title: 'Clinical Roast', price: 199, desc: 'Artifact Audit' }
      case 'consult':
        return {
          title: 'Flash Consult',
          price: 149,
          desc: 'Situation Awareness',
        }
      default:
        return {
          title: 'Mission Control',
          price: mentor?.hourlyRate || 399,
          desc: 'High-Bandwidth Sync',
        }
    }
  }

  const sessionDetails = getSessionDetails()

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row animate-in fade-in duration-700">
      {/* LEFT PROFILE SIDEBAR */}
      <div className="w-full lg:w-[400px] border-r bg-muted/5 p-8 lg:p-10 space-y-10 lg:sticky top-0 h-fit lg:h-screen overflow-y-auto scrollbar-hide">
        <Link href="/dashboard/mentorship">
          <Button
            variant="ghost"
            className="group -ml-4 px-4 text-muted-foreground hover:text-foreground mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />{' '}
            Back to Mentors
          </Button>
        </Link>

        <div className="space-y-6">
          <div className="relative inline-block">
            <Image
              src={mentor.image}
              alt={mentor.name}
              className="w-32 h-32 rounded-[40px] object-cover border-4 border-background shadow-2xl"
              width={128}
              height={128}
              unoptimized
            />
            <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-primary rounded-2xl flex items-center justify-center border-4 border-background shadow-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl font-black italic uppercase tracking-tighter leading-none">
              {mentor.name}
            </h1>
            <p className="text-sm font-bold text-muted-foreground uppercase opacity-80 tracking-tight">
              {mentor.title} @{' '}
              <span className="text-primary italic">{mentor.company}</span>
            </p>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
              <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
              <span className="text-xs font-black text-yellow-600">
                {mentor.rating || 5}
              </span>
            </div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-40">
              {mentor.sessionsCompleted || 142} Sessions
            </div>
          </div>
        </div>

        <div className="space-y-8 pt-6 border-t border-border/50">
          <div className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">
              Bio
            </h3>
            <p className="text-sm font-medium leading-relaxed italic opacity-70">
              &quot;
              {mentor.bio ||
                'Passionate about building scalable applications and helping engineers level up their skills.'}
              &quot;
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">
              Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {mentor.expertise?.map((skill: string) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="bg-primary/5 text-primary border-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest italic"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* BABUA GUARANTEE */}
          <div className="p-6 rounded-[32px] bg-emerald-500/[0.03] border-2 border-emerald-500/10 space-y-3 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldCheck className="h-20 w-20 text-emerald-500" />
            </div>
            <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400 relative z-10">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-black text-[10px] uppercase tracking-[0.2em] italic">
                Babua Guarantee
              </span>
            </div>
            <p className="text-[11px] text-emerald-900/60 dark:text-emerald-100/60 font-medium leading-relaxed italic relative z-10">
              If the session doesn&apos;t yield measurable throughput, we will
              issue a{' '}
              <span className="text-emerald-600 dark:text-emerald-400 font-black tracking-widest">
                100% REFUND
              </span>{' '}
              instantly.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT BOOKING FLOW */}
      <div className="flex-1 flex flex-col bg-background/50 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8 relative z-10">
          <div className="w-full max-w-2xl">
            {isSuccess ? (
              <div className="text-center space-y-10 animate-in fade-in zoom-in duration-700">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-[48px] bg-emerald-500/20 text-emerald-600 flex items-center justify-center border-2 border-emerald-500/30 shadow-2xl">
                    <CheckCircle2 className="w-16 h-16" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
                    Node Established.
                  </h2>
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.4em] opacity-80">
                    Session Booked Successfully
                  </p>
                </div>

                <div className="p-10 rounded-[64px] bg-card border-2 border-emerald-500/10 shadow-2xl space-y-8">
                  <p className="text-sm font-medium italic opacity-60">
                    You are now scheduled for a session with{' '}
                    <span className="text-foreground font-black">
                      {mentor.name}
                    </span>
                    .
                  </p>
                  <Link href="/dashboard/mentorship">
                    <Button className="w-full h-16 rounded-2xl font-black italic uppercase tracking-[0.2em] bg-primary text-white shadow-2xl shadow-primary/30">
                      Return to Mentorship
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                {isRoast ? (
                  <>
                    <div className="space-y-1 text-center">
                      <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none flex items-center justify-center gap-3">
                        <Flame className="h-8 w-8 text-orange-500" /> Clinical
                        Roast
                      </h2>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-70">
                        Submit your artifacts for brutal feedback
                      </p>
                    </div>

                    <form
                      onSubmit={handleSubmitRoast}
                      className="p-6 rounded-[32px] bg-card border-2 border-border/50 shadow-xl space-y-6"
                    >
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          Resume / Portfolio Link
                        </label>
                        <Input
                          placeholder="https://drive.google.com/..."
                          value={resumeUrl}
                          onChange={(e) => setResumeUrl(e.target.value)}
                          className="bg-background/50"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          Specific Areas to Roast
                        </label>
                        <Textarea
                          placeholder="Be brutal about my CSS..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="bg-background/50 min-h-[100px]"
                        />
                      </div>

                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex gap-3 text-orange-600">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p className="text-xs font-medium">
                          By submitting, you agree to receive honest feedback.
                        </p>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 font-black italic uppercase tracking-wider"
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? 'Submitting...'
                          : `Confirm & Pay ₹${sessionDetails.price}`}
                      </Button>
                    </form>
                  </>
                ) : (
                  <StudentBookingView
                    mentorId={mentor.id}
                    price={sessionDetails.price}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MentorBookingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <MentorBookingContent />
    </Suspense>
  )
}
