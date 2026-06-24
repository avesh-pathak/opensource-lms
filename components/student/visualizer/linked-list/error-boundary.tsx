'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { useLinkedListStore } from '@/lib/store/linked-list-visualizer-store'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

// Wrapper to use the hook in class component
const ResetButton = () => {
  const reset = useLinkedListStore((state) => state.reset)
  const generateInput = useLinkedListStore((state) => state.generateInput)

  const handleReset = () => {
    localStorage.removeItem('linkedlist-visualizer-storage')
    reset()
    generateInput()
    window.location.reload()
  }

  return (
    <Button
      onClick={handleReset}
      className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
    >
      <RefreshCcw className="w-4 h-4" />
      Reset Visualization
    </Button>
  )
}

export class LinkedListErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] bg-red-50/50 dark:bg-red-900/10 rounded-xl border-2 border-dashed border-red-200 dark:border-red-800 p-8 text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <div className="max-w-md space-y-2">
            <h2 className="text-xl font-black text-red-700 dark:text-red-400">
              Something went wrong
            </h2>
            <p className="text-sm text-red-600/80 dark:text-red-400/80">
              The visualization crashed. This usually happens due to an invalid
              state or generic render error.
            </p>
            <div className="text-xs bg-white/50 dark:bg-black/20 p-2 rounded font-mono text-red-500 overflow-x-auto max-w-[300px] mx-auto">
              {this.state.error?.message}
            </div>
          </div>
          <div className="pt-4">
            <ResetButton />
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
