import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { AuthRedirectHandler } from '@/components/landing/auth-redirect'
import { Navbar } from '@/components/landing/navbar'
import { Hero } from '@/components/landing/hero'

// Lazy load below-the-fold sections to reduce Initial Bundle & TBT
const VisualizerSection = dynamic(() =>
  import('@/components/landing/visualizer-section').then(
    (mod) => mod.VisualizerSection
  )
)
const EngineeringPaths = dynamic(() =>
  import('@/components/landing/engineering-paths').then(
    (mod) => mod.EngineeringPaths
  )
)
const Features = dynamic(() =>
  import('@/components/landing/features').then((mod) => mod.Features)
)
const ProofOfWork = dynamic(() =>
  import('@/components/landing/proof-of-work').then((mod) => mod.ProofOfWork)
)
const Mentorship = dynamic(() =>
  import('@/components/landing/mentorship').then((mod) => mod.Mentorship)
)
const FAQ = dynamic(() =>
  import('@/components/landing/faq').then((mod) => mod.FAQ)
)
const CTA = dynamic(() =>
  import('@/components/landing/cta').then((mod) => mod.CTA)
)
const Footer = dynamic(() =>
  import('@/components/landing/footer').then((mod) => mod.Footer)
)

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/80 via-background to-background dark:from-orange-950/20 dark:via-background dark:to-background text-foreground selection:bg-primary/20 flex flex-col">
      <Suspense fallback={null}>
        <AuthRedirectHandler />
      </Suspense>
      <Navbar />

      <main id="main-content" className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'Is this course really free?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, 100% free. We believe education should be accessible to everyone.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How does the Proof of Work registry work?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'You solve problems, build projects, and your work is verified and logged on your public profile.',
                  },
                },
              ],
            }),
          }}
        />
        <Hero />
        <VisualizerSection />
        <EngineeringPaths />
        <Features />
        <ProofOfWork />
        <Mentorship />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
