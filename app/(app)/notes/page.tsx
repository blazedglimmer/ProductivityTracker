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
    <div className="container mx-auto p-4 m-12 max-h-screen w-full">
      <div className={'flex items-center justify-center mb-6'}>
        <div className="sm:hidden text-2xl md:text-4xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 px-4 py-2 rounded-md w-fit italic text-white">
          ByteNotes.
        </div>
      </div>
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
