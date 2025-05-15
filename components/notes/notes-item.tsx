import {
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { ListingCard } from '@/components/notes/listing-card';
import Image from 'next/image';
import { getLightModeColor, getDarkModeColor } from '@/common/notes/common';
import { parseFormattedText } from '@/common/notes/formatted-text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Note } from '@/types';

export const NotesItem = ({ item, userId }: { item: Note; userId: string }) => (
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
          <Avatar key={c.user.id} className="flex items-center justify-center">
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
);
