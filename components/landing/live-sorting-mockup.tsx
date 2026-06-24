'use client'

import React, { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

const BAR_COLOR = '#6366f1'
const HIGHLIGHT_COLOR = '#FB923C'
const DONE_COLOR = '#A855F7'

export function LiveSortingMockup() {
  const containerRef = useRef<HTMLDivElement>(null)
  const barRefs = useRef<(HTMLDivElement | null)[]>([])
  const currentArrayRef = useRef<number[]>([])
  // eslint-disable-next-line react-hooks/refs
  const [initialArray, setInitialArray] = useState<number[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const arr = Array.from(
      { length: 12 },
      () => Math.floor(Math.random() * 80) + 20
    )
    currentArrayRef.current = [...arr]
    setInitialArray(arr)
  }, [])

  useGSAP(
    () => {
      if (!containerRef.current || initialArray.length === 0) return

      const bars = barRefs.current
      const arr = currentArrayRef.current
      const n = arr.length
      let prevHighlight: [number, number] = [-1, -1]

      const setHighlight = (indices: [number, number], color: string) => {
        indices.forEach((idx) => {
          const el = bars[idx]
          if (el)
            gsap.to(el, {
              backgroundColor: color,
              duration: 0.18,
              ease: 'power2.out',
            })
        })
      }

      const runBubbleSort = () => {
        let i = 0
        let j = 0

        const step = () => {
          // Clear previous highlight with GSAP (no React state)
          if (prevHighlight[0] >= 0) {
            setHighlight(prevHighlight, BAR_COLOR)
          }

          // Highlight current comparison
          prevHighlight = [j, j + 1]
          setHighlight(prevHighlight, HIGHLIGHT_COLOR)

          if (arr[j] > arr[j + 1]) {
            const v1 = arr[j]
            const v2 = arr[j + 1]
            arr[j] = v2
            arr[j + 1] = v1

            const el1 = bars[j]
            const el2 = bars[j + 1]
            if (el1 && el2) {
              gsap.to([el1, el2], {
                scaleY: 1.08,
                y: -4,
                duration: 0.12,
                ease: 'power2.out',
                yoyo: true,
                repeat: 1,
                onRepeat: () => {
                  gsap.set([el1, el2], { clearProps: 'transform' })
                },
              })
              gsap.to(el1, {
                height: `${v2}%`,
                duration: 0.35,
                ease: 'power2.inOut',
                overwrite: true,
              })
              gsap.to(el2, {
                height: `${v1}%`,
                duration: 0.35,
                ease: 'power2.inOut',
                overwrite: true,
              })
            }
          }

          j += 1
          if (j >= n - i - 1) {
            j = 0
            i += 1
          }

          if (i >= n - 1) {
            // Done: celebrate then reset
            gsap.to(bars, {
              backgroundColor: DONE_COLOR,
              duration: 0.25,
              stagger: 0.04,
              ease: 'power2.out',
            })
            gsap.delayedCall(0.5, () => {
              gsap.to(bars, {
                backgroundColor: BAR_COLOR,
                duration: 0.2,
              })
              const newArr = Array.from(
                { length: 12 },
                () => Math.floor(Math.random() * 80) + 20
              )
              currentArrayRef.current = newArr
              newArr.forEach((val, idx) => {
                const el = bars[idx]
                if (el) {
                  gsap.to(el, {
                    height: `${val}%`,
                    duration: 0.5,
                    ease: 'power2.inOut',
                    delay: idx * 0.02,
                  })
                }
              })
              gsap.delayedCall(1.2, runBubbleSort)
            })
            return
          }

          gsap.delayedCall(0.45, step)
        }

        gsap.delayedCall(0.3, step)
      }

      runBubbleSort()
    },
    { scope: containerRef, dependencies: [initialArray.length] }
  )

  if (initialArray.length === 0) {
    return (
      <div className="aspect-video w-full h-full bg-zinc-900/40 rounded-[32px] animate-pulse" />
    )
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden flex items-center justify-center bg-[#0a0a0a] rounded-[32px]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] rounded-[32px]" />

      <div className="flex items-end justify-center gap-2 h-48 w-full max-w-sm px-4">
        {initialArray.map((value, idx) => (
          <div
            key={idx}
            ref={(el) => {
              barRefs.current[idx] = el
            }}
            className="mock-bar w-full rounded-t-sm will-change-[height]"
            style={{
              height: `${value}%`,
              backgroundColor: BAR_COLOR,
              transformOrigin: 'bottom',
              boxShadow: '0 0 10px rgba(99, 102, 241, 0.2)',
            }}
          />
        ))}
      </div>

      <div className="absolute top-4 left-4 font-mono text-[10px] text-indigo-400/50 space-y-1">
        <div>if (arr[j] &gt; arr[j+1])</div>
        <div className="pl-4">swap(arr[j], arr[j+1])</div>
      </div>
    </div>
  )
}
