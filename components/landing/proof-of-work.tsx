'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ProofOfWorkStats } from '@/components/profile/proof-of-work-stats'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function ProofOfWork() {
  const containerRef = useRef<HTMLElement>(null)
  const shouldReduceMotion = useReducedMotion()

  useGSAP(
    () => {
      if (!containerRef.current) return
      if (shouldReduceMotion) return

      // Simple fade-in on scroll (no parallax scrub)
      gsap.fromTo(
        '.pow-text-block',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            once: true,
            toggleActions: 'play none none none',
          },
        }
      )

      gsap.fromTo(
        '.pow-card-parallax',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
          scrollTrigger: {
            trigger: '.pow-card-parallax',
            start: 'top 80%',
            once: true,
            toggleActions: 'play none none none',
          },
        }
      )
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      id="proof-of-work-detail"
      className="py-32 border-t relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="pow-card-parallax opacity-0 rounded-[40px] border bg-card p-1 relative overflow-hidden group shadow-2xl transform-gpu">
            <div className="bg-background rounded-[38px] p-8 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="font-black uppercase tracking-widest text-orange-800 dark:text-orange-400 text-sm italic">
                  Proof of Work Registry
                </h3>
                <div className="px-3 py-1 bg-orange-800/10 text-orange-800 dark:text-orange-400 rounded-full text-[10px] font-black tracking-tighter uppercase">
                  Verified Profile
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-3xl bg-muted overflow-hidden border-2 border-orange-800/20 shrink-0 aspect-square relative">
                    <Image
                      src="/assets/mentors/image.png"
                      alt="Avesh Pathak Profile"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 64px, 64px"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-lg leading-none">
                      Avesh Pathak
                    </div>
                    <div className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      SDE @ Google
                    </div>
                  </div>
                </div>

                <ProofOfWorkStats />
              </div>
            </div>
          </div>

          <div className="pow-text-block opacity-0 space-y-8 transform-gpu">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] italic">
              YOUR{' '}
              <span className="text-orange-800 dark:text-orange-400">WORK</span>{' '}
              <br />
              IS YOUR BADGE
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 font-medium leading-relaxed max-w-xl">
              We&apos;ve replaced useless certificates with a living, breathing
              **Proof of Work Registry**. Every problem solved is logged on your
              public profile.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1.5 w-4 h-4 rounded-full bg-orange-800 dark:bg-orange-400 flex-shrink-0" />
                <p className="font-bold">
                  Public URL to showcase growth to recruiters.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1.5 w-4 h-4 rounded-full bg-orange-800 dark:bg-orange-400 flex-shrink-0" />
                <p className="font-bold">
                  Skill-based badges that carry actual weight.
                </p>
              </div>
            </div>
            <Link href="/api/auth/google">
              <Button
                size="lg"
                className="h-16 px-10 rounded-full text-xl font-black uppercase tracking-tight shadow-2xl shadow-[#FB923C]/20 bg-[#FB923C] text-black hover:bg-[#FB923C]/90 border-none"
              >
                Create Your Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
