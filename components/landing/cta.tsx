'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function CTA() {
  const containerRef = useRef<HTMLElement>(null)
  const shouldReduceMotion = useReducedMotion()

  useGSAP(
    () => {
      if (!containerRef.current) return
      if (shouldReduceMotion) return

      gsap.fromTo(
        '.cta-content',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
          scrollTrigger: {
            trigger: containerRef.current,
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
      className="py-32 bg-[#FB923C] relative overflow-hidden text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
      <div className="cta-content opacity-0 max-w-7xl mx-auto px-6 text-center space-y-10 relative transform-gpu">
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none italic uppercase">
          READY TO BUILD <br />
          YOUR BLUEPRINT?
        </h2>
        <div className="flex justify-center">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-white text-orange-700 hover:bg-white/90 h-20 px-16 rounded-full text-2xl font-black uppercase tracking-tight shadow-[0_0_50px_rgba(255,255,255,0.3)] border-none transition-[background-color] active:scale-[0.97]"
            >
              Join the Hub
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
