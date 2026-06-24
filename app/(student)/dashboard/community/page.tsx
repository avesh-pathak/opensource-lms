'use client'

import React from 'react'
import {
  Users,
  Flame,
  BookOpen,
  MessageSquare,
  Newspaper,
  Zap,
  ArrowRight,
  ShieldCheck,
  Star,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUserState } from '@/lib/user-state'

export default function CommunityPage() {
  const router = useRouter()
  const { state, updateSession } = useUserState()
  const [count, setCount] = React.useState(1240)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + Math.floor(Math.random() * 2))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const [communities, setCommunities] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  // Map string icon names to Lucide components
  const iconMap: any = {
    Flame,
    BookOpen,
    MessageSquare,
    Newspaper,
    Zap,
  }

  const fetchCommunities = async () => {
    try {
      const res = await fetch('/api/communities')
      const data = await res.json()
      if (Array.isArray(data)) {
        setCommunities(data)
      }
    } catch (_error) {
      toast.error('Failed to load community hubs')
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchCommunities()
  }, [])

  const unlockedHubs = state?.session?.unlockedHubs || []

  // Merge DB data with user state
  const sections = communities.map((c) => ({
    ...c,
    id: c.slug, // Use slug as ID for compatibility
    title: c.name,
    desc: c.description,
    icon: iconMap[c.icon] || Zap, // Fallback icon
    href: `/dashboard/community/${c.slug === 'the-roast' ? '../roast' : c.slug}`, // Maintain route for Roast for now or refactor route
    // Fix: Route specifically for 'the-roast' currently goes to /dashboard/roast
    // Other routes might not exist yet, so we need to handle them.
    // For this refactor, let's point 'the-roast' to existing page.
    // And others to a generic DynamicCommunityPage (to be built) or keep placeholders.
    // Actually, the user asked to "Remove student-side hardcoding"

    status: c.status,
    color: c.themeColor,
    notified: unlockedHubs.includes(c.slug),
    displayStatus:
      c.status === 'active'
        ? 'Active'
        : unlockedHubs.includes(c.slug)
          ? 'Authorized'
          : 'Inactive',
  }))

  // Adjust href logic
  const getHref = (slug: string) => {
    if (slug === 'the-roast') return '/dashboard/roast'
    return `/dashboard/community/${slug}` // Future route
  }

  const handleNotify = async (id: string, title: string) => {
    const newUnlockedHubs = [...unlockedHubs, id]
    await updateSession({ unlockedHubs: newUnlockedHubs })
    toast.success(`${title} Unlocked!`, {
      description: 'You have been authorized to enter this hub early.',
    })
  }

  const hubsRef = React.useRef<HTMLDivElement>(null)

  return (
    <div className="p-6 lg:p-10 space-y-12 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative group p-10 lg:p-12 rounded-[32px] overflow-hidden bg-card border shadow-xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-3xl">
          <Badge className="bg-primary/10 text-primary border-primary/20 font-black uppercase text-[10px] px-4 py-1.5 h-auto">
            The Engine Room
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase italic leading-none">
            Community <br />{' '}
            <span className="text-primary truncate">Verified.</span>
          </h1>
          <p className="text-muted-foreground font-medium text-lg leading-relaxed">
            Where elite engineers collaborate, critique, and evolve. No noise,
            just collective growth.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              onClick={() =>
                hubsRef.current?.scrollIntoView({ behavior: 'smooth' })
              }
              className="h-12 px-6 rounded-xl bg-black text-white hover:bg-black/90 font-black uppercase tracking-tight shadow-lg shadow-black/10 text-xs"
            >
              Explore All Hubs
            </Button>
            <div className="flex items-center gap-2 px-5 h-12 rounded-xl border bg-card/50 transition-all hover:border-primary/30">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                +{count.toLocaleString()} Verified Engineers
              </span>
            </div>
            {sections.some((s) => s.notified) && (
              <Button
                variant="ghost"
                onClick={async () => {
                  await updateSession({ unlockedHubs: [] })
                }}
                className="h-12 px-6 rounded-xl text-muted-foreground hover:text-red-500 font-black uppercase tracking-tight text-[10px]"
              >
                <LogOut className="mr-2 h-3.5 w-3.5" /> Reset Access
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Hubs Grid */}
      <div ref={hubsRef} className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-black uppercase tracking-tight italic">
              Available Hubs
            </h2>
            <p className="text-muted-foreground font-medium uppercase tracking-widest text-[9px]">
              Select your area of contribution
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-64 rounded-[40px] bg-muted/20 animate-pulse border border-border/50"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section, i) => (
              <div
                key={section?.id || section?._id || i}
                onClick={() => {
                  if (section.displayStatus === 'Active' || section.notified) {
                    router.push(getHref(section.slug))
                  } else {
                    handleNotify(section.id, section.title)
                  }
                }}
                className={cn(
                  'group p-8 rounded-[40px] border bg-card/50 hover:border-primary/50 transition-all hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden cursor-pointer',
                  section.displayStatus === 'Inactive' &&
                    !section.notified &&
                    'opacity-90 grayscale-[0.2]',
                  section.notified &&
                    'border-emerald-500/30 bg-emerald-500/[0.02]'
                )}
              >
                <div className="absolute top-0 right-0 p-8">
                  <section.icon
                    className={cn(
                      'h-12 w-12 opacity-10 transition-transform group-hover:scale-110',
                      section.color.split(' ')[0]
                    )}
                  />
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className={cn('p-3 rounded-2xl', section.color)}>
                      <section.icon className="h-6 w-6" />
                    </div>
                    <Badge
                      className={cn(
                        'font-black uppercase text-[8px] px-3 py-1',
                        section.displayStatus === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : section.displayStatus === 'Authorized'
                            ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30'
                            : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {section.displayStatus === 'Active'
                        ? 'Active'
                        : section.displayStatus}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase tracking-tight italic">
                      {section.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-sm">
                      {section.desc}
                    </p>
                  </div>
                  <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                    {section.displayStatus === 'Active' || section.notified
                      ? 'Enter Hub'
                      : 'Request Access'}
                    <ArrowRight
                      className={cn(
                        'h-3 w-3 group-hover:translate-x-1 transition-transform',
                        section.notified && 'text-emerald-500'
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Community Values */}
      <div className="p-12 rounded-[48px] bg-muted/30 border border-dashed grid grid-cols-1 lg:grid-cols-3 gap-12">
        {[
          {
            title: 'Pure Engineering',
            desc: 'No memes, no fluff. Just pure technical value.',
            icon: Zap,
          },
          {
            title: 'No Ego',
            desc: 'We critique the code, not the person. Growth is the only goal.',
            icon: ShieldCheck,
          },
          {
            title: 'Verified Alpha',
            desc: 'Insights verified by top-tier engineering mentors.',
            icon: Star,
          },
        ].map((item, i) => (
          <div key={i} className="space-y-4">
            <div className="p-3 w-fit rounded-xl bg-background border shadow-sm">
              <item.icon className="h-5 w-5 text-primary" />
            </div>
            <h4 className="text-lg font-black uppercase tracking-tight">
              {item.title}
            </h4>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
