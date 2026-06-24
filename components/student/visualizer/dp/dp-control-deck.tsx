'use client'

import { useDPStore } from '@/lib/store/dp-visualizer-store'
import { usePlaybackControls } from '@/hooks/use-playback-controls'
import { PlaybackControls } from '@/components/student/visualizer/shared/playback-controls'

export function DPControlDeck() {
  const store = useDPStore()
  const props = usePlaybackControls(store, {
    accentColor: 'violet',
    showFrameScrubber: true,
  })
  return <PlaybackControls {...props} />
}
