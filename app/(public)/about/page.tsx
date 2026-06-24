import React from 'react'
import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import { ShieldCheck, Cpu, Code2, Users, ArrowRight } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        {/* Hero / Headline Section */}
        <section className="max-w-4xl mx-auto px-6 mb-24 md:mb-32">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ShieldCheck className="w-3 h-3" />
            <span>The Registry</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-foreground mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            We don&apos;t sell{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">
              Certificates.
            </span>{' '}
            <br />
            We build{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">
              Engineers.
            </span>
          </h1>

          <p className="text-xl md:text-2xl font-medium text-muted-foreground leading-relaxed max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            The tech industry is drowning in tutorials, bootcamps, and hollow
            credentials. Babua DSA is the antidote. We represent the return to
            first principles, deep intuition, and undeniable proof of work.
          </p>
        </section>

        {/* The Manifesto */}
        <section className="bg-muted/30 py-24 md:py-32 border-y border-border/50">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground mb-12 flex items-center gap-4">
              <span className="w-8 h-[1px] bg-primary"></span>
              Our Philosophy
            </h2>

            <div className="grid gap-16 md:grid-cols-2">
              <div className="space-y-4">
                <Code2 className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                  Code &gt; Content
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We don&apos;t believe in passive watching. You can watch 100
                  hours of videos and still fail a whiteboard interview. Here,
                  you build. You solve. You fail. You debug. That is the only
                  path to mastery.
                </p>
              </div>

              <div className="space-y-4">
                <Cpu className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                  Depth &gt; Breadth
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Memorizing 500 LeetCode solutions is useless if you don&apos;t
                  understand the underlying patterns. We focus on the core
                  engineering patterns that govern 99% of interviews and
                  real-world systems.
                </p>
              </div>

              <div className="space-y-4">
                <ShieldCheck className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                  Proof &gt; Promises
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your profile here isn&apos;t just a list of completed
                  checkboxes. It&apos;s a verifiable audit log of your
                  engineering journey. When you share a Babua profile, you share
                  proof of competence.
                </p>
              </div>

              <div className="space-y-4">
                <Users className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                  Elite, Not Elitist
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Access to high-quality system design and deeply technical
                  mentorship should not be gatekept by $4000 bootcamps. This
                  registry is open to anyone willing to put in the work.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Who is this for? */}
        <section className="max-w-4xl mx-auto px-6 py-24 md:py-32">
          <div className="space-y-2 mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">
              Who Belongs Here?
            </h2>
            <div className="h-1 w-24 bg-primary rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 ">
            <div className="p-8 rounded-[32px] border bg-card hover:border-primary/50 transition-all duration-300 group">
              <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">
                🏗️
              </div>
              <h3 className="font-bold text-lg mb-2">The Builder</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                You&apos;re tired of &quot;Hello World&quot; tutorials. You want
                to understand how distributed locks work, not just how to use
                them.
              </p>
            </div>
            <div className="p-8 rounded-[32px] border bg-card hover:border-primary/50 transition-all duration-300 group">
              <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">
                🦅
              </div>
              <h3 className="font-bold text-lg mb-2">The Ambitious</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                You&apos;re aiming for high-bar roles. Standard prep isn&apos;t
                cutting it. You need the edge that comes from deep
                understanding.
              </p>
            </div>
            <div className="p-8 rounded-[32px] border bg-card hover:border-primary/50 transition-all duration-300 group">
              <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">
                🔄
              </div>
              <h3 className="font-bold text-lg mb-2">The Pivoter</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                You&apos;re shifting from a non-tech role or a generic dev role.
                You need to speedrun 4 years of CS fundamentals.
              </p>
            </div>
          </div>
        </section>

        {/* Closing / Founder Note style */}
        <section className="border-t border-border/50 bg-background">
          <div className="max-w-3xl mx-auto px-6 py-24 text-center space-y-8">
            <p className="text-xl md:text-2xl font-medium text-foreground italic leading-relaxed">
              &quot;We built this because we were tired of seeing brilliant
              minds get rejected because they lacked structure. Babua DSA is the
              structure I wish I had.&quot;
            </p>
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center border border-border">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <div className="font-black uppercase tracking-widest text-sm">
                  Avesh Pathak
                </div>
                <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                  Founder
                </div>
              </div>
            </div>

            <div className="pt-8">
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-foreground text-background font-black uppercase tracking-widest hover:opacity-90 transition-opacity gap-2 group"
              >
                Enter The Registry
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
