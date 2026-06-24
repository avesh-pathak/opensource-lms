'use client'

import { useBitStore } from '@/lib/store/bit-visualizer-store'
import { usePlaybackControls } from '@/hooks/use-playback-controls'
import { PlaybackControls } from '@/components/student/visualizer/shared/playback-controls'

export function BitControlDeck() {
  const store = useBitStore()
  const props = usePlaybackControls(
    { ...store, frames: store.frames },
    { accentColor: 'sky', showFrameScrubber: true }
  )
  return <PlaybackControls {...props} />
}
