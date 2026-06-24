'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Calendar,
  Clock,
  DollarSign,
  Loader2,
  Video,
  Users,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'

interface Booking {
  _id: string
  studentId: string
  studentEmail: string
  studentName: string
  mentorId: string
  mentorName: string
  date: string
  dateString: string
  timeSlot: string
  sessionType: 'sos' | 'roast' | 'consult' | '1-1'
  price: number
  paymentStatus: 'pending' | 'completed' | 'failed'
  razorpayOrderId?: string
  razorpayPaymentId?: string
  meetingLink?: string
  createdAt: string
}

interface Stats {
  totalBookings: number
  completedPayments: number
  totalRevenue: number
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    completedPayments: 0,
    totalRevenue: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  // Filters
  const [sessionTypeFilter, setSessionTypeFilter] = useState<string>('all')
  const [paymentFilter, setPaymentFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const fetchBookings = async () => {
    try {
      let url = '/api/admin/bookings?'
      if (sessionTypeFilter !== 'all')
        url += `sessionType=${sessionTypeFilter}&`
      if (paymentFilter !== 'all') url += `paymentStatus=${paymentFilter}&`

      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setBookings(data.bookings || [])
        setStats(
          data.stats || {
            totalBookings: 0,
            completedPayments: 0,
            totalRevenue: 0,
          }
        )
      }
    } catch (_error) {
      toast.error('Failed to fetch bookings')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionTypeFilter, paymentFilter])

  const filteredBookings = bookings.filter((booking) => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      booking.studentName.toLowerCase().includes(search) ||
      booking.studentEmail.toLowerCase().includes(search) ||
      booking.mentorName.toLowerCase().includes(search)
    )
  })

  const getSessionTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      sos: 'bg-red-500/10 text-red-500 border-red-500/20',
      roast: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      consult: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
      '1-1': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    }
    const labels: Record<string, string> = {
      sos: 'SOS',
      roast: 'Roast',
      consult: 'Consult',
      '1-1': '1:1 Session',
    }
    return (
      <Badge variant="outline" className={styles[type] || ''}>
        {labels[type] || type}
      </Badge>
    )
  }

  const getPaymentBadge = (status: string) => {
    if (status === 'completed') {
      return (
        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
          <CheckCircle2 className="h-3 w-3 mr-1" /> Paid
        </Badge>
      )
    }
    if (status === 'failed') {
      return (
        <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
          <XCircle className="h-3 w-3 mr-1" /> Failed
        </Badge>
      )
    }
    return <Badge variant="secondary">Pending</Badge>
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic">
          Bookings Dashboard
        </h1>
        <p className="text-muted-foreground font-medium">
          View all student session bookings and payments.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Total Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black italic">
              {stats.totalBookings}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Completed Payments
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black italic">
              {stats.completedPayments}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black italic">
              ₹{stats.totalRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search by student or mentor name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4"
          />
        </div>
        <Select value={sessionTypeFilter} onValueChange={setSessionTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Session Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="sos">SOS</SelectItem>
            <SelectItem value="roast">Roast</SelectItem>
            <SelectItem value="consult">Consult</SelectItem>
            <SelectItem value="1-1">1:1 Session</SelectItem>
          </SelectContent>
        </Select>
        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookings Table */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredBookings.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground font-medium">
              No bookings found.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/50 bg-card/50">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Mentor</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Meeting</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>
                    <div>
                      <p className="font-bold">{booking.studentName}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.studentEmail}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {booking.mentorName}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{booking.dateString}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{booking.timeSlot}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getSessionTypeBadge(booking.sessionType)}
                  </TableCell>
                  <TableCell className="font-bold">₹{booking.price}</TableCell>
                  <TableCell>
                    {getPaymentBadge(booking.paymentStatus)}
                  </TableCell>
                  <TableCell>
                    {booking.meetingLink ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-500 hover:text-blue-600"
                        onClick={() =>
                          window.open(booking.meetingLink, '_blank')
                        }
                      >
                        <Video className="h-4 w-4" />
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
