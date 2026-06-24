'use client'

import { useBacktrackingStore } from '@/lib/store/backtracking-visualizer-store'
import { usePlaybackControls } from '@/hooks/use-playback-controls'
import { PlaybackControls } from '@/components/student/visualizer/shared/playback-controls'

export function BacktrackingControlDeck() {
  const store = useBacktrackingStore()
  const props = usePlaybackControls(
    { ...store, frames: store.frames },
    { accentColor: 'red', showFrameScrubber: true }
  )
  return <PlaybackControls {...props} />
}
