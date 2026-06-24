'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Code2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

gsap.registerPlugin(useGSAP)

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  useGSAP(
    () => {
      if (!containerRef.current) return
      if (shouldReduceMotion) return

      const tl = gsap.timeline({
        defaults: { ease: 'cubic-bezier(0.23, 1, 0.32, 1)' },
      })

      // 1. Initial fade in for the badge
      tl.fromTo(
        '.hero-badge',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 }
      )

      // 2. Staggered reveal for headline words
      tl.fromTo(
        '.hero-text-mask span',
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
        '-=0.3'
      )

      // 3. Fade up paragraph
      tl.fromTo(
        '.hero-paragraph',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.4'
      )

      // 4. Stagger buttons
      tl.fromTo(
        '.hero-btn',
        { opacity: 0, scale: 0.95, y: 10 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
        },
        '-=0.4'
      )
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      className="relative pt-32 pb-20 overflow-hidden min-h-[600px]"
    >
      {/* Decorative Gradients - Optimized: Hidden on mobile for max performance */}
      <div className="hero-bg-glow hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-50" />

      <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
        <div className="hero-badge flex justify-center mb-6 opacity-0">
          <Badge
            variant="outline"
            className="py-2 px-6 rounded-full border-orange-500/20 bg-orange-500/5 text-orange-700 font-black uppercase tracking-[0.2em] text-sm dark:text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.4)] backdrop-blur-sm"
          >
            Babua DSA
          </Badge>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-[0.85] max-w-5xl mx-auto uppercase flex flex-col items-center justify-center gap-2">
          <span className="hero-text-mask overflow-hidden block pb-2">
            <span className="inline-block opacity-0">REAL ENGINEERING</span>
          </span>
          <span className="hero-text-mask overflow-hidden block pb-2">
            <span className="inline-block opacity-0">NOT JUST</span>
          </span>
          <span className="hero-text-mask overflow-hidden block pb-4">
            <span className="inline-block opacity-0 text-[#FB923C] italic underline decoration-2 md:decoration-4 underline-offset-4 md:underline-offset-8">
              CERTIFICATES
            </span>
          </span>
        </h1>

        <p className="hero-paragraph opacity-0 text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
          Master the core{' '}
          <span className="text-foreground font-bold">PATTERNS</span> of Data
          Structures, System Design, and Core Engineering. Practical, free, and
          community-driven education for the modern engineer.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <div className="hero-btn opacity-0 transition-transform active:scale-95">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="h-16 px-12 rounded-2xl bg-[#FB923C] hover:bg-[#FB923C]/90 text-black font-black uppercase tracking-tight shadow-2xl shadow-[#FB923C]/20 text-lg group border-none"
              >
                Start Building{' '}
                <ArrowRight
                  className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </Button>
            </Link>
          </div>
          <div className="hero-btn opacity-0 transition-transform active:scale-95">
            <Link href="/visualizer">
              <Button
                size="lg"
                className="h-16 px-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-tight shadow-2xl shadow-indigo-500/20 text-lg group border-none transition-[background-color]"
              >
                <Code2 className="mr-2 h-5 w-5 text-white" aria-hidden="true" />
                Try Visualizer
              </Button>
            </Link>
          </div>
          <div className="hero-btn opacity-0 transition-transform active:scale-95">
            <Link href="#paths">
              <Button
                size="lg"
                className="h-16 px-10 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-black text-xl font-bold border-none transition-[background-color] shadow-xl"
              >
                Explore All Paths
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
