import CreateNotes from '@/components/notes/create-notes';
import GetNotes from '@/components/notes/get-notes';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/actions/auth'; // Import auth options for session handling

export default async function Home() {
  let userId: string;

  try {
    const session = await getServerSession(authOptions); // Fetch the session
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }
    userId = session.user.id; // Extract the userId from the session
  } catch (error) {
    console.error('Error fetching userId:', error);
    return (
      <div className="container mx-auto p-4 m-12 max-h-screen w-full">
        <p className="text-center text-red-500">User not authenticated.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto m-8 pr-[28px] max-h-screen w-full">
      <CreateNotes userId={userId} />
      <GetNotes userId={userId} />
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Notes.`,
    description: 'Customize your notes and collaborate ',
  };
}
