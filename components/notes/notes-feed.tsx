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
        const updated = [...prev];
        const startIndex = (pageNumber - 2) * 20; // because page 1 is SSR
        if (startIndex >= 0) {
          updated.splice(startIndex, 20, ...res.todo); // ✅ replace exactly 20 items, change as per the page size
        }
        return updated;
      });
    }
  };

  const refreshPageByCreatedAt = async (createdAt: Date) => {
    // Find the index where this unpinned note would fall
    const index = moreNotes.findIndex(
      note => new Date(note.createdAt) < new Date(createdAt)
    );

    // Determine page number from index
    const inferredPage = index === -1 ? page : Math.floor(index / 20) + 2; // +2 since page 1 is SSR and moreNotes starts from page 2
    await refreshPage(inferredPage - 1);
  };

  const handleUnpin = async (item: Note) => {
    await refreshPageByCreatedAt(item.createdAt);
  };

  return (
    <>
      <section className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 p-4 mt-10">
        {Children.map(children, child =>
          isValidElement(child)
            ? cloneElement(
                child as React.ReactElement<{ onUnpin: (item: Note) => void }>,
                { onUnpin: handleUnpin }
              )
            : child
        )}

        {moreNotes.map((item, i) => (
          <NotesItem
            item={item}
            userId={userId}
            key={item.id}
            refreshPage={refreshPage}
            page={Math.floor(i / 20) + 2}
            onUnpin={refreshPageByCreatedAt}
          /> // Render on client
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
