import { Suspense } from 'react'
import { ProfileForm } from '@/components/profile/profile-form'
import { ProfileSkeleton } from '@/components/skeletons/profile-skeleton'

export default function ProfilePage() {
  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-5xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic text-foreground">
          User Profile
        </h1>
        <p className="text-muted-foreground font-medium">
          Manage your personal information and account preferences.
        </p>
      </div>

      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileForm />
      </Suspense>
    </div>
  )
}
