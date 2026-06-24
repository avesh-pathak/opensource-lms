'use client'

import React, { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function FAQ() {
  const containerRef = useRef<HTMLElement>(null)
  const shouldReduceMotion = useReducedMotion()

  useGSAP(
    () => {
      if (!containerRef.current) return
      if (shouldReduceMotion) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          once: true,
          toggleActions: 'play none none none',
        },
      })

      tl.fromTo(
        '.faq-header',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
        }
      ).fromTo(
        '.faq-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
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
      className="py-24 bg-background border-t overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-6">
        <div className="faq-header opacity-0 text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground font-medium">
            Everything you need to know about Babua DSA.
          </p>
        </div>
        <div className="space-y-8">
          {[
            {
              q: 'What is Babua DSA?',
              a: "The **Babua DSA** is a curated collection of **30+ high-impact patterns** and 200+ selected problems. It's designed to build intuition for competitive programming and technical interviews.",
            },
            {
              q: 'How is it different from other sheets?',
              a: 'Unlike traditional sheets that focus on rote memorization, **Babua DSA** focuses on **Mastering Patterns**. Once you understand the underlying pattern (like Two Pointers or Sliding Window), you can solve hundreds of similar problems effortlessly.',
            },
            {
              q: 'Is Babua DSA free?',
              a: 'Yes, **Babua DSA** and all its learning paths are 100% free. We follow a "Proof of Work" model where your progress is your certificate.',
            },
            {
              q: 'Can I use it for interview preparation?',
              a: 'Absolutely. **Babua DSA** covers patterns frequently asked in top-tier companies like Google, Meta, and Amazon.',
            },
          ].map((faq, idx) => (
            <div key={idx} className="faq-card opacity-0">
              <div className="p-8 rounded-[32px] border bg-card/50 transition-[box-shadow,border-color] duration-300 ease-out hover:shadow-md [backface-visibility:hidden]">
                <h3 className="text-xl font-black uppercase tracking-tight mb-4">
                  {faq.q}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
