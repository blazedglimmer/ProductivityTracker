'use server';
import { getTodo } from '@/app/actions/notes-actions';
import { parseFormattedText } from '@/common/notes/formatted-text';
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { ListingCard } from '@/components/notes/listing-card';
import Image from 'next/image';
import { getLightModeColor, getDarkModeColor } from '@/common/notes/common';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const GetNotes = async ({
  userId,
  page,
}: {
  userId: string;
  page?: string;
}) => {
  const {
    todo,
    error,
    // currentPage, totalPages, totalCount,
    message,
  } = await getTodo(userId, page ? Number(page) : 1, 25);

  if (error) {
    <span> Error while fetching todos {message}</span>;
  }

  return (
    <section className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 p-4 mt-10">
      {todo?.map(item => (
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
            {item.images?.map((item: { id: string; url: string }) => (
              <Image
                src={item.url}
                key={item.id}
                alt="Image"
                width={200}
                height={200}
                className="h-full w-full rounded"
                priority={true}
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
              ?.filter(item => item.user.id !== userId)
              .map(item => (
                <Avatar
                  key={item.user.id}
                  className="flex items-center justify-center"
                >
                  <AvatarImage
                    src={item.user.image as string}
                    alt="AS"
                    className="cursor-pointer w-7 h-7 rounded-full"
                    width={50}
                    height={50}
                  />
                  <AvatarFallback className="cursor-pointer w-7 h-7 p-2 shadow rounded-full dark:border border-gray-600 text-xs">
                    {item.user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ))}
          </CardFooter>
        </ListingCard>
      ))}
    </section>
  );
};

export default GetNotes;
