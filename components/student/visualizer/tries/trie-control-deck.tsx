'use client'

import { useTrieStore } from '@/lib/store/trie-visualizer-store'
import { usePlaybackControls } from '@/hooks/use-playback-controls'
import { PlaybackControls } from '@/components/student/visualizer/shared/playback-controls'

export function TrieControlDeck() {
  const store = useTrieStore()
  const props = usePlaybackControls(
    {
      ...store,
      frames: store.frames,
      prevStep: store.prevStep,
      setSpeed: store.setSpeed,
    },
    { accentColor: 'lime', showFrameScrubber: true }
  )
  return <PlaybackControls {...props} />
}
