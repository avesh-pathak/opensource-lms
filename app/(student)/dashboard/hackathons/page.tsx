import { HackathonHub } from '@/components/hackathon/hackathon-hub'

export const metadata = {
  title: 'Hackathon Arena | Babua DSA',
  description:
    'Participate in real-world building challenges and win exclusive rewards.',
}

export default function HackathonsPage() {
  return (
    <div className="container mx-auto py-8">
      <HackathonHub />
    </div>
  )
}
