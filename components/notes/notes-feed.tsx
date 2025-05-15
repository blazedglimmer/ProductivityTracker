'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { getTodo } from '@/app/actions/notes-actions'; // ✅ server action
import { NotesItem } from '@/components/notes/notes-item';
import { Note } from '@/types';

export const NotesFeed = ({
  userId,
  initialLoad = false,
  children,
}: {
  initialLoad: boolean;
  userId: string;
  children: React.ReactNode;
}) => {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(2); // First page is already rendered by server
  const [moreNotes, setMoreNotes] = useState<Note[]>([]);
  const [hasMore, setHasMore] = useState(!initialLoad);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    const res = await getTodo(userId, page, 20);

    if (!res.error && res.todo.length > 0) {
      setMoreNotes(prev => [...prev, ...res.todo]);
      setPage(prev => prev + 1);

      // stop if we're on the last page
      if (page >= res.totalPages) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }

    setLoading(false);
  }, [loading, userId, page, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    const el = loaderRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [loadMore, hasMore]);

  return (
    <>
      <section className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 p-4 mt-10">
        {children}

        {moreNotes.map(item => (
          <NotesItem item={item} userId={userId} key={item.id} /> // Render on client
        ))}
      </section>

      <div
        ref={loaderRef}
        className="h-10 w-full text-center text-gray-500 my-6"
      >
        {loading
          ? 'Loading more...'
          : hasMore
          ? 'Scroll to load more'
          : 'No more notes'}
      </div>
    </>
  );
};
