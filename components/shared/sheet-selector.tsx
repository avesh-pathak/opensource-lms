'use client'

import React, { useState, useTransition } from 'react'
import { Plus, FileSpreadsheet, Loader2, Trash2, Pencil } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Sheet,
  createSheetOptimistic,
  deleteSheetOptimistic,
  renameSheetOptimistic,
} from '@/hooks/use-sheets'

export function SheetSelector({
  currentSheetId,
  sheets,
  onSelect,
  onCreateNew,
  className,
  readOnly = false,
}: {
  currentSheetId: string
  sheets: Sheet[]
  onSelect?: (sheetId: string) => void
  onCreateNew?: () => void
  className?: string
  readOnly?: boolean
}) {
  // Create State
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newSheetName, setNewSheetName] = useState('')
  const [creating, setCreating] = useState(false)

  // Rename State
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [renameSheetName, setRenameSheetName] = useState('')
  const [renaming, setRenaming] = useState(false)

  // Delete State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // React 19 transition for non-blocking navigation
  const [isPending, startTransition] = useTransition()

  const router = useRouter()

  const currentSheet = sheets.find((s) => s._id === currentSheetId)

  const handleCreateSheet = async () => {
    if (!newSheetName.trim()) return

    setCreating(true)
    setIsCreateDialogOpen(false)

    const result = await createSheetOptimistic(newSheetName, router)

    if (result.success) {
      setNewSheetName('')
    } else {
      setIsCreateDialogOpen(true)
    }

    setCreating(false)
  }

  const handleRenameSheet = async () => {
    if (
      !renameSheetName.trim() ||
      renameSheetName.trim() === currentSheet?.name
    )
      return

    setRenaming(true)
    setIsRenameDialogOpen(false)

    const success = await renameSheetOptimistic(
      currentSheetId,
      renameSheetName,
      sheets
    )

    if (!success) {
      setIsRenameDialogOpen(true)
    } else {
      setRenameSheetName('')
    }

    setRenaming(false)
  }

  const handleDeleteSheet = async () => {
    setDeleting(true)
    setIsDeleteDialogOpen(false)

    const result = await deleteSheetOptimistic(currentSheetId, sheets)

    if (result.success) {
      if (result.nextSheetId) {
        window.location.href = `/dashboard/custom-sheet/${result.nextSheetId}`
      } else {
        window.location.href = '/dashboard/custom-sheet'
      }
    }

    setDeleting(false)
  }

  const handleSheetSelect = (value: string) => {
    if (onSelect) {
      onSelect(value)
    } else {
      startTransition(() => {
        router.push(`/dashboard/custom-sheet/${value}`)
      })
    }
  }

  const openRenameDialog = () => {
    if (currentSheet) {
      setRenameSheetName(currentSheet.name)
      setIsRenameDialogOpen(true)
    }
  }

  if (sheets.length === 0) {
    return null
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Selector Dropdown */}
      {sheets.length >= 2 && (
        <Select
          value={currentSheetId}
          onValueChange={handleSheetSelect}
          disabled={isPending}
        >
          <SelectTrigger
            className={cn(
              'w-[200px] md:w-[240px] bg-background/60 backdrop-blur-xl border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 font-black uppercase tracking-tighter shadow-sm hover:shadow-orange-500/10',
              isPending && 'opacity-70'
            )}
          >
            <SelectValue placeholder="Select Sheet">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-orange-500" />
                <span className="truncate">
                  {currentSheet?.name || 'Select Sheet'}
                </span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-orange-500/20 bg-background/80 backdrop-blur-2xl shadow-2xl">
            <SelectGroup>
              <SelectLabel className="text-[10px] uppercase font-black tracking-widest text-muted-foreground px-2 py-1.5">
                Your Sheets
              </SelectLabel>
              {sheets.map((sheet) => (
                <SelectItem
                  key={sheet._id}
                  value={sheet._id}
                  className="font-bold uppercase tracking-tight focus:bg-orange-500/10 focus:text-orange-600 cursor-pointer rounded-lg mx-1"
                >
                  <div className="flex items-center justify-between w-full gap-2">
                    <span>{sheet.name}</span>
                    {sheet.isDefault && (
                      <span className="text-[8px] opacity-50 px-1 border rounded capitalize font-medium shrink-0">
                        Default
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}

      {/* Create New Sheet Button - Hidden in Read-Only Mode */}
      {!readOnly && (
        <Button
          onClick={() => {
            if (onCreateNew) {
              onCreateNew()
            } else {
              setIsCreateDialogOpen(true)
            }
          }}
          variant="outline"
          size="sm"
          disabled={creating}
          className="gap-1.5 font-bold uppercase tracking-wider text-xs border-orange-500/20 hover:border-orange-500/40 hover:bg-orange-500/10 rounded-lg"
        >
          {creating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Plus className="h-3.5 w-3.5" />
          )}
          <span className="hidden sm:inline">Create</span>
          <span className="sm:hidden">+</span>
        </Button>
      )}

      {/* Rename Button - Hidden in Read-Only Mode */}
      {!readOnly && (
        <Button
          onClick={openRenameDialog}
          variant="outline"
          size="sm"
          disabled={renaming}
          className="gap-1.5 font-bold uppercase tracking-wider text-xs border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/10 text-blue-500 hover:text-blue-600 rounded-lg"
        >
          {renaming ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Pencil className="h-3.5 w-3.5" />
          )}
          <span className="hidden sm:inline">Edit</span>
        </Button>
      )}

      {/* Delete Sheet Button - Hidden in Read-Only Mode */}
      {!readOnly && (
        <Button
          onClick={() => setIsDeleteDialogOpen(true)}
          variant="outline"
          size="sm"
          disabled={deleting}
          className="gap-1.5 font-bold uppercase tracking-wider text-xs border-red-500/20 hover:border-red-500/40 hover:bg-red-500/10 text-red-500 hover:text-red-600 rounded-lg"
        >
          {deleting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
          <span className="hidden sm:inline">Delete</span>
        </Button>
      )}

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="rounded-3xl border-orange-500/20 w-[95%] sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
              Rename <span className="text-orange-500">Sheet</span>
            </DialogTitle>
            <DialogDescription className="font-medium">
              Enter a new name for your sheet.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="rename-name"
                className="text-xs font-black uppercase tracking-widest text-muted-foreground"
              >
                Sheet Name
              </Label>
              <Input
                id="rename-name"
                value={renameSheetName}
                onChange={(e) => setRenameSheetName(e.target.value)}
                placeholder="New Sheet Name"
                className="rounded-xl border-orange-200 focus:border-orange-500 focus:ring-orange-500/20 font-bold"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRenameSheet()
                }}
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => setIsRenameDialogOpen(false)}
              className="rounded-xl font-bold uppercase tracking-wider w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRenameSheet}
              disabled={
                renaming ||
                !renameSheetName.trim() ||
                renameSheetName.trim() === currentSheet?.name
              }
              className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest w-full sm:w-auto shadow-lg shadow-orange-500/20"
            >
              {renaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="rounded-3xl border-red-500/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black text-red-500 uppercase tracking-tight">
              Delete Sheet?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{' '}
              <span className="font-bold text-foreground">
                &quot;{currentSheet?.name}&quot;
              </span>{' '}
              and ALL its patterns and problems. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl font-bold">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDeleteSheet()
              }}
              className="rounded-xl bg-red-500 hover:bg-red-600 font-bold uppercase tracking-widest"
            >
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="rounded-3xl border-orange-500/20 w-[95%] sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
              Create <span className="text-orange-500">New Sheet</span>
            </DialogTitle>
            <DialogDescription className="font-medium">
              Give your new DSA tracking sheet a name.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-xs font-black uppercase tracking-widest text-muted-foreground"
              >
                Sheet Name
              </Label>
              <Input
                id="name"
                value={newSheetName}
                onChange={(e) => setNewSheetName(e.target.value)}
                placeholder="e.g. SDE Marathon, Blind 75"
                className="rounded-xl border-orange-200 focus:border-orange-500 focus:ring-orange-500/20 font-bold"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateSheet()
                }}
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
              className="rounded-xl font-bold uppercase tracking-wider w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateSheet}
              disabled={creating || !newSheetName.trim()}
              className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest w-full sm:w-auto shadow-lg shadow-orange-500/20"
            >
              {creating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Create Sheet'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
