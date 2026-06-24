import type { Metadata, Viewport } from 'next'

import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { ProblemsProvider } from '@/components/learning/problems-provider'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/lib/auth-context'
import { UserStateProvider } from '@/lib/user-state'
import { ResponsiveScaleProvider } from '@/components/layout/responsive-scale-provider'
import { PageViewTracker } from '@/components/layout/page-view-tracker'
import { SmoothScrollProvider } from '@/components/providers/smooth-scroll-provider'

import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

export const metadata: Metadata = {
  metadataBase: new URL('https://aveshpathaklms.vercel.app'),
  title: {
    default: 'Babua DSA - The Elite Registry for Engineering Mastery',
    // title="Babua DSA"
    template: '%s | Babua DSA',
  },
  description:
    'Master system design, distributed protocols, and algorithms. No courses, just proof of work. Join the elite registry of engineers.',
  keywords: [
    'Babua DSA',
    'System Design',
    'Distributed Systems',
    'Engineering Mastery',
    'Coding Interview',
    'LMS',
    'Computer Science',
  ],
  authors: [{ name: 'Avesh Pathak' }],
  creator: 'Avesh Pathak',
  publisher: 'Babua Hub',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aveshpathaklms.vercel.app',
    siteName: 'Babua DSA',
    title: 'Babua DSA - Master Engineering',
    description:
      'The elite registry for engineering mastery. No courses, just proof of work.',
    images: [
      {
        url: '/og-image.png', // Ensure this image exists
        width: 1200,
        height: 630,
        alt: 'Babua DSA Platform Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Babua DSA - Master Engineering',
    description:
      'The elite registry for engineering mastery. No courses, just proof of work.',
    images: ['/og-image.png'],
    creator: '@aveshpathak',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/icon.svg',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FB923C' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1A1A' },
  ],
}

import JsonLd, { ORGANIZATION_JSON_LD } from '@/components/layout/json-ld'

const EMPTY_PROBLEMS: any[] = []

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Resource Hints for Third-Party Performance */}
        <link rel="dns-prefetch" href="https://vercel.live" />
        <link
          rel="preconnect"
          href="https://vercel.live"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-background text-foreground border rounded-md shadow-lg"
        >
          Skip to main content
        </a>
        <JsonLd data={ORGANIZATION_JSON_LD} />
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(){try{var e=localStorage.getItem("theme");"dark"===e?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark")}catch(e){}}();`,
          }}
        />

        <AuthProvider>
          <UserStateProvider>
            <ResponsiveScaleProvider>
              <ProblemsProvider initialProblems={EMPTY_PROBLEMS}>
                <SmoothScrollProvider>
                  {children}
                  <Toaster position="top-center" />
                </SmoothScrollProvider>
              </ProblemsProvider>
            </ResponsiveScaleProvider>
          </UserStateProvider>
        </AuthProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Babua DSA',
              url: 'https://aveshpathaklms.vercel.app/',
              potentialAction: {
                '@type': 'SearchAction',
                target:
                  'https://aveshpathaklms.vercel.app/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <Analytics />
        <SpeedInsights />
        <PageViewTracker />
      </body>
    </html>
  )
}
