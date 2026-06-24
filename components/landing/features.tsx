'use client'

import React, { useRef } from 'react'
import { Zap, Layers, ShieldCheck } from 'lucide-react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function Features() {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  useGSAP(
    () => {
      if (!containerRef.current) return
      if (shouldReduceMotion) return

      const cards = gsap.utils.toArray('.feature-card')

      gsap.fromTo(
        cards,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
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
      className="py-24 border-y bg-muted/30 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Unified Hub Card */}
        <div className="feature-card opacity-0">
          <div className="group p-10 rounded-[40px] border bg-card hover:border-orange-700/50 transition-[transform,border-color] duration-300 ease-out hover:-translate-y-1 relative overflow-hidden shadow-sm h-full [backface-visibility:hidden]">
            <div className="absolute top-0 right-0 p-8 opacity-5 transition-opacity duration-300 group-hover:opacity-[0.12] pointer-events-none">
              <Zap className="h-24 w-24 text-orange-700" aria-hidden="true" />
            </div>
            <div className="space-y-4 relative">
              <div className="w-14 h-14 rounded-3xl bg-orange-700/10 flex items-center justify-center text-orange-700 border border-orange-700/20">
                <Zap className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="text-3xl font-black tracking-tight uppercase italic">
                Unified Hub
              </h3>
              <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                One dashboard for all engineering growth. Track every domain
                without friction.
              </p>
            </div>
          </div>
        </div>

        {/* Pattern First Card */}
        <div className="feature-card opacity-0">
          <div className="group p-10 rounded-[40px] border bg-card hover:border-emerald-500/50 transition-[transform,border-color] duration-300 ease-out hover:-translate-y-1 relative overflow-hidden shadow-sm h-full [backface-visibility:hidden]">
            <div className="absolute top-0 right-0 p-8 opacity-5 transition-opacity duration-300 group-hover:opacity-[0.12] pointer-events-none">
              <Layers
                className="h-24 w-24 text-emerald-500"
                aria-hidden="true"
              />
            </div>
            <div className="space-y-4 relative">
              <div className="w-14 h-14 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                <Layers className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="text-3xl font-black tracking-tight uppercase italic">
                Pattern First
              </h3>
              <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                Master the logic, not the solution. Our pattern-based approach
                builds real intuition.
              </p>
            </div>
          </div>
        </div>

        {/* No Certificates Card */}
        <div className="feature-card opacity-0">
          <div className="group p-10 rounded-[40px] border bg-card hover:border-indigo-500/50 transition-[transform,border-color] duration-300 ease-out hover:-translate-y-1 relative overflow-hidden shadow-sm h-full [backface-visibility:hidden]">
            <div className="absolute top-0 right-0 p-8 opacity-5 transition-opacity duration-300 group-hover:opacity-[0.12] pointer-events-none">
              <ShieldCheck
                className="h-24 w-24 text-indigo-500"
                aria-hidden="true"
              />
            </div>
            <div className="space-y-4 relative">
              <div className="w-14 h-14 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                <ShieldCheck className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="text-3xl font-black tracking-tight uppercase italic">
                No Certificates
              </h3>
              <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                We log your Proof of Work. Build a public profile that top
                recruiters actually trust.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
