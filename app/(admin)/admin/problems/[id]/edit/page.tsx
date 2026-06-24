'use client'

import { useState, useEffect, use } from 'react'
import { useRouter, redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { useDemoAction } from '@/hooks/use-demo-action'

export default function EditProblemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { isDemoRestricted } = useDemoAction()
  const router = useRouter()
  const resolvedParams = use(params)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [patterns, setPatterns] = useState<any[]>([])
  const [isLoadingPatterns, setIsLoadingPatterns] = useState(true)
  const [notFoundOrError, setNotFoundOrError] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    difficulty: 'Easy',
    category: '',
    patternId: '',
    order: 0,
    videoId: '',
    description: '',
    starterCode: {
      javascript: '// Write your code here',
      python: '# Write your code here',
    },
    solution: '',
    testCases: [] as { input: string; output: string; isHidden: boolean }[],
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const [patternsRes, problemsRes] = await Promise.all([
          fetch('/api/admin/patterns'),
          fetch('/api/admin/problems'),
        ])

        let loadedPatterns: any[] = []
        if (patternsRes.ok) {
          loadedPatterns = await patternsRes.json()
          setPatterns(loadedPatterns)
        }

        if (problemsRes.ok) {
          const allProblems = await problemsRes.json()
          const problem = allProblems.find(
            (p: any) => p._id === resolvedParams.id
          )

          if (problem) {
            setFormData({
              title: problem.title || '',
              slug: problem.slug || '',
              difficulty: problem.difficulty || 'Easy',
              category: problem.category || '',
              patternId: problem.patternId || '',
              order: problem.order || 0,
              videoId: problem.videoId || '',
              description: problem.description || '',
              starterCode: problem.starterCode || {
                javascript: '',
                python: '',
              },
              solution: problem.solution || '',
              testCases: problem.testCases || [],
            })
          } else {
            toast.error('Problem not found')
            setNotFoundOrError(true)
          }
        }
      } catch (error) {
        console.error('Failed to load data', error)
        toast.error('Failed to load data')
        setNotFoundOrError(true)
      } finally {
        setIsLoading(false)
        setIsLoadingPatterns(false)
      }
    }
    loadData()
  }, [resolvedParams.id, router])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'patternId') {
      const selectedPattern = patterns.find((p) => p._id === value)
      setFormData((prev) => ({
        ...prev,
        patternId: value,
        category: selectedPattern ? selectedPattern.name : prev.category,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isDemoRestricted()) return
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/admin/problems', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, _id: resolvedParams.id }),
      })

      if (res.ok) {
        toast.success('Problem updated successfully')
        router.push('/admin/problems')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to update problem')
      }
    } catch (_error) {
      toast.error('Failed to save problem')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (notFoundOrError) {
    redirect('/admin/problems')
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-5xl mx-auto pb-32">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          className="h-10 w-10 p-0 rounded-full"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-foreground">
            Edit Problem
          </h1>
          <p className="text-muted-foreground font-medium">
            Refine the challenge.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold uppercase tracking-widest text-sm text-muted-foreground">
                  Metadata
                </h3>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Difficulty</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(val) =>
                        handleSelectChange('difficulty', val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Order ID</Label>
                    <Input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Pattern / Category</Label>
                  <Select
                    value={formData.patternId}
                    onValueChange={(val) =>
                      handleSelectChange('patternId', val)
                    }
                    disabled={isLoadingPatterns}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isLoadingPatterns
                            ? 'Loading patterns...'
                            : 'Select a pattern'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {patterns.length > 0 ? (
                        patterns.map((p) => (
                          <SelectItem key={p._id} value={p.name}>
                            {p.name} ({p.domain})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value={formData.category || 'custom'}>
                          {formData.category || 'Custom'}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold uppercase tracking-widest text-sm text-muted-foreground">
                  Starter Code
                </h3>
                <Tabs defaultValue="javascript">
                  <TabsList className="w-full">
                    <TabsTrigger value="javascript" className="flex-1">
                      JavaScript
                    </TabsTrigger>
                    <TabsTrigger value="python" className="flex-1">
                      Python
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="javascript" className="space-y-2">
                    <Textarea
                      className="font-mono text-sm min-h-[150px]"
                      value={formData.starterCode.javascript}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          starterCode: {
                            ...formData.starterCode,
                            javascript: e.target.value,
                          },
                        })
                      }
                    />
                  </TabsContent>
                  <TabsContent value="python" className="space-y-2">
                    <Textarea
                      className="font-mono text-sm min-h-[150px]"
                      value={formData.starterCode.python}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          starterCode: {
                            ...formData.starterCode,
                            python: e.target.value,
                          },
                        })
                      }
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="h-full flex flex-col">
              <CardContent className="p-6 h-full flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold uppercase tracking-widest text-sm text-muted-foreground">
                    Description (Markdown)
                  </h3>
                  <div className="flex bg-muted p-1 rounded-lg">
                    <Button
                      type="button"
                      variant={!showPreview ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setShowPreview(false)}
                      className="h-7 text-xs font-bold"
                    >
                      Write
                    </Button>
                    <Button
                      type="button"
                      variant={showPreview ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setShowPreview(true)}
                      className="h-7 text-xs font-bold"
                    >
                      Preview
                    </Button>
                  </div>
                </div>
                {showPreview ? (
                  <div className="flex-1 border rounded-md p-4 bg-muted/30 overflow-y-auto prose dark:prose-invert max-w-none text-sm">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formData.description.replace(/\n/g, '<br/>'),
                      }}
                    />
                  </div>
                ) : (
                  <Textarea
                    className="flex-1 font-mono text-sm min-h-[300px]"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="# Problem Title..."
                  />
                )}
              </CardContent>
            </Card>

            {/* Test Cases Section */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold uppercase tracking-widest text-sm text-muted-foreground">
                    Test Cases
                  </h3>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        testCases: [
                          ...formData.testCases,
                          { input: '', output: '', isHidden: false },
                        ],
                      })
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Case
                  </Button>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {formData.testCases.map((tc, idx) => (
                    <div
                      key={idx}
                      className="grid gap-4 p-4 border rounded-xl bg-muted/20 relative group"
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 h-6 w-6 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          const newCases = [...formData.testCases]
                          newCases.splice(idx, 1)
                          setFormData({ ...formData, testCases: newCases })
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs">Input</Label>
                          <Textarea
                            className="font-mono text-xs min-h-[60px]"
                            value={tc.input}
                            onChange={(e) => {
                              const newCases = [...formData.testCases]
                              newCases[idx].input = e.target.value
                              setFormData({ ...formData, testCases: newCases })
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Expected Output</Label>
                          <Textarea
                            className="font-mono text-xs min-h-[60px]"
                            value={tc.output}
                            onChange={(e) => {
                              const newCases = [...formData.testCases]
                              newCases[idx].output = e.target.value
                              setFormData({ ...formData, testCases: newCases })
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`hidden-${idx}`}
                          checked={tc.isHidden}
                          onChange={(e) => {
                            const newCases = [...formData.testCases]
                            newCases[idx].isHidden = e.target.checked
                            setFormData({ ...formData, testCases: newCases })
                          }}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label
                          htmlFor={`hidden-${idx}`}
                          className="text-xs text-muted-foreground"
                        >
                          Hidden Test Case
                        </Label>
                      </div>
                    </div>
                  ))}
                  {formData.testCases.length === 0 && (
                    <div className="text-center py-6 text-sm text-muted-foreground italic">
                      No test cases added.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-4 fixed bottom-6 right-6 lg:right-10 z-50">
          <Button
            type="submit"
            size="lg"
            className="h-14 px-8 rounded-full shadow-2xl shadow-primary/30 font-black uppercase tracking-wider text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Saving...'
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" /> Update Problem
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
