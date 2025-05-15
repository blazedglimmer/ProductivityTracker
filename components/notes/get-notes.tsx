'use server';
import { getTodo } from '@/app/actions/notes-actions';
import { NotesItem } from '@/components/notes/notes-item';
import { NotesFeed } from '@/components/notes/notes-feed';

const GetNotes = async ({ userId }: { userId: string }) => {
  const { todo, error, totalPages, message } = await getTodo(userId, 1, 20);

  if (error) {
    <span> Error while fetching todos {message}</span>;
  }

  return (
    <NotesFeed userId={userId} initialLoad={totalPages === 1}>
      {todo?.map(item => (
        <NotesItem item={item} userId={userId} key={item.id} /> // Render on server
      ))}
    </NotesFeed>
  );
};

export default GetNotes;
