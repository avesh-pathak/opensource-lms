'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Clock,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  Video,
  User,
  CheckCircle2,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns/format'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useDemoAction } from '@/hooks/use-demo-action'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function AdminMentorship() {
  const { isDemoRestricted } = useDemoAction()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [slots, setSlots] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // Time selection state
  const [startTime, setStartTime] = useState('10:00')
  const [startTimeMeridiem, setStartTimeMeridiem] = useState('AM')
  const [duration, setDuration] = useState('60') // minutes
  const [meetingLink, setMeetingLink] = useState('')

  useEffect(() => {
    if (date) {
      fetchSlots(date)
    }
  }, [date])

  const fetchSlots = async (selectedDate: Date) => {
    setIsLoading(true)
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      const res = await fetch(
        `/api/admin/mentorship/availability?date=${dateStr}`
      )
      if (res.ok) {
        setSlots(await res.json())
      }
    } catch (_error) {
      toast.error('Failed to fetch slots')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateSlot = async () => {
    if (isDemoRestricted()) return
    if (!date) return

    // Format times to display string (e.g. "10:00 AM")
    const formattedStartTime = `${startTime} ${startTimeMeridiem}`

    // Calculate end time
    // eslint-disable-next-line prefer-const
    let [hours, minutes] = startTime.split(':').map(Number)
    void minutes // used below via startDateObj
    if (startTimeMeridiem === 'PM' && hours !== 12) hours += 12
    if (startTimeMeridiem === 'AM' && hours === 12) hours = 0

    const startDateObj = new Date(date)
    startDateObj.setHours(hours, minutes)

    const endDateObj = new Date(
      startDateObj.getTime() + parseInt(duration) * 60000
    )
    let endHours = endDateObj.getHours()
    const endMinutes = endDateObj.getMinutes()
    const endMeridiem = endHours >= 12 ? 'PM' : 'AM'
    if (endHours > 12) endHours -= 12
    if (endHours === 0) endHours = 12

    const formattedEndTime = `${endHours}:${endMinutes.toString().padStart(2, '0')} ${endMeridiem}`

    try {
      const res = await fetch('/api/admin/mentorship/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: date.toISOString(),
          dateString: format(date, 'yyyy-MM-dd'),
          startTime: formattedStartTime,
          endTime: formattedEndTime,
          meetingLink,
        }),
      })

      if (res.ok) {
        toast.success('Availability slot added')
        setIsCreateOpen(false)
        fetchSlots(date)
        // Reset form
        setMeetingLink('')
      } else {
        const data = await res.json()
        throw new Error(data.error || 'Failed to add slot')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error creating slot')
    }
  }

  const handleDeleteSlot = async (id: string) => {
    if (isDemoRestricted()) return
    if (!confirm('Are you sure you want to remove this slot?')) return
    try {
      const res = await fetch(`/api/admin/mentorship/availability?id=${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        toast.success('Slot removed')
        if (date) fetchSlots(date)
      }
    } catch (_error) {
      toast.error('Failed to delete slot')
    }
  }

  // Generate time options
  const timeOptions = []
  for (let i = 1; i <= 12; i++) {
    timeOptions.push(`${i}:00`)
    timeOptions.push(`${i}:30`)
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] uppercase font-black tracking-widest">
            <Clock className="h-3 w-3" />
            Availability Matrix
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-foreground leading-[0.9]">
            Mentorship <span className="text-primary">Calendar</span>
          </h1>
          <p className="text-muted-foreground font-medium text-sm max-w-md">
            Manage your temporal availability nodes. Students will book these
            slots for high-fidelity technical synchronization.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button
              disabled={!date}
              className="h-12 px-8 shadow-2xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white font-black italic uppercase tracking-wider rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Slot
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-[32px] p-0 overflow-hidden border-0 shadow-2xl">
            <div className="bg-primary/10 p-8 text-center space-y-2">
              <h2 className="text-2xl font-black italic uppercase tracking-tight text-primary">
                New Availability Node
              </h2>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {date && format(date, 'EEEE, MMMM do, yyyy')}
              </p>
            </div>

            <div className="p-8 space-y-6 bg-card">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                    Start Time
                  </Label>
                  <div className="flex gap-2">
                    <Select value={startTime} onValueChange={setStartTime}>
                      <SelectTrigger className="font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((t) => (
                          <SelectItem key={t} value={t} className="font-medium">
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={startTimeMeridiem}
                      onValueChange={setStartTimeMeridiem}
                    >
                      <SelectTrigger className="w-[80px] font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AM" className="font-medium">
                          AM
                        </SelectItem>
                        <SelectItem value="PM" className="font-medium">
                          PM
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                    Duration
                  </Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger className="font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15" className="font-medium">
                        15 Minutes
                      </SelectItem>
                      <SelectItem value="30" className="font-medium">
                        30 Minutes
                      </SelectItem>
                      <SelectItem value="45" className="font-medium">
                        45 Minutes
                      </SelectItem>
                      <SelectItem value="60" className="font-medium">
                        1 Hour
                      </SelectItem>
                      <SelectItem value="90" className="font-medium">
                        1.5 Hours
                      </SelectItem>
                      <SelectItem value="120" className="font-medium">
                        2 Hours
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                  Meeting Link (Optional)
                </Label>
                <Input
                  placeholder="e.g. Google Meet or Zoom URL"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  className="bg-muted/30 border-muted font-medium focus:ring-primary/20"
                />
              </div>

              <Button
                onClick={handleCreateSlot}
                className="w-full h-12 bg-primary text-white font-black italic uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
              >
                Confirm Availability
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Calendar Column */}
        <Card className="lg:col-span-4 border-none shadow-2xl shadow-primary/5 bg-gradient-to-br from-card to-muted/20 rounded-[32px] overflow-hidden sticky top-8">
          <CardContent className="p-0">
            <div className="bg-primary/5 p-6 border-b border-primary/10">
              <h3 className="font-black italic uppercase tracking-tight text-xl">
                Select Date
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                Choose a day to manage slots
              </p>
            </div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="p-6 w-full flex justify-center"
              classNames={{
                head_cell:
                  'text-muted-foreground w-10 font-bold text-[0.8rem] uppercase tracking-widest',
                cell: 'h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                day: cn(
                  'h-10 w-10 p-0 font-medium aria-selected:opacity-100 hover:bg-primary/10 hover:text-primary rounded-xl transition-all'
                ),
                day_selected:
                  'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-lg shadow-primary/30 font-black',
                day_today: 'bg-accent text-accent-foreground font-bold',
              }}
            />
          </CardContent>
        </Card>

        {/* Slots Column */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm rounded-[32px] overflow-hidden min-h-[500px]">
            <div className="p-8 border-b border-border/50 flex items-center justify-between bg-muted/10">
              <div className="space-y-1">
                <h2 className="text-2xl font-black italic uppercase tracking-tight flex items-center gap-2">
                  <CalendarIcon className="h-6 w-6 text-primary" />
                  {date ? format(date, 'MMMM d, yyyy') : 'Select a date'}
                </h2>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">
                  {slots.length} Slots Configuration
                </p>
              </div>
            </div>

            <div className="p-8">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4 text-muted-foreground opacity-50">
                  <Loader2 className="h-10 w-10 animate-spin" />
                  <p className="text-xs font-black uppercase tracking-widest">
                    Fetching Temporal Data...
                  </p>
                </div>
              ) : slots.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-6 border-2 border-dashed border-border/50 rounded-3xl bg-muted/5">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center grayscale opacity-20">
                    <Clock className="h-10 w-10" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-lg font-bold text-foreground">
                      No slots available
                    </p>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                      You haven&apos;t added any availability for this date yet.
                      Click &quot;Add Slot&quot; to open your schedule.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateOpen(true)}
                    className="rounded-xl font-bold uppercase tracking-wide"
                  >
                    Create First Slot
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {slots.map((slot) => (
                    <div
                      key={slot._id}
                      className={cn(
                        'group relative p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg',
                        slot.isBooked
                          ? 'bg-muted/30 border-border/50 opacity-100'
                          : 'bg-background border-primary/20 hover:border-primary/50'
                      )}
                    >
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        {slot.isBooked ? (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                            <User className="h-3 w-3" />
                            <span className="text-[9px] font-black uppercase tracking-widest">
                              Booked
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 border border-green-500/20 shadow-sm animate-pulse-slow">
                            <CheckCircle2 className="h-3 w-3" />
                            <span className="text-[9px] font-black uppercase tracking-widest">
                              Open
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-6">
                        <div
                          className={cn(
                            'h-16 w-16 rounded-2xl flex items-center justify-center border-2 shadow-sm',
                            slot.isBooked
                              ? 'bg-muted border-border text-muted-foreground'
                              : 'bg-primary/5 border-primary/20 text-primary'
                          )}
                        >
                          <Clock className="h-8 w-8" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-baseline gap-2">
                            <h3 className="text-2xl font-black italic tracking-tighter text-foreground">
                              {slot.startTime}
                            </h3>
                            <span className="text-muted-foreground font-medium text-sm">
                              to {slot.endTime}
                            </span>
                          </div>

                          {slot.isBooked && (
                            <div className="flex items-center gap-2 pt-1 text-sm text-foreground/80 font-medium">
                              <span>Booked by Student</span>
                            </div>
                          )}

                          {slot.meetingLink && (
                            <div className="flex items-center gap-1.5 text-xs text-blue-500 font-medium pt-1">
                              <Video className="h-3 w-3" />
                              <a
                                href={slot.meetingLink}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:underline truncate max-w-[200px]"
                              >
                                {slot.meetingLink}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-9 w-9 rounded-xl shadow-lg hover:scale-110 transition-transform"
                          onClick={() => handleDeleteSlot(slot._id)}
                          title="Remove Slot"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
