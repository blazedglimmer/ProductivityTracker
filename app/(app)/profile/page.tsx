import { getProfile } from '@/lib/actions/profile';
import { ProfileForm } from '@/components/profile/profile-form';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  try {
    const profile = await getProfile();

    if (!profile) {
      redirect('/signin');
    }

    return <ProfileForm profile={profile} />;
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    redirect('/signin');
  }
}
