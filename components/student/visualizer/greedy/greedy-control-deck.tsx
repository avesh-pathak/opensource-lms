'use client'

import { useGreedyStore } from '@/lib/store/greedy-visualizer-store'
import { usePlaybackControls } from '@/hooks/use-playback-controls'
import { PlaybackControls } from '@/components/student/visualizer/shared/playback-controls'

export function GreedyControlDeck() {
  const store = useGreedyStore()
  const props = usePlaybackControls(
    { ...store, frames: store.frames },
    { accentColor: 'teal', showFrameScrubber: true }
  )
  return <PlaybackControls {...props} />
}
