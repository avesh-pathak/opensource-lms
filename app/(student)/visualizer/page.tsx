import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ALGORITHMS } from '@/lib/visualizer-data'
import dynamic from 'next/dynamic'

const VisualizerCard = dynamic(
  () =>
    import('@/components/student/visualizer/visualizer-card').then(
      (mod) => mod.MemoizedVisualizerCard || mod.VisualizerCard
    ),
  { ssr: true }
)

export default function VisualizerPage() {
  return (
    <div className="min-h-screen bg-[#FDFDF9] dark:bg-zinc-950 p-6 md:p-12 transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="space-y-3 md:space-y-4">
          <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white sm:text-4xl md:text-5xl uppercase">
            <span className="text-orange-600 mr-2 md:mr-3">ALGORITHM</span>{' '}
            <span className="block sm:inline mt-1 sm:mt-0">LABORATORY</span>
          </h1>
          <p className="max-w-2xl text-base sm:text-lg md:text-xl font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Interactive visualizations to build intuition. See the pointers
            move, watch the stack grow, and truly understand the machine.
          </p>
        </div>
        {/* Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {ALGORITHMS.map((algo) => (
            <div key={algo.slug} className="h-full">
              <VisualizerCard {...algo} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
