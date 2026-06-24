import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
export type TrieAlgorithmType =
  | 'TRIE_INSERT'
  | 'TRIE_SEARCH'
  | 'TRIE_PREFIX'
  | 'TRIE_DELETE'
export interface TrieFrame {
  nodes: { id: string; char: string; isEnd: boolean; x: number; y: number }[]
  edges: { from: string; to: string; label: string }[]
  explanation: string
  activeLine: number
  highlights: string[]
}
interface TrieState {
  algorithm: TrieAlgorithmType
  isPlaying: boolean
  currentFrame: number
  playbackSpeed: number
  frames: TrieFrame[]
  words: string[]
  currentWord: string
  setAlgorithm: (a: TrieAlgorithmType) => void
  setCurrentFrame: (f: number) => void
  togglePlay: () => void
  setSpeed: (s: number) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
  generateInput: () => void
  setWords: (w: string[]) => void
  setCurrentWord: (w: string) => void
  runOperation: () => void
}
function buildTrieFramesInsert(word: string): TrieFrame[] {
  const frames: TrieFrame[] = []
  const nodes: TrieFrame['nodes'] = [
    { id: 'root', char: '★', isEnd: false, x: 0, y: 0 },
  ]
  const edges: TrieFrame['edges'] = []
  const x = 80
  const y = 60
  frames.push({
    nodes: [...nodes],
    edges: [...edges],
    explanation: `Start insert: "${word}".`,
    activeLine: 1,
    highlights: ['root'],
  })
  let prefix = ''
  let parentId = 'root'
  for (let i = 0; i < word.length; i++) {
    const ch = word[i]
    prefix += ch
    const nodeId = `n-${prefix}`
    const isEnd = i === word.length - 1
    nodes.push({ id: nodeId, char: ch, isEnd, x: x + i * 70, y: y + i * 50 })
    edges.push({ from: parentId, to: nodeId, label: ch })
    parentId = nodeId
    frames.push({
      nodes: nodes.map((n) => ({ ...n })),
      edges: [...edges],
      explanation: isEnd
        ? `Added "${ch}", mark end of word.`
        : `Added "${ch}" for prefix "${prefix}".`,
      activeLine: 2,
      highlights: [nodeId],
    })
  }
  return frames
}
export const useTrieStore = create<TrieState>((set, get) => ({
  algorithm: 'TRIE_INSERT',
  isPlaying: false,
  currentFrame: 0,
  playbackSpeed: 1,
  frames: [],
  words: ['tea', 'ten', 'to', 'in', 'inn'],
  currentWord: 'tea',
  setAlgorithm: (algorithm) => {
    set({ algorithm, currentFrame: 0, isPlaying: false })
    get().generateInput()
  },
  setCurrentFrame: (f) => {
    const { frames } = get()
    if (f >= 0 && f < frames.length) set({ currentFrame: f })
  },
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setSpeed: (playbackSpeed) => set({ playbackSpeed }),
  nextStep: () => {
    const { currentFrame, frames } = get()
    if (currentFrame < frames.length - 1)
      set({ currentFrame: currentFrame + 1 })
    else set({ isPlaying: false })
  },
  prevStep: () => {
    const { currentFrame } = get()
    if (currentFrame > 0) set({ currentFrame: currentFrame - 1 })
  },
  reset: () => set({ currentFrame: 0, isPlaying: false }),
  generateInput: () => {
    set({ frames: [], currentFrame: 0 })
  },
  setWords: (words) => set({ words }),
  setCurrentWord: (currentWord) => set({ currentWord }),
  runOperation: () => {
    const { algorithm, currentWord } = get()
    if (algorithm === 'TRIE_INSERT' && currentWord) {
      const frames = buildTrieFramesInsert(currentWord)
      set({ frames, currentFrame: 0, isPlaying: false })
    } else {
      set({ frames: [], currentFrame: 0 })
    }
  },
}))
export { useShallow }
