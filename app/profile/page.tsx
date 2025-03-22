import { getProfile } from '@/lib/actions/profile';
import { ProfileForm } from '@/components/profile/profile-form';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  try {
    const profile = await getProfile();

    if (!profile) {
      redirect('/signin');
    }

    return (
      <div className="container max-w-2xl py-8">
        <ProfileForm profile={profile} />
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    redirect('/signin');
  }
}
