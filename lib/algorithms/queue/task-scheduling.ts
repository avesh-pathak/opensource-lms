import { VisualizerFrame } from '@/lib/types/visualizer'

export const generateTaskSchedulingFrames = (
  tasks: { id: string; time: number }[],
  quantum: number
): VisualizerFrame[] => {
  const frames: VisualizerFrame[] = []
  const queue = tasks.map((t) => ({ ...t }))
  const finished: string[] = []
  let currentTime = 0

  // Initial Frame
  frames.push({
    array: [],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    explanation: `Starting Round Robin Task Scheduling. Quantum = ${quantum}.`,
    activeLine: 1,
    variables: {
      queue: queue.map((t) => `${t.id}(${t.time})`),
      finished: [],
      currentTime,
    },
    comparisons: 0,
    phase: 'search',
    trace: '[Init] Ready to schedule.',
  })

  while (queue.length > 0) {
    const currentTask = queue.shift()!
    const timeTaken = Math.min(currentTask.time, quantum)

    // 1. Pick Task Frame
    frames.push({
      array: [],
      highlights: [],
      secondaryHighlights: [],
      visited: [],
      pointers: { activeTask: 0 },
      explanation: `Picking task ${currentTask.id}. Needs ${currentTask.time} units.`,
      activeLine: 4,
      variables: {
        queue: queue.map((t) => `${t.id}(${t.time})`),
        activeTask: `${currentTask.id}(${currentTask.time})`,
        finished: [...finished],
        currentTime,
      },
      comparisons: 0,
      phase: 'search',
      trace: `[Schedule] Picked ${currentTask.id}.`,
    })

    currentTime += timeTaken
    currentTask.time -= timeTaken

    // 2. Execute Task Frame
    frames.push({
      array: [],
      highlights: [],
      secondaryHighlights: [],
      visited: [],
      pointers: { activeTask: 0 },
      explanation: `Executing ${currentTask.id} for ${timeTaken} units. Remaining: ${currentTask.time}. Current Time: ${currentTime}`,
      activeLine: 6,
      variables: {
        queue: queue.map((t) => `${t.id}(${t.time})`),
        activeTask: `${currentTask.id}(${currentTask.time})`,
        finished: [...finished],
        currentTime,
      },
      comparisons: 1,
      phase: 'compare',
      trace: `[Execute] ${currentTask.id} ran for ${timeTaken}.`,
    })

    if (currentTask.time > 0) {
      queue.push(currentTask)
      // 3. Put Back Frame
      frames.push({
        array: [],
        highlights: [],
        secondaryHighlights: [],
        visited: [],
        pointers: {},
        explanation: `Task ${currentTask.id} not finished. Moving back to end of queue.`,
        activeLine: 8,
        variables: {
          queue: queue.map((t) => `${t.id}(${t.time})`),
          finished: [...finished],
          currentTime,
        },
        comparisons: 0,
        phase: 'search',
        trace: `[Requeue] ${currentTask.id} moved back.`,
      })
    } else {
      finished.push(currentTask.id)
      // 3. Finished Frame
      frames.push({
        array: [],
        highlights: [],
        secondaryHighlights: [],
        visited: [],
        pointers: {},
        explanation: `Task ${currentTask.id} finished! Total time: ${currentTime}`,
        activeLine: 10,
        variables: {
          queue: queue.map((t) => `${t.id}(${t.time})`),
          finished: [...finished],
          currentTime,
        },
        comparisons: 1,
        phase: 'found',
        trace: `[Done] ${currentTask.id} finished.`,
      })
    }
  }

  return frames
}
