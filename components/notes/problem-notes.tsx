'use client'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { StickyNote, Code2, Lightbulb, Save } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useUserState } from '@/lib/user-state'

type ProblemNotesProps = {
  problemId: string
  initialNotes?: string
  initialSolution?: string
  initialApproach?: string
  onSave?: (
    problemId: string,
    data: { notes: string; solution: string; approach: string }
  ) => void
}

export function ProblemNotes({
  problemId,
  initialNotes = '',
  initialSolution = '',
  initialApproach = '',
  onSave,
}: ProblemNotesProps) {
  const { state, updateProblem, loading } = useUserState()
  const [notes, setNotes] = useState(initialNotes)
  const [solution, setSolution] = useState(initialSolution)
  const [approach, setApproach] = useState(initialApproach)
  const [hasChanges, setHasChanges] = useState(false)

  // Initialize from cloud state
  useEffect(() => {
    if (loading || !state) return
    const problemData = state.problems[problemId]
    if (problemData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNotes(problemData.notes || initialNotes)
      setSolution(problemData.solution || initialSolution)
      setApproach(problemData.approach || initialApproach)
    }
  }, [
    problemId,
    state,
    loading,
    initialNotes,
    initialSolution,
    initialApproach,
  ])

  const handleSave = async () => {
    await updateProblem(problemId, { notes, solution, approach })
    onSave?.(problemId, { notes, solution, approach })
    setHasChanges(false)
  }

  const handleNotesChange = (value: string) => {
    setNotes(value)
    setHasChanges(true)
  }

  const handleSolutionChange = (value: string) => {
    setSolution(value)
    setHasChanges(true)
  }

  const handleApproachChange = (value: string) => {
    setApproach(value)
    setHasChanges(true)
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="notes" className="w-full">
        <div className="flex items-center justify-between mb-3">
          <TabsList
            aria-label="Problem documentation tabs"
            className="bg-muted/30 p-1 h-11 rounded-xl"
          >
            <TabsTrigger
              value="notes"
              className="gap-2 h-9 rounded-lg font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-foreground data-[state=active]:text-background transition-all"
            >
              <StickyNote className="h-3.5 w-3.5" aria-hidden="true" />
              Notes
            </TabsTrigger>
            <TabsTrigger
              value="solution"
              className="gap-2 h-9 rounded-lg font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-foreground data-[state=active]:text-background transition-all"
            >
              <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
              Solution
            </TabsTrigger>
            <TabsTrigger
              value="approach"
              className="gap-2 h-9 rounded-lg font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-foreground data-[state=active]:text-background transition-all"
            >
              <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
              Approach
            </TabsTrigger>
          </TabsList>

          {hasChanges && (
            <Button
              size="sm"
              onClick={handleSave}
              className="gap-2"
              aria-label="Save changes to notes"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              Save Changes
            </Button>
          )}
        </div>

        <TabsContent value="notes" className="space-y-3">
          <div>
            <Label
              htmlFor="notes"
              className="text-xs text-muted-foreground mb-2 block"
            >
              Personal notes and observations
            </Label>
            <Textarea
              id="notes"
              placeholder="Write your notes here..."
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              className="min-h-[200px] font-mono text-sm resize-none"
            />
          </div>
        </TabsContent>

        <TabsContent value="solution" className="space-y-3">
          <div>
            <Label
              htmlFor="solution"
              className="text-xs text-muted-foreground mb-2 block"
            >
              Your code solution
            </Label>
            <Textarea
              id="solution"
              placeholder="Paste your solution code here..."
              value={solution}
              onChange={(e) => handleSolutionChange(e.target.value)}
              className="min-h-[200px] font-mono text-sm resize-none"
            />
          </div>
        </TabsContent>

        <TabsContent value="approach" className="space-y-3">
          <div>
            <Label
              htmlFor="approach"
              className="text-xs text-muted-foreground mb-2 block"
            >
              Problem-solving approach and pattern
            </Label>
            <Textarea
              id="approach"
              placeholder="Describe your approach, algorithms used, time/space complexity..."
              value={approach}
              onChange={(e) => handleApproachChange(e.target.value)}
              className="min-h-[200px] font-mono text-sm resize-none"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
