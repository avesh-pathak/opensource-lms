import { VisualizerFrame } from '@/lib/types/visualizer'
import { TreeNode } from '@/lib/store/tree-visualizer-store'

type OpType = 'insert' | 'delete'

export function generateBSTOpsFrames(
  nodes: TreeNode[],
  type: OpType,
  val: number
): VisualizerFrame<TreeNode>[] {
  const frames: VisualizerFrame<TreeNode>[] = []
  let currentNodes = [...nodes]
  const root = currentNodes.find((n) => n.parentId === null)

  if (type === 'insert') {
    let curr = root
    let parent: TreeNode | null = null

    frames.push({
      array: [...currentNodes],
      highlights: [],
      secondaryHighlights: [],
      visited: [],
      pointers: {},
      explanation: `Starting BST insertion for value ${val}.`,
      activeLine: 1,
      variables: { val },
      comparisons: 0,
      phase: 'search',
    })

    while (curr) {
      const currIdx = currentNodes.findIndex((n) => n.id === curr!.id)
      frames.push({
        array: [...currentNodes],
        highlights: [currIdx],
        secondaryHighlights: [],
        visited: [],
        pointers: { curr: currIdx },
        explanation: `Comparing ${val} with ${curr.value}.`,
        activeLine: 4,
        variables: { val, curr: curr.value },
        comparisons: 0,
        phase: 'compare',
      })

      parent = curr
      if (val < curr.value) {
        curr = currentNodes.find((n) => n.id === curr!.leftId) ?? undefined
      } else {
        curr = currentNodes.find((n) => n.id === curr!.rightId) ?? undefined
      }
    }

    // Insert new node
    const newNodeId = val.toString()
    const newNode: TreeNode = {
      id: newNodeId,
      value: val,
      leftId: null,
      rightId: null,
      parentId: parent?.id || null,
    }
    currentNodes.push(newNode)

    if (parent) {
      if (val < parent.value) {
        currentNodes = currentNodes.map((n) =>
          n.id === parent?.id ? { ...n, leftId: newNodeId } : n
        )
      } else {
        currentNodes = currentNodes.map((n) =>
          n.id === parent?.id ? { ...n, rightId: newNodeId } : n
        )
      }
    }

    const newNodeIdx = currentNodes.findIndex((n) => n.id === newNodeId)
    frames.push({
      array: [...currentNodes],
      highlights: [newNodeIdx],
      secondaryHighlights: [],
      visited: [],
      pointers: { new: newNodeIdx },
      explanation: `Inserted ${val} as a child of ${parent?.value || 'root'}.`,
      activeLine: 8,
      variables: { val, parent: parent?.value },
      comparisons: 0,
      phase: 'found',
    })
  } else if (type === 'delete') {
    // Find the node to delete
    let curr = root
    let parent: TreeNode | null = null
    let isLeftChild = false

    frames.push({
      array: [...currentNodes],
      highlights: [],
      secondaryHighlights: [],
      visited: [],
      pointers: {},
      explanation: `Starting BST deletion for value ${val}.`,
      activeLine: 1,
      variables: { val },
      comparisons: 0,
      phase: 'search',
    })

    // Search for the node to delete
    while (curr && curr.value !== val) {
      const currIdx = currentNodes.findIndex((n) => n.id === curr!.id)
      frames.push({
        array: [...currentNodes],
        highlights: [currIdx],
        secondaryHighlights: [],
        visited: [],
        pointers: { curr: currIdx },
        explanation: `Comparing ${val} with ${curr.value}.`,
        activeLine: 4,
        variables: { val, curr: curr.value },
        comparisons: 0,
        phase: 'compare',
      })

      parent = curr
      if (val < curr.value) {
        curr = currentNodes.find((n) => n.id === curr!.leftId) ?? undefined
        isLeftChild = true
      } else {
        curr = currentNodes.find((n) => n.id === curr!.rightId) ?? undefined
        isLeftChild = false
      }
    }

    // If node not found
    if (!curr) {
      frames.push({
        array: [...currentNodes],
        highlights: [],
        secondaryHighlights: [],
        visited: [],
        pointers: {},
        explanation: `Value ${val} not found in tree.`,
        activeLine: 9,
        variables: { val },
        comparisons: 0,
        phase: 'not-found',
      })
      return frames
    }

    const nodeToDeleteIdx = currentNodes.findIndex((n) => n.id === curr!.id)

    // Case 1: Node to delete has no children
    if (!curr.leftId && !curr.rightId) {
      frames.push({
        array: [...currentNodes],
        highlights: [nodeToDeleteIdx],
        secondaryHighlights: [],
        visited: [],
        pointers: { del: nodeToDeleteIdx },
        explanation: `Found node ${val} to delete (no children).`,
        activeLine: 12,
        variables: { val },
        comparisons: 0,
        phase: 'found',
      })

      // Remove the node
      currentNodes = currentNodes.filter((n) => n.id !== curr!.id)

      // Update parent's reference
      if (parent) {
        if (isLeftChild) {
          currentNodes = currentNodes.map((n) =>
            n.id === parent?.id ? { ...n, leftId: null } : n
          )
        } else {
          currentNodes = currentNodes.map((n) =>
            n.id === parent?.id ? { ...n, rightId: null } : n
          )
        }
      }

      frames.push({
        array: [...currentNodes],
        highlights: [],
        secondaryHighlights: [],
        visited: [],
        pointers: {},
        explanation: `Deleted node ${val}.`,
        activeLine: 20,
        variables: { val },
        comparisons: 0,
        phase: 'found',
      })
    }
    // Case 2: Node to delete has one child
    else if (!curr.leftId || !curr.rightId) {
      const childId = curr.leftId || curr.rightId
      const child = currentNodes.find((n) => n.id === childId)!
      const childIdx = currentNodes.findIndex((n) => n.id === childId)

      frames.push({
        array: [...currentNodes],
        highlights: [nodeToDeleteIdx],
        secondaryHighlights: [childIdx],
        visited: [],
        pointers: { del: nodeToDeleteIdx, child: childIdx },
        explanation: `Found node ${val} to delete (one child).`,
        activeLine: 12,
        variables: { val },
        comparisons: 0,
        phase: 'found',
      })

      // Bypass the node to delete
      if (parent) {
        if (isLeftChild) {
          currentNodes = currentNodes.map((n) =>
            n.id === parent?.id ? { ...n, leftId: childId } : n
          )
        } else {
          currentNodes = currentNodes.map((n) =>
            n.id === parent?.id ? { ...n, rightId: childId } : n
          )
        }
      } else {
        // If deleting root, update root's parentId
        currentNodes = currentNodes.map((n) =>
          n.id === childId ? { ...n, parentId: null } : n
        )
      }

      // Update child's parent reference
      currentNodes = currentNodes.map((n) =>
        n.id === childId ? { ...n, parentId: parent?.id || null } : n
      )

      // Remove the node
      currentNodes = currentNodes.filter((n) => n.id !== curr!.id)

      frames.push({
        array: [...currentNodes],
        highlights: [],
        secondaryHighlights: [],
        visited: [],
        pointers: {},
        explanation: `Deleted node ${val} and promoted its child.`,
        activeLine: 30,
        variables: { val },
        comparisons: 0,
        phase: 'found',
      })
    }
    // Case 3: Node to delete has two children
    else {
      // Find successor (smallest in right subtree)
      let successor = curr.rightId
        ? currentNodes.find((n) => n.id === curr!.rightId)
        : null
      let successorParent = curr
      while (successor && successor.leftId) {
        successorParent = successor
        successor = currentNodes.find((n) => n.id === successor!.leftId)
      }

      if (!successor) {
        // This shouldn't happen in a proper BST, but just in case
        frames.push({
          array: [...currentNodes],
          highlights: [nodeToDeleteIdx],
          secondaryHighlights: [],
          visited: [],
          pointers: { del: nodeToDeleteIdx },
          explanation: `Error: Could not find successor for node ${val}.`,
          activeLine: 12,
          variables: { val },
          comparisons: 0,
          phase: 'not-found',
        })
        return frames
      }

      const successorVal = successor.value
      const successorIdx = currentNodes.findIndex((n) => n.id === successor!.id)

      frames.push({
        array: [...currentNodes],
        highlights: [nodeToDeleteIdx],
        secondaryHighlights: [successorIdx],
        visited: [],
        pointers: { del: nodeToDeleteIdx, succ: successorIdx },
        explanation: `Found node ${val} to delete (two children). Finding successor...`,
        activeLine: 12,
        variables: { val },
        comparisons: 0,
        phase: 'found',
      })

      // Replace value with successor's value
      frames.push({
        array: [...currentNodes],
        highlights: [nodeToDeleteIdx],
        secondaryHighlights: [successorIdx],
        visited: [],
        pointers: { del: nodeToDeleteIdx, succ: successorIdx },
        explanation: `Replacing ${val} with successor value ${successorVal}.`,
        activeLine: 18,
        variables: { val, successor: successorVal },
        comparisons: 0,
        phase: 'found',
      })

      // Actually replace the value
      currentNodes = currentNodes.map((n) =>
        n.id === curr!.id ? { ...n, value: successorVal } : n
      )

      // Now delete the successor node (which has at most one child)
      const isSuccessorLeftChild = successorParent.leftId === successor.id

      if (!successor.leftId && !successor.rightId) {
        // Successor has no children
        frames.push({
          array: [...currentNodes],
          highlights: [successorIdx],
          secondaryHighlights: [],
          visited: [],
          pointers: { del: successorIdx },
          explanation: `Deleting successor node ${successorVal} (no children).`,
          activeLine: 24,
          variables: { val, successor: successorVal },
          comparisons: 0,
          phase: 'found',
        })

        // Remove the successor
        currentNodes = currentNodes.filter((n) => n.id !== successor!.id)

        // Update successor parent's reference
        if (isSuccessorLeftChild) {
          currentNodes = currentNodes.map((n) =>
            n.id === successorParent?.id ? { ...n, leftId: null } : n
          )
        } else {
          currentNodes = currentNodes.map((n) =>
            n.id === successorParent?.id ? { ...n, rightId: null } : n
          )
        }
      } else {
        // Successor has one child (must be right child since it's the leftmost)
        const successorChildId = successor.rightId
        const successorChild = currentNodes.find(
          (n) => n.id === successorChildId
        )!
        const successorChildIdx = currentNodes.findIndex(
          (n) => n.id === successorChildId
        )

        frames.push({
          array: [...currentNodes],
          highlights: [successorIdx],
          secondaryHighlights: [successorChildIdx],
          visited: [],
          pointers: { del: successorIdx, child: successorChildIdx },
          explanation: `Deleting successor node ${successorVal} (one child).`,
          activeLine: 24,
          variables: { val, successor: successorVal },
          comparisons: 0,
          phase: 'found',
        })

        // Bypass the successor
        if (isSuccessorLeftChild) {
          currentNodes = currentNodes.map((n) =>
            n.id === successorParent?.id
              ? { ...n, leftId: successorChildId }
              : n
          )
        } else {
          currentNodes = currentNodes.map((n) =>
            n.id === successorParent?.id
              ? { ...n, rightId: successorChildId }
              : n
          )
        }

        // Update child's parent reference
        currentNodes = currentNodes.map((n) =>
          n.id === successorChildId
            ? { ...n, parentId: successorParent?.id || null }
            : n
        )

        // Remove the successor
        currentNodes = currentNodes.filter((n) => n.id !== successor!.id)
      }

      frames.push({
        array: [...currentNodes],
        highlights: [],
        secondaryHighlights: [],
        visited: [],
        pointers: {},
        explanation: `Deleted node ${val} using successor value ${successorVal}.`,
        activeLine: 35,
        variables: { val },
        comparisons: 0,
        phase: 'found',
      })
    }
  }

  return frames
}
