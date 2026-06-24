import { auth } from '@/lib/auth'
import { StudentMentorshipView } from '@/components/student/student-mentorship-view'
import { MentorDashboardView } from '@/components/mentor/mentor-dashboard-view'

export default async function MentorshipPage() {
  const session = await auth()
  const role = session?.user?.role || 'student'

  if (role === 'admin' || role === 'mentor') {
    // Pass mentorId if available, or userid
    return <MentorDashboardView mentorId={session?.user?.id || ''} />
  }

  return <StudentMentorshipView />
}
