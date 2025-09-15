'use client';

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  Children,
  isValidElement,
  cloneElement,
} from 'react';
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

  const refreshPage = async (pageNumber: number) => {
    const res = await getTodo(userId, pageNumber, 20);
    if (res.success) {
      setMoreNotes(prev => {
        const startIndex = (pageNumber - 2) * 20;
        const updated = [...prev];

        // Remove duplicates if note already exists
        const idsToReplace = res.todo.map(n => n.id);
        const filtered = updated.filter(n => !idsToReplace.includes(n.id));

        filtered.splice(startIndex, 0, ...res.todo);
        return filtered;
      });
    }
  };

  const handlePin = async (note: Note) => {
    // Remove the pinned note from moreNotes
    setMoreNotes(prev => {
      const filtered = prev.filter(n => n.id !== note.id);
      return [note, ...filtered]; // simulate it went to top (SSR rendered)
    });

    // Refresh page 2 to fill the first "missing" element
    await refreshPage(2);
  };

  const handleUnpin = async (note: Note) => {
    // Remove it first from the top (SSR area)
    setMoreNotes(prev => prev.filter(n => n.id !== note.id));

    // Get all current unpinned notes plus the one we just unpinned
    const res = await getTodo(userId, 2, 1000);
    if (!res.success) return;

    const allUnpinned = res.todo.filter(n => !n.pinned);
    allUnpinned.push(note);

    const sorted = allUnpinned.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const index = sorted.findIndex(n => n.id === note.id);
    const pageSize = 20;
    const targetPage = Math.floor(index / pageSize) + 2;

    // Reinsert it into the right place
    await refreshPage(targetPage);
  };

  return (
    <>
      <section className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 p-4 mt-10">
        {Children.map(children, child =>
          isValidElement(child)
            ? cloneElement(
                child as React.ReactElement<{
                  onUnpin: (item: Note) => void;
                  onPin: (item: Note) => void;
                }>,
                {
                  onUnpin: handleUnpin,
                  onPin: handlePin,
                }
              )
            : child
        )}

        {moreNotes.map((item, i) => (
          <NotesItem
            item={item}
            userId={userId}
            key={item.id}
            page={Math.floor(i / 20) + 2}
            onUnpin={handleUnpin}
            onPin={handlePin}
          />
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
