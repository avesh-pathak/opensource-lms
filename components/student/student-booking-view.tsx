'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { addDays } from 'date-fns/addDays'
import { format } from 'date-fns/format'
import { isSameDay } from 'date-fns/isSameDay'
import { startOfToday } from 'date-fns/startOfToday'
import { ChevronLeft, ChevronRight, Clock, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface StudentBookingViewProps {
  mentorId?: string
  price?: number
}

export function StudentBookingView({
  mentorId,
  price = 399,
}: StudentBookingViewProps) {
  const today = startOfToday()
  const [currentStartDate, setCurrentStartDate] = useState(today)
  const [selectedDate, setSelectedDate] = useState<Date>(today)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)
  const [slots, setSlots] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  // Generate 5 visible days
  const days = Array.from({ length: 5 }).map((_, i) =>
    addDays(currentStartDate, i)
  )

  // Fetch availability from API
  useEffect(() => {
    const fetchSlots = async () => {
      if (!mentorId) {
        setIsLoading(false)
        return
      }
      try {
        const res = await fetch(`/api/mentors/${mentorId}/availability`)
        if (res.ok) {
          setSlots(await res.json())
        }
      } catch (_error) {
        console.error('Failed to fetch slots')
      } finally {
        setIsLoading(false)
      }
    }
    fetchSlots()
  }, [mentorId])

  // Get available slots for a specific date
  const getAvailableSlots = useCallback(
    (date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd')
      return slots.filter((slot) => slot.dateString === dateStr)
    },
    [slots]
  )

  const nextDays = useCallback(
    () => setCurrentStartDate(addDays(currentStartDate, 5)),
    [currentStartDate]
  )

  const prevDays = useCallback(() => {
    const newDate = addDays(currentStartDate, -5)
    if (newDate >= today) setCurrentStartDate(newDate)
  }, [currentStartDate, today])

  const handleSelectSlot = useCallback((day: Date, slot: any) => {
    setSelectedDate(day)
    setSelectedTime(slot.startTime)
    setSelectedSlotId(slot._id)
  }, [])

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true)
        return
      }
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      )
      if (existingScript) {
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleProceed = async () => {
    if (!selectedSlotId) return

    setIsProcessing(true)
    try {
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        toast.error('Razorpay SDK failed to load')
        setIsProcessing(false)
        return
      }

      const orderRes = await fetch('/api/payments/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: price, currency: 'INR' }),
      })

      if (!orderRes.ok) throw new Error('Failed to create order')
      const orderData = await orderRes.json()

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Babua Mentorship',
        description: 'Schedule Synchronization',
        order_id: orderData.id,
        handler: async function (response: any) {
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: price,
              currency: 'INR',
            }),
          })

          if (verifyRes.ok) {
            await finalizeBooking(
              selectedSlotId,
              response.razorpay_order_id,
              response.razorpay_payment_id
            )
          } else {
            toast.error('Payment verification failed')
            setIsProcessing(false)
          }
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
    } catch (e) {
      console.error(e)
      toast.error('Error initiating booking')
      setIsProcessing(false)
    }
  }

  const finalizeBooking = async (
    slotId: string,
    razorpayOrderId?: string,
    razorpayPaymentId?: string
  ) => {
    const selectedSlot = slots.find((s) => s._id === slotId)

    try {
      const res = await fetch('/api/mentorship/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId,
          mentorId,
          sessionType: '1-1',
          price,
          razorpayOrderId,
          razorpayPaymentId,
          date: selectedSlot?.date,
          dateString: selectedSlot?.dateString,
          startTime: selectedSlot?.startTime,
        }),
      })

      if (res.ok) {
        toast.success('Schedule Synchronized!')
        setSelectedSlotId(null)
        setSelectedTime(null)
        // Refetch slots
        const slotsRes = await fetch(`/api/mentors/${mentorId}/availability`)
        if (slotsRes.ok) setSlots(await slotsRes.json())
      } else {
        toast.error('Failed to confirm booking')
      }
    } catch (_e) {
      toast.error('Error confirming booking')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading)
    return <div className="animate-pulse h-64 bg-muted/20 rounded-3xl w-full" />

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h2 className="text-2xl font-black italic uppercase tracking-tighter leading-none">
          Schedule Synchronization
        </h2>
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-70">
          Select a temporal node for execution
        </p>
      </div>

      <div className="p-6 rounded-[32px] bg-card border-2 border-border/50 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-0.5">
            <h3 className="font-bold text-lg">Select a Time</h3>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {format(days[0], 'MMMM yyyy')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevDays}
              disabled={currentStartDate <= today}
              className="h-8 w-8 rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextDays}
              className="h-8 w-8 rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid - responsive columns */}
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 min-w-[280px]">
            {days.map((day) => {
              const isDateSelected = isSameDay(day, selectedDate)
              const daySlots = getAvailableSlots(day)

              return (
                <div key={day.toString()} className="space-y-3">
                  {/* Date Header */}
                  <div
                    className={cn(
                      'text-center p-2 rounded-xl text-sm font-medium transition-all border cursor-pointer',
                      isDateSelected
                        ? 'bg-[#FB923C] border-[#FB923C] text-white shadow-lg shadow-orange-500/30 scale-105'
                        : 'bg-transparent border-transparent text-orange-700 hover:text-orange-500'
                    )}
                  >
                    <div
                      className={cn(
                        'text-[10px] uppercase font-black tracking-wider',
                        isDateSelected ? 'text-white' : 'text-orange-600/80'
                      )}
                    >
                      {format(day, 'EEE')}
                    </div>
                    <div
                      className={cn(
                        'font-black text-lg',
                        isDateSelected ? 'text-white' : 'text-orange-800'
                      )}
                    >
                      {format(day, 'd')}
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div className="space-y-2">
                    {daySlots.length === 0 ? (
                      <div className="text-[10px] text-center text-muted-foreground py-2 italic opacity-50">
                        No slots
                      </div>
                    ) : (
                      daySlots.map((slot) => {
                        const isSelected = selectedSlotId === slot._id
                        const isBooked = slot.isBooked

                        return (
                          <button
                            type="button"
                            key={slot._id}
                            onClick={() =>
                              !isBooked && handleSelectSlot(day, slot)
                            }
                            disabled={isBooked}
                            className={cn(
                              'w-full text-xs font-bold py-2 rounded-lg border transition-all',
                              isBooked
                                ? 'bg-muted text-muted-foreground/50 border-transparent cursor-not-allowed grayscale'
                                : isSelected
                                  ? 'bg-[#FB923C] text-white border-[#FB923C] shadow-md shadow-[#FB923C]/20 scale-105'
                                  : 'bg-background border-border hover:border-primary/50 text-foreground hover:scale-105 active:scale-95 cursor-pointer'
                            )}
                          >
                            {slot.startTime} {isBooked && '(Booked)'}
                          </button>
                        )
                      })
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground justify-center pt-4">
          <Clock className="w-3 h-3" />
          <span>All times in your local timezone</span>
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] bg-primary/[0.02] border-2 border-dashed border-primary/20">
        <div className="space-y-0.5 text-center sm:text-left">
          <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground italic opacity-70">
            Mission Control Credit
          </div>
          <div className="text-2xl font-black italic tracking-tighter text-primary">
            ₹{price}
          </div>
        </div>
        <Button
          disabled={!selectedTime || isProcessing}
          onClick={handleProceed}
          className="w-full sm:w-auto h-12 px-8 rounded-xl font-black italic uppercase tracking-[0.15em] bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300 disabled:grayscale text-xs"
        >
          {isProcessing ? 'Processing...' : 'Proceed'}{' '}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
