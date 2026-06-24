'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { Code2, Layers, PencilRuler, Cpu, Zap, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function EngineeringPaths() {
  const containerRef = useRef<HTMLElement>(null)
  const shouldReduceMotion = useReducedMotion()

  useGSAP(
    () => {
      if (!containerRef.current) return
      if (shouldReduceMotion) return

      // 1. Heading Reveal
      gsap.fromTo(
        '.path-heading',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
          scrollTrigger: {
            trigger: '.path-heading',
            start: 'top 85%',
            once: true,
            toggleActions: 'play none none none',
          },
        }
      )

      // 2. Staggered Card Reveal
      const cards = gsap.utils.toArray('.path-card')
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
          scrollTrigger: {
            trigger: '.path-grid',
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
      id="paths"
      ref={containerRef}
      className="py-24 bg-background overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="path-heading items-center align-middle flex flex-col items-center text-center space-y-4 mb-20 opacity-0">
          <Badge
            variant="outline"
            className="py-2 px-6 rounded-full border-orange-500/20 bg-orange-500/5 text-orange-700 font-black uppercase tracking-[0.2em] text-xs dark:text-orange-400"
          >
            Babua DSA Curriculum
          </Badge>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
            ENGINEERING PATHS
          </h2>
          <div className="space-y-2 max-w-2xl mx-auto">
            <p className="text-gray-700 dark:text-gray-300 text-lg font-medium italic">
              &quot;Build systems, not just code. Master the architecture of the
              future.&quot;
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
              From binary to distributed systems, we cover the full stack of
              engineering wisdom.
            </p>
          </div>
        </div>

        <div className="path-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* DSA Path */}
          <div className="path-card opacity-0">
            <div className="group p-8 rounded-[40px] border bg-card hover:border-[#CA3500] transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 relative overflow-hidden hover:shadow-xl h-full [backface-visibility:hidden]">
              <div className="absolute top-0 right-0 p-6 opacity-10 transition-opacity duration-300 group-hover:opacity-20 pointer-events-none">
                <Code2
                  className="h-20 w-20 text-[#FB923C]"
                  aria-hidden="true"
                />
              </div>
              <div className="space-y-6 relative">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tight">
                    Babua DSA
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium italic underline decoration-[#FB923C]/30 underline-offset-4">
                    Sliding Window • Graphs • DP
                  </p>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  Master the intuition behind 20+ DSA patterns. Solve problems
                  by pattern, not by rote memorization.
                </p>
                <Link href="/dashboard" className="block w-full">
                  <Button
                    variant="outline"
                    className="w-full rounded-2xl group-hover:bg-[#FB923C] group-hover:text-black transition-[background-color,color] font-bold uppercase tracking-tight"
                  >
                    Start Training
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* System Design Path */}
          <div className="path-card opacity-0">
            <div className="group p-8 rounded-[40px] border bg-card hover:border-[#CA3500] transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 relative overflow-hidden hover:shadow-xl h-full [backface-visibility:hidden]">
              <div className="absolute top-0 right-0 p-6 opacity-10 transition-opacity duration-300 group-hover:opacity-20 pointer-events-none">
                <Layers
                  className="h-20 w-20 text-[#FB923C]"
                  aria-hidden="true"
                />
              </div>
              <div className="space-y-6 relative">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tight">
                    System Design
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium italic underline decoration-[#FB923C]/30 underline-offset-4">
                    Scalability • Caching • Queues
                  </p>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  From Load Balancers to Microservices. Learn how to architect
                  systems that scale to millions.
                </p>
                <Link href="/dashboard" className="block w-full">
                  <Button
                    variant="outline"
                    className="w-full rounded-2xl group-hover:bg-[#FB923C] group-hover:text-black transition-[background-color,color] font-bold uppercase tracking-tight"
                  >
                    Explore Systems
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* LLD Path */}
          <div className="path-card opacity-0">
            <div className="group p-8 rounded-[40px] border bg-card hover:border-[#CA3500] transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 relative overflow-hidden hover:shadow-xl h-full [backface-visibility:hidden]">
              <div className="absolute top-0 right-0 p-6 opacity-10 transition-opacity duration-300 group-hover:opacity-20 pointer-events-none">
                <PencilRuler
                  className="h-20 w-20 text-[#FB923C]"
                  aria-hidden="true"
                />
              </div>
              <div className="space-y-6 relative">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tight">
                    Low Level Design
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium italic underline decoration-[#FB923C]/30 underline-offset-4">
                    SOLID • Design Patterns • OOPS
                  </p>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  Write clean, maintainable, and extensible code. Master the
                  patterns that separate juniors from seniors.
                </p>
                <Link href="/dashboard" className="block w-full">
                  <Button
                    variant="outline"
                    className="w-full rounded-2xl group-hover:bg-[#FB923C] group-hover:text-black transition-[background-color,color] font-bold uppercase tracking-tight"
                  >
                    Master Design
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Core Engineering Path */}
          <div className="path-card opacity-0">
            <div className="group p-8 rounded-[40px] border bg-card hover:border-[#CA3500] transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 relative overflow-hidden hover:shadow-xl h-full [backface-visibility:hidden]">
              <div className="absolute top-0 right-0 p-6 opacity-10 transition-opacity duration-300 group-hover:opacity-20 pointer-events-none">
                <Cpu className="h-20 w-20 text-[#FB923C]" aria-hidden="true" />
              </div>
              <div className="space-y-6 relative">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tight">
                    Core Engineering
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium italic underline decoration-[#FB923C]/30 underline-offset-4">
                    OS • DBMS • Networks
                  </p>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  Under the hood. Understand how kernels work, how DBs index
                  data, and how packets flow.
                </p>
                <Link href="/dashboard" className="block w-full">
                  <Button
                    variant="outline"
                    className="w-full rounded-2xl group-hover:bg-[#FB923C] group-hover:text-black transition-[background-color,color] font-bold uppercase tracking-tight"
                  >
                    Build Core
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* AI / ML Path */}
          <div className="path-card opacity-0">
            <div className="group p-8 rounded-[40px] border bg-card hover:border-[#CA3500] transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 relative overflow-hidden hover:shadow-xl h-full [backface-visibility:hidden]">
              <div className="absolute top-0 right-0 p-6 opacity-10 transition-opacity duration-300 group-hover:opacity-20 pointer-events-none">
                <Zap className="h-20 w-20 text-[#FB923C]" aria-hidden="true" />
              </div>
              <div className="space-y-6 relative">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tight">
                    AI Fundamentals
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium italic underline decoration-[#FB923C]/30 underline-offset-4">
                    LLMs • Prompt Eng • Applied AI
                  </p>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  The practical guide to AI. Build and integrate intelligence
                  into your applications today.
                </p>
                <Link href="/dashboard?domain=AI/ML" className="block w-full">
                  <Button
                    variant="outline"
                    className="w-full rounded-2xl group-hover:bg-[#FB923C] group-hover:text-black transition-[background-color,color] font-bold uppercase tracking-tight"
                  >
                    Master AI
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Expert Mentorship Card */}
          <div className="path-card opacity-0">
            <div className="group p-8 rounded-[40px] border-2 border-dashed border-[#FB923C]/30 bg-[#FB923C]/5 hover:border-[#FB923C] transition-[transform,border-color] duration-300 ease-out hover:-translate-y-1 relative overflow-hidden shadow-sm h-full [backface-visibility:hidden]">
              <div className="absolute top-0 right-0 p-6 opacity-10 transition-opacity duration-300 group-hover:opacity-20 pointer-events-none">
                <Sparkles
                  className="h-20 w-20 text-[#FB923C]"
                  aria-hidden="true"
                />
              </div>
              <div className="space-y-6 relative">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tight">
                    Expert Mentorship
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium italic text-orange-700 dark:text-orange-400">
                    Premier 1:1 Support
                  </p>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  Stuck on a production bug or complex architecture? Connect
                  with top engineers for 1:1 rapid guidance.
                </p>
                <Link href="/dashboard/mentorship">
                  <Button
                    variant="outline"
                    className="w-full rounded-2xl border-orange-600 text-orange-700 hover:bg-[#FB923C] hover:text-black transition-[background-color,color] font-bold uppercase tracking-tight"
                  >
                    View Support Hub
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
