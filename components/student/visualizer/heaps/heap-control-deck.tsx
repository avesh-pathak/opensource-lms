'use client'

import { usePlaybackControls } from '@/hooks/use-playback-controls'
import { PlaybackControls } from '@/components/student/visualizer/shared/playback-controls'
import { useHeapStore } from '@/lib/store/heap-visualizer-store'

export function HeapControlDeck() {
  const store = useHeapStore()
  const props = usePlaybackControls(store, {
    accentColor: 'amber',
    showFrameScrubber: true,
  })
  return <PlaybackControls {...props} />
}
