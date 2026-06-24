'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Users, Linkedin, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function Mentorship() {
  const containerRef = useRef<HTMLElement>(null)
  const shouldReduceMotion = useReducedMotion()

  useGSAP(
    () => {
      if (!containerRef.current) return
      if (shouldReduceMotion) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          once: true,
          toggleActions: 'play none none none',
        },
      })

      tl.fromTo(
        '.mentorship-left',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
        }
      ).fromTo(
        '.mentorship-right',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
        },
        '-=0.4'
      )
    },
    { scope: containerRef }
  )

  return (
    <section
      id="mentor"
      ref={containerRef}
      className="py-24 relative overflow-hidden"
    >
      <div className="absolute -left-20 top-0 w-80 h-80 bg-orange-700/10 blur-[120px] rounded-full" />
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="mentorship-left opacity-0 space-y-8 transform-gpu">
          <Badge
            variant="outline"
            className="py-2 px-6 rounded-full border-orange-500/50 text-orange-600 dark:text-orange-400 font-black uppercase tracking-widest bg-orange-500/10 backdrop-blur-md shadow-[0_0_15px_rgba(251,146,60,0.3)] mb-4"
          >
            Sustainable Support
          </Badge>
          <h2 className="text-[13vw] md:text-8xl font-black tracking-tighter uppercase leading-[0.8] italic">
            OPTIONAL <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400 pr-4">
              MENTORSHIP
            </span>
          </h2>
          <p className="text-lg text-muted-foreground font-medium leading-relaxed">
            Everything is 100% free. We sustain the platform through optional,
            high-value human interactions.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-card border border-orange-700/20 shadow-xl shadow-orange-700/5 space-y-2 transition-transform duration-300 ease-out hover:-translate-y-1 [backface-visibility:hidden]">
              <MessageSquare className="h-6 w-6 text-orange-700" />
              <h3 className="font-black uppercase tracking-tight">
                Office Hours
              </h3>
              <p className="text-xs text-muted-foreground">
                Book 1-on-1 time for debug help.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-card border border-orange-700/20 shadow-xl shadow-orange-700/5 space-y-2 transition-transform duration-300 ease-out hover:-translate-y-1 [backface-visibility:hidden]">
              <Users className="h-6 w-6 text-orange-700" />
              <h3 className="font-black uppercase tracking-tight">
                Mock Interviews
              </h3>
              <p className="text-xs text-muted-foreground">
                Get grilled by top engineers.
              </p>
            </div>
          </div>
        </div>
        <div className="mentorship-right opacity-0 relative transform-gpu">
          <div className="rounded-[40px] border-8 border-orange-700/10 bg-card p-8 shadow-2xl relative">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-700/20 flex items-center justify-center">
                    <Users
                      className="h-5 w-5 text-orange-700"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-tight">
                      1:1 Mentorship
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Expert guidance from Top Engineers
                    </p>
                  </div>
                </div>
                <Badge className="bg-orange-100 text-orange-800 border-none hover:bg-orange-200 transition-colors">
                  ₹399/hr
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-dashed hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden shrink-0 aspect-square relative">
                    <Image
                      src="/assets/mentors/image.png"
                      alt="Vikram Singh - Senior Staff at Google"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 40px, 40px"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-tight">
                      Vikram Singh
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Senior Staff @ Google
                    </p>
                  </div>
                </div>
                <Link
                  href="https://www.linkedin.com/in/avesh-pathak/"
                  target="_blank"
                  className="p-1.5 rounded-full bg-[#0077B5]/10 text-[#0077B5]"
                  aria-label="Visit Vikram Singh's LinkedIn profile"
                >
                  <Linkedin
                    className="h-3 w-3 fill-current"
                    aria-hidden="true"
                  />
                </Link>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-dashed hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden shrink-0 aspect-square relative">
                    <Image
                      src="/assets/mentors/image2.png"
                      alt="Sarah Chen - Manager at Netflix"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 40px, 40px"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-tight">
                      Sarah Chen
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Manager @ Netflix
                    </p>
                  </div>
                </div>
                <Link
                  href="https://www.linkedin.com/in/avesh-pathak/"
                  target="_blank"
                  className="p-1.5 rounded-full bg-[#0077B5]/10 text-[#0077B5]"
                  aria-label="Visit Sarah Chen's LinkedIn profile"
                >
                  <Linkedin
                    className="h-3 w-3 fill-current"
                    aria-hidden="true"
                  />
                </Link>
              </div>
              <Link href="/dashboard/mentorship" className="block">
                <Button className="w-full h-14 rounded-2xl bg-[#FB923C] hover:bg-[#FB923C]/90 text-black font-black uppercase tracking-tight shadow-xl shadow-[#FB923C]/20 border-none transition-[background-color] active:scale-[0.97]">
                  Find Your Mentor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
