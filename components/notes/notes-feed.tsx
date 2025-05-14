'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { getTodo } from '@/app/actions/notes-actions'; // ✅ server action
import { ListingCard } from '@/components/notes/listing-card';
import { getLightModeColor, getDarkModeColor } from '@/common/notes/common';
import { parseFormattedText } from '@/common/notes/formatted-text';
import Image from 'next/image';
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Todo = {
  title: string;
  description: string;
  done: boolean;
  id: string;
  todoColor: string;
  updatedAt: Date;
  lastModifiedBy: string;
  user: { username: string };
  images: {
    id: string;
    url: string;
  }[];
  collaborators: {
    id: string;
    isOwner: boolean;
    user: {
      id: string;
      username: string;
      name: string | null;
      image: string | null;
      email: string;
    };
  }[];
};

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
  const [moreNotes, setMoreNotes] = useState<Todo[]>([]);
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
          <ListingCard
            key={item.id}
            item={item}
            userId={userId}
            className={`relative mb-4 border dark:border-slate-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 break-inside-avoid-column group ${getLightModeColor(
              item.todoColor
            )} ${getDarkModeColor(item.todoColor)}`}
            collabs={item.collaborators}
          >
            <CardHeader className="py-2 px-4">
              {item.images?.map((img: { id: string; url: string }) => (
                <Image
                  src={img.url}
                  key={img.id}
                  alt="Image"
                  width={200}
                  height={200}
                  className="h-full w-full rounded"
                  priority={false}
                />
              ))}
              <CardTitle className="font-bold text-lg break-words">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-4 break-words">
              {parseFormattedText(item.description)}
            </CardContent>
            <CardFooter className="mb-4">
              {item.collaborators
                ?.filter(c => c.user.id !== userId)
                .map(c => (
                  <Avatar
                    key={c.user.id}
                    className="flex items-center justify-center"
                  >
                    <AvatarImage
                      src={c.user.image as string}
                      alt="Avatar"
                      className="cursor-pointer w-7 h-7 rounded-full"
                      width={50}
                      height={50}
                    />
                    <AvatarFallback className="cursor-pointer w-7 h-7 p-2 shadow rounded-full dark:border border-gray-600 text-xs">
                      {c.user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ))}
            </CardFooter>
          </ListingCard>
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
