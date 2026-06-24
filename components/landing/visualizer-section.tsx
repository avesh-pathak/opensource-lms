'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import dynamic from 'next/dynamic'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const LiveSortingMockup = dynamic(
  () => import('./live-sorting-mockup').then((mod) => mod.LiveSortingMockup),
  { ssr: false }
)

export function VisualizerSection() {
  const containerRef = useRef<HTMLElement>(null)
  const shouldReduceMotion = useReducedMotion()

  useGSAP(
    () => {
      if (!containerRef.current) return
      if (shouldReduceMotion) return

      // Simple fade-in on scroll (no parallax scrub)
      gsap.fromTo(
        '.vis-text-block',
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
        '.vis-card-parallax',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
          scrollTrigger: {
            trigger: '.vis-card-parallax',
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
      className="py-32 bg-background border-b relative overflow-hidden"
    >
      <div className="hidden md:block absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full -z-10 opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="vis-text-block opacity-0 space-y-8 transform-gpu">
          <Badge
            variant="outline"
            className="py-2 px-6 rounded-full border-indigo-500/50 text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest bg-indigo-500/10 backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.3)] w-fit"
          >
            New Feature
          </Badge>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] italic">
            FEEL THE <span className="text-indigo-600 italic">DATA</span> <br />
            UNDERSTAND THE{' '}
            <span className="text-indigo-600 italic underline decoration-4 decoration-indigo-400 underline-offset-8">
              LOGIC
            </span>
          </h2>
          <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-xl">
            Stop memorizing code. Watch algorithms come to life with our
            interactive visualizer.
          </p>
          <Link href="/visualizer">
            <Button
              size="lg"
              className="h-16 px-10 rounded-full text-xl font-black uppercase tracking-tight shadow-2xl shadow-indigo-500/20 bg-indigo-600 text-white hover:bg-indigo-700 border-none transition-transform active:scale-95"
            >
              Try Visualizer
            </Button>
          </Link>
        </div>

        <div className="vis-card-parallax opacity-0 relative rounded-[40px] border bg-muted/30 p-2 overflow-hidden shadow-2xl group transform-gpu">
          <div className="aspect-video rounded-[32px] bg-black relative flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-indigo-500/30 transition-colors shadow-2xl">
            <LiveSortingMockup />
          </div>
        </div>
      </div>
    </section>
  )
}
