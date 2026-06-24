'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Linkedin,
  Menu,
  Zap,
  Layers,
  Users,
  FileSpreadsheet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { UserProfileMenu } from '@/components/auth/user-profile-menu'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

gsap.registerPlugin(useGSAP)

export function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const shouldReduceMotion = useReducedMotion()

  useGSAP(
    () => {
      if (!navRef.current) return
      if (shouldReduceMotion) return
      gsap.fromTo(
        navRef.current,
        { y: -100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
          delay: 0.2,
        }
      )
    },
    { scope: navRef }
  )

  return (
    <nav
      ref={navRef}
      className="fixed top-0 w-full z-50 border-b bg-background md:bg-background/80 md:backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-[#FB923C] flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase">
            Babua DSA
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-white">
          <Link
            href="/dashboard/hackathons"
            className="hover:text-[#FB923C] transition-colors"
          >
            Hackathons
          </Link>
          <Link
            href="/dashboard"
            className="hover:text-[#FB923C] transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/custom-sheet"
            className="hover:text-[#FB923C] transition-colors"
          >
            Custom Sheet
          </Link>
          <Link
            href="#mentor"
            className="hover:text-[#FB923C] transition-colors"
          >
            Mentorship
          </Link>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <a
            href="https://www.linkedin.com/in/avesh-pathak/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex h-8 w-8 md:h-10 md:w-10 rounded-xl md:rounded-2xl border-2 items-center justify-center transition-[background-color,border-color] hover:bg-muted hover:border-primary dark:bg-muted/20 dark:border-muted-foreground dark:hover:border-primary dark:hover:bg-muted/40"
            aria-label="Visit Avesh Pathak's LinkedIn profile"
          >
            <Linkedin
              className="h-4 w-4 md:h-5 md:w-5 text-[#0077B5]"
              aria-hidden="true"
            />
          </a>
          <div className="hidden md:block scale-90 md:scale-100 origin-center">
            <ThemeToggle />
          </div>
          <UserProfileMenu />

          {/* Mobile Menu - Moved to Right */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 -mr-2"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-6 pt-16">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-[#FB923C] flex items-center justify-center shadow-lg shadow-orange-500/20">
                      <ShieldCheck
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </div>
                    <span className="font-black text-2xl tracking-tighter uppercase">
                      Babua DSA
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 text-lg font-bold uppercase tracking-widest text-muted-foreground">
                    <Link
                      href="/dashboard/hackathons"
                      className="hover:text-[#FB923C] hover:bg-orange-50 dark:hover:bg-orange-950/30 px-4 py-3 rounded-xl transition-[background-color,color] flex items-center gap-3"
                    >
                      <Zap className="h-5 w-5" /> Hackathons
                    </Link>
                    <Link
                      href="/dashboard"
                      className="hover:text-[#FB923C] hover:bg-orange-50 dark:hover:bg-orange-950/30 px-4 py-3 rounded-xl transition-[background-color,color] flex items-center gap-3"
                    >
                      <Layers className="h-5 w-5" /> Dashboard
                    </Link>
                    <Link
                      href="/dashboard/custom-sheet"
                      className="hover:text-[#FB923C] hover:bg-orange-50 dark:hover:bg-orange-950/30 px-4 py-3 rounded-xl transition-[background-color,color] flex items-center gap-3"
                    >
                      <FileSpreadsheet className="h-5 w-5" /> Custom Sheet
                    </Link>
                    <Link
                      href="#mentor"
                      className="hover:text-[#FB923C] hover:bg-orange-50 dark:hover:bg-orange-950/30 px-4 py-3 rounded-xl transition-[background-color,color] flex items-center gap-3"
                    >
                      <Users className="h-5 w-5" /> Mentorship
                    </Link>
                  </div>

                  <div className="mt-auto pt-8 border-t space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <span className="font-bold text-sm text-muted-foreground uppercase tracking-widest">
                        Theme
                      </span>
                      <ThemeToggle />
                    </div>
                    <a
                      href="https://www.linkedin.com/in/avesh-pathak/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-[background-color,color] font-bold text-muted-foreground hover:text-[#0077B5]"
                    >
                      <Linkedin className="h-5 w-5" />
                      <span>Connect on LinkedIn</span>
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
