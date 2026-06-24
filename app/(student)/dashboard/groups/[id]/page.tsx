'use client'

import React, { useState, useEffect, use } from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  Calendar,
  Target,
  Loader2,
} from 'lucide-react'
import { useMentorship } from '@/hooks/use-mentorship'
import { toast } from 'sonner'

interface Squad {
  _id: string
  name: string
  mentorId: string
  mentorName: string
  mentorImage: string
  mentorTitle: string
  mentorCompany: string
  category: string
  description: string
  manifesto: string[]
  monthlyPrice: number
  memberCount: number
  maxMembers: number
  weeklySchedule: string[]
  nextSession: string
  status: string
  members: string[]
}

export default function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { addSession: _addSession } = useMentorship()
  const { id } = use(params)

  const [squad, setSquad] = useState<Squad | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [step, setStep] = useState<'overview' | 'checkout' | 'success'>(
    'overview'
  )
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderId, setOrderId] = useState('')

  useEffect(() => {
    fetchSquad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchSquad = async () => {
    try {
      const res = await fetch(`/api/squads/${id}`)
      if (res.ok) {
        const data = await res.json()
        setSquad(data)
      } else {
        setSquad(null)
      }
    } catch (error) {
      console.error('Failed to fetch squad:', error)
      setSquad(null)
    } finally {
      setIsLoading(false)
    }
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    if (!squad) return
    setIsProcessing(true)

    try {
      // Load Razorpay SDK
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        toast.error('Razorpay SDK failed to load')
        setIsProcessing(false)
        return
      }

      // Create order
      const orderRes = await fetch('/api/squads/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: squad.monthlyPrice, currency: 'INR' }),
      })

      if (!orderRes.ok) throw new Error('Failed to create order')
      const orderData = await orderRes.json()

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Babua Mentorship',
        description: `Join ${squad.name} Squad`,
        order_id: orderData.id,
        handler: async function (response: any) {
          // Verify payment
          const verifyRes = await fetch('/api/squads/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: squad.monthlyPrice,
              squadId: squad._id,
              currency: 'INR',
            }),
          })

          if (verifyRes.ok) {
            setOrderId(response.razorpay_order_id)
            setStep('success')
            toast.success('Successfully joined the squad!')
          } else {
            const errorData = await verifyRes.json()
            toast.error(errorData.error || 'Payment verification failed')
          }
          setIsProcessing(false)
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false)
            toast.info('Payment cancelled')
          },
        },
        prefill: {
          name: 'Student',
          email: 'student@example.com',
        },
        theme: { color: '#FB923C' },
      }

      const paymentObject = new (window as any).Razorpay(options)
      paymentObject.open()
    } catch (error) {
      console.error(error)
      toast.error('Error initiating payment')
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!squad) return notFound()

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row animate-in fade-in duration-700">
      {/* LEFT: SQUAD MANIFESTO */}
      <div className="w-full lg:w-[450px] border-r bg-muted/5 p-8 lg:p-12 space-y-10 lg:sticky top-0 h-fit lg:h-screen overflow-y-auto scrollbar-hide">
        <Link href="/dashboard/groups">
          <Button
            variant="ghost"
            className="group -ml-4 px-4 text-muted-foreground hover:text-foreground mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />{' '}
            All Squads
          </Button>
        </Link>

        <div className="space-y-6">
          <Badge
            variant="secondary"
            className="px-3 py-1 bg-primary/10 text-primary border-primary/10 font-black text-[10px] uppercase tracking-widest italic"
          >
            {squad.category} Coalition
          </Badge>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
            {squad.name}
          </h1>
          <p className="text-sm font-bold text-muted-foreground italic leading-relaxed opacity-80">
            {squad.description}
          </p>
        </div>

        <div className="space-y-8 pt-6 border-t border-border/50">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">
              The Manifesto
            </h3>
            <div className="space-y-4">
              {squad.manifesto.map((item, i) => (
                <div key={i} className="flex gap-3 group">
                  <div className="mt-1 h-5 w-5 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                    <Target className="w-3 h-3 text-primary group-hover:text-white" />
                  </div>
                  <p className="text-xs font-bold italic opacity-70 group-hover:opacity-100 transition-opacity">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">
              Mentor Lead
            </h3>
            <div className="flex items-center gap-4 p-4 rounded-[32px] bg-card border-2 border-border/50 relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
              <Image
                src={squad.mentorImage}
                alt={squad.mentorName}
                className="w-12 h-12 rounded-2xl object-cover border-2 shadow-lg relative z-10"
                width={48}
                height={48}
                unoptimized
              />
              <div className="relative z-10 space-y-0.5">
                <p className="text-xs font-black uppercase italic">
                  {squad.mentorName}
                </p>
                <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-70 tracking-widest leading-none">
                  {squad.mentorTitle} @ {squad.mentorCompany}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: ACTION FLOW */}
      <div className="flex-1 flex flex-col bg-background/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />

        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative z-10">
          <div className="w-full max-w-2xl">
            {step === 'overview' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none">
                    Initialize Enrollment
                  </h2>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] opacity-60">
                    Establish a persistent neural link
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 rounded-[48px] bg-card border-2 border-border/50 space-y-3 hover:border-primary/50 transition-all duration-500">
                    <Users className="w-10 h-10 text-primary mb-2" />
                    <h4 className="text-base font-black italic uppercase tracking-tighter">
                      Squad Capacity
                    </h4>
                    <div className="text-2xl font-black italic text-primary">
                      {squad.memberCount} / {squad.maxMembers}
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase italic">
                      Limited throughput nodes available
                    </p>
                  </div>
                  <div className="p-8 rounded-[48px] bg-card border-2 border-border/50 space-y-3 hover:border-primary/50 transition-all duration-500">
                    <Calendar className="w-10 h-10 text-primary mb-2" />
                    <h4 className="text-base font-black italic uppercase tracking-tighter">
                      Weekly Frequency
                    </h4>
                    <div className="space-y-1">
                      {squad.weeklySchedule.map((time, i) => (
                        <div
                          key={i}
                          className="text-[10px] font-black italic uppercase text-primary/80 leading-none"
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-8 lg:p-10 rounded-[48px] bg-primary/[0.02] border-2 border-dashed border-primary/30 flex flex-wrap flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-12 relative overflow-hidden">
                  <div className="space-y-1 text-center lg:text-left shrink-0">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">
                      Subscription Model
                    </div>
                    <div className="text-3xl lg:text-4xl font-black italic tracking-tighter text-primary flex items-baseline gap-2 justify-center lg:justify-start">
                      ₹{squad.monthlyPrice}
                      <span className="text-[10px] lg:text-xs text-muted-foreground/40 font-bold tracking-widest uppercase">
                        / month
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => setStep('checkout')}
                    disabled={squad.status === 'full'}
                    className="w-full lg:w-auto h-16 px-8 lg:px-10 rounded-2xl font-black italic uppercase tracking-[0.1em] bg-primary text-white shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap disabled:opacity-50"
                  >
                    {squad.status === 'full'
                      ? 'Squad Full'
                      : 'Proceed to Checkout'}{' '}
                    <ArrowRight className="ml-3 w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            {step === 'checkout' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-10 duration-700">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none">
                    Confirm Coalition Join
                  </h2>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] opacity-60">
                    Authorize recurring transmission credits
                  </p>
                </div>

                <div className="p-10 rounded-[56px] bg-card border-2 border-border/50 shadow-[0_30px_70px_rgba(0,0,0,0.12)] space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-bl-[100px] -mr-12 -mt-12" />

                  <div className="flex items-center gap-6 pb-8 border-b border-dashed border-border/50">
                    <div className="p-1 rounded-[28px] bg-primary/10 border-2 border-primary/20">
                      <div className="h-20 w-20 rounded-[24px] bg-primary text-white flex items-center justify-center">
                        <Users className="h-10 w-10" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-3xl font-black uppercase italic tracking-tighter">
                        {squad.name}
                      </h3>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] opacity-60">
                        Led by {squad.mentorName}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6 py-4">
                    <div className="flex justify-between items-center text-left group">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">
                          Billing Frequency
                        </span>
                        <div className="text-xl font-black italic uppercase tracking-tighter">
                          Monthly Recurring
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[8px] font-black uppercase italic border-emerald-500/30 text-emerald-600 bg-emerald-500/5"
                      >
                        Instant Cancel Anytime
                      </Badge>
                    </div>
                    <div className="flex flex-wrap flex-col lg:flex-row justify-center lg:justify-between items-center gap-8 text-center lg:text-left">
                      <div className="space-y-1 shrink-0">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">
                          Total Monthly Allocation
                        </span>
                        <div className="text-4xl font-black italic uppercase tracking-tighter text-primary">
                          ₹{squad.monthlyPrice}
                        </div>
                      </div>
                      <Button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full lg:w-auto h-16 px-10 lg:px-12 rounded-2xl font-black italic uppercase tracking-[0.1em] bg-foreground text-background hover:bg-foreground/90 shadow-2xl transition-all duration-300 disabled:opacity-50 whitespace-nowrap"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Pay & Subscribe'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center items-center gap-6">
                  <Button
                    variant="ghost"
                    onClick={() => setStep('overview')}
                    className="text-[10px] font-black uppercase italic tracking-widest text-muted-foreground hover:text-foreground"
                  >
                    Abort Request
                  </Button>
                  <div className="h-1 w-1 rounded-full bg-border" />
                  <div className="flex items-center gap-2 text-emerald-600/60">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase tracking-widest italic">
                      Razorpay Secure
                    </span>
                  </div>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="text-center space-y-10 animate-in fade-in zoom-in duration-700">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-[56px] bg-emerald-500/10 text-emerald-500 flex items-center justify-center border-2 border-emerald-500/30 shadow-2xl relative z-10">
                    <CheckCircle2 className="w-16 h-16" />
                  </div>
                  <div className="absolute -bottom-4 -right-4 h-14 w-14 bg-white rounded-2xl border-2 flex items-center justify-center shadow-2xl z-20">
                    <Zap className="h-7 w-7 text-primary fill-current" />
                  </div>
                  <div className="absolute -top-6 -left-6 w-12 h-12 bg-primary/5 rounded-full blur-xl animate-pulse" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-[0.8]">
                    Neural Coalition Joined.
                  </h2>
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.6em] opacity-60 pt-2">
                    ID: {orderId}
                  </p>
                </div>

                <div className="p-12 rounded-[64px] bg-card border-2 border-emerald-500/20 shadow-[0_40px_80px_rgba(0,0,0,0.15)] space-y-10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-emerald-500/[0.01]" />
                  <div className="space-y-3 relative z-10">
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-emerald-600">
                      Transmission Established
                    </h3>
                    <p className="text-sm font-bold italic opacity-60 leading-relaxed max-w-[320px] mx-auto">
                      Welcome to the{' '}
                      <span className="text-foreground font-black">
                        {squad.name}
                      </span>
                      . Your technical acceleration protocols are now active.
                    </p>
                  </div>

                  <div className="pt-8 border-t border-dashed border-border/50 relative z-10 space-y-4">
                    <Link href="/dashboard">
                      <Button className="w-full h-16 rounded-2xl font-black italic uppercase tracking-[0.2em] bg-primary text-white shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
                        Enter Mission Command
                      </Button>
                    </Link>
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 italic px-12 leading-relaxed">
                      Your primary terminal will receive Discord &apos;War
                      Room&apos; linkage and session node schedule within 10
                      minutes.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
