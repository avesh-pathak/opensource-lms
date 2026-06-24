'use client'

import { useGraphStore } from '@/lib/store/graph-visualizer-store'
import { usePlaybackControls } from '@/hooks/use-playback-controls'
import { PlaybackControls } from '@/components/student/visualizer/shared/playback-controls'

export function GraphControlDeck() {
  const store = useGraphStore()
  const props = usePlaybackControls(store, {
    accentColor: 'fuchsia',
    showFrameScrubber: true,
  })
  return <PlaybackControls {...props} />
}
