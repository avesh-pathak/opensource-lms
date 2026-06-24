'use client'

import React from 'react'
import Link from 'next/link'
import { Mentor } from '@/lib/types/mentor'
import { Star, Briefcase, Globe, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

export const MentorCard = React.memo(function MentorCard({
  mentor,
  sessionType = '1-1',
}: {
  mentor: Mentor
  sessionType?: '1-1' | 'sos' | 'roast' | 'consult'
}) {
  return (
    <div className="group relative flex flex-col p-6 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl hover:border-primary/50 hover:bg-card/60 overflow-hidden transition-all duration-300">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-6 -mt-6 group-hover:bg-primary/10 transition-colors pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-tr-full -ml-6 -mb-6 group-hover:bg-primary/10 transition-colors pointer-events-none z-0" />

      <div className="flex items-start justify-between mb-5 relative z-10">
        <div className="flex gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-muted overflow-hidden border-2 border-background shadow-sm">
              <Image
                src={mentor.image}
                alt={mentor.name}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 bg-background p-0.5 rounded-lg border shadow-sm">
              <div
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-yellow-500/10"
                aria-label={`Rating: ${mentor.rating} stars`}
              >
                <Star
                  className="w-3 h-3 fill-yellow-500 text-yellow-500"
                  aria-hidden="true"
                />
                <span className="text-[10px] font-semibold text-yellow-600">
                  {mentor.rating}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold">{mentor.name}</h3>
              {mentor.linkedinUrl && (
                <Link
                  href={mentor.linkedinUrl}
                  target="_blank"
                  className="p-1.5 rounded-full bg-[#0077B5]/10 text-[#0077B5] hover:bg-[#0077B5]/20 transition-colors"
                  aria-label={`Visit ${mentor.name}'s LinkedIn profile`}
                >
                  <Linkedin
                    className="w-3.5 h-3.5 fill-current"
                    aria-hidden="true"
                  />
                </Link>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Briefcase className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                {mentor.title} at{' '}
                <span className="font-medium text-foreground">
                  {mentor.company}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/80">
              <Globe className="w-3 h-3" aria-hidden="true" />
              <span>{mentor.languages.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5 mb-6 relative z-10 flex-1">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {mentor.bio}
        </p>

        <div className="flex flex-wrap gap-2">
          {mentor.expertise.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="px-2.5 py-1 bg-muted/50 font-medium text-[10px] uppercase tracking-wide"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-baseline gap-3 pt-5 border-t relative z-10 mt-auto">
        {(() => {
          const getPriceRaw = () => {
            switch (sessionType) {
              case 'sos':
                return { price: 299, label: '/ session' }
              case 'roast':
                return { price: 199, label: '/ roast' }
              case 'consult':
                return { price: 149, label: '/ 15m' }
              default:
                return { price: mentor.hourlyRate, label: '/ hour' }
            }
          }
          const { price, label } = getPriceRaw()
          return (
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-lg text-foreground">
                  ₹{price}
                </span>
                <span className="text-muted-foreground text-[10px] uppercase tracking-wide opacity-80">
                  {label}
                </span>
              </div>
            </div>
          )
        })()}

        <div className="ml-auto">
          <Link href={`/dashboard/mentorship/${mentor.id}?type=${sessionType}`}>
            <Button className="rounded-xl px-5 font-medium text-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm shadow-primary/20 active:scale-[0.97] transition-all">
              Book Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
})
