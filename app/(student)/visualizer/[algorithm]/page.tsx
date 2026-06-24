'use client'

import Link from 'next/link'
import { ArrowLeft, Bell, Sparkles } from 'lucide-react'
import { useParams } from 'next/navigation'
import { ALGORITHMS } from '@/lib/visualizer-data'

export default function AlgorithmPlaceholder() {
  const params = useParams()
  const slug = params.algorithm as string
  const algo = ALGORITHMS.find((a) => a.slug === slug)

  return (
    <div className="min-h-screen bg-[#FDFDF9] dark:bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-lg w-full">
        {/* Back Button */}
        <Link
          href="/visualizer"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 mb-12 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Laboratory
        </Link>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-12 shadow-2xl shadow-orange-500/5">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-orange-50 dark:bg-orange-950/30 text-orange-600 mb-8">
            <Sparkles className="w-10 h-10" />
          </div>

          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase mb-4">
            {algo?.title || 'ALGORITHM'} <br />
            <span className="text-orange-600">COMING SOON</span>
          </h1>

          <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-12 leading-relaxed">
            We&apos;re currently building the most immersive visualization for{' '}
            {algo?.title.toLowerCase() || 'this algorithm'}. Be the first to
            know when it&apos;s ready for experimentation.
          </p>

          <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg shadow-orange-600/20">
            <Bell className="w-5 h-5" />
            Notify Me on Launch
          </button>
        </div>

        {/* Footer Quote */}
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600">
          Precision in every byte • Babua Hub
        </p>
      </div>
    </div>
  )
}
