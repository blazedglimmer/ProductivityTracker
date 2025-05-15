'use client';
import Image from 'next/image';
import { RefObject, useRef } from 'react';

import { useOutsideClick } from '@/hooks/use-outside-click';
import { toast } from 'sonner';
import { handleKeyDown, autoResizeTextarea } from '@/common/notes/utility';
import { ImageUploadButton } from '@/components/upload-image';
import { Collaboration } from '@/components/notes/collaboration';
import { ColorPalette } from '@/components/notes/color-palette';
import { deleteImage } from '@/app/actions/delete-notes-image';
import { createTodo, updateTodo } from '@/app/actions/notes-actions';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useColorPalette } from '@/hooks/use-color-palette';
import {
  EllipsisVertical,
  // CircleCheck,   // Uncomment when we build the feature for it
  Palette,
  PinIcon as Pin,
  Trash2,
  CircleX,
} from 'lucide-react';
import { useIsomorphicLayoutEffect } from '@/hooks/use-isomorphic-layout-effect';
import {
  getLightModeColor,
  getDarkModeColor,
  secondFormatDate,
} from '@/common/notes/common';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CollaboratorWithUser } from '@/types/notes';
import { DeleteNotes } from '@/components/notes/delete-notes';
import { VersionHistory } from '@/components/notes/version-history';
import { Note } from '@/types';

type ImageProps = {
  url: string;
  id: string;
};

export const ListingCard = ({
  item,
  children,
  className,
  userId,
  collabs,
  refreshPage,
  page,
}: {
  item: Note;
  children: React.ReactNode;
  className: string;
  userId: string;
  collabs: CollaboratorWithUser[];
  refreshPage?: (page: number) => void;
  page?: number;
}) => {
  const {
    isOpened,
    setIsOpened,
    bgColors,
    bgColor,
    setBgColor,
    colorPaletteRef,
  } = useColorPalette();

  const formRef = useRef<HTMLFormElement>(null);

  useOutsideClick(colorPaletteRef as RefObject<HTMLElement>, () => {
    setIsOpened(false);
  });

  const handleFormSubmit = () => {
    const formData = new FormData(formRef.current!);

    // Normalize the input values by trimming and removing extra spaces and newlines
    const normalize = (value: string | null) =>
      value ? value.trim().replace(/\s+/g, ' ') : '';

    const currentTitle = normalize(formData.get('title')?.toString() || '');
    const currentDescription = normalize(
      formData.get('description')?.toString() || ''
    );

    const originalTitle = normalize(item.title);
    const originalDescription = normalize(item.description);

    if (
      currentTitle !== originalTitle ||
      currentDescription !== originalDescription ||
      bgColor
    ) {
      action(formData);
    }
  };

  const handleDelete = async (
    imageId: string,
    e: React.SyntheticEvent<HTMLDivElement>
  ) => {
    e.stopPropagation();
    const result = await deleteImage(imageId);
    if (result.success) {
      toast.success('Image deleted successfully');
    } else {
      toast.error('Something went wrong! Please try again');
    }
  };

  async function copyNotes(formData: FormData) {
    const res = await createTodo(formData, userId, bgColor);
    if (res.error) {
      toast.error('Uh oh! Something went wrong.', { description: res.message });
    } else {
      toast.success('Success', { description: res.message });
    }
  }

  async function action(formData: FormData, pinned?: boolean) {
    const loadingToastId = toast.loading('Updating note...', {
      description: 'Please wait while we update your note.',
      position: 'top-center',
    });
    const res = await updateTodo(
      item.id,
      formData,
      userId,
      bgColor ? bgColor : item.todoColor,
      pinned !== undefined ? pinned : item.pinned
    );
    formRef.current?.reset();
    if (res.error) {
      toast.error('Uh oh! Something went wrong.', { description: res.message });
    } else {
      toast.success('Success', { description: res.message });
      if (page) {
        refreshPage?.(page);
      }
    }
    toast.dismiss(loadingToastId);
  }

  useIsomorphicLayoutEffect(() => {
    if (bgColor && item.todoColor !== bgColor) {
      const formData = new FormData();
      formData.append('title', item.title);
      formData.append('description', item.description);
      action(formData);
      setBgColor('');
    }
  }, [bgColor]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card key={item.id} className={className + ' group'}>
          {children}
          <div className="flex items-center gap-6 absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Palette
              size={16}
              onClick={e => {
                e.preventDefault();
                setIsOpened(true);
              }}
              className="cursor-pointer"
            />
            <ImageUploadButton todoId={item.id} />
            <Collaboration collabs={collabs} todoId={item.id} />
            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisVertical size={16} className="cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <DeleteNotes id={item.id} userId={userId} />
                </DropdownMenuItem>
                <DropdownMenuItem>Add drawing</DropdownMenuItem>
                <DropdownMenuItem>Add label</DropdownMenuItem>
                <DropdownMenuItem>Show tick boxes</DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={e => {
                    e.stopPropagation();
                    const formData = new FormData();
                    formData.append('title', item.title);
                    formData.append('description', item.description);
                    copyNotes(formData);
                  }}
                >
                  Make a copy
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <VersionHistory id={item.id} />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* <div className="absolute top-[-10] left-[-10] opacity-0 group-hover:opacity-100 transition-opacity">
            <CircleCheck size={24} fill="#ffffff" stroke="#000000" />
          </div> */}
          <div
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={e => {
              e.stopPropagation();
              const formData = new FormData();
              formData.append('title', item.title);
              formData.append('description', item.description);
              action(formData, !item.pinned);
            }}
          >
            {item.pinned ? (
              <Pin size={16} fill="#ffffff" stroke="#000000" />
            ) : (
              <Pin size={16} fill="none" stroke="#FEFEFE" />
            )}
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent
        className={`mb-4 max-h-screen border border-slate-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 break-inside-avoid-column ${getLightModeColor(
          item.todoColor
        )} ${getDarkModeColor(item.todoColor)}`}
        onInteractOutside={handleFormSubmit}
        onEscapeKeyDown={handleFormSubmit}
      >
        <DialogHeader>
          {item.images?.map((item: ImageProps) => (
            <div className="relative group" key={item.id}>
              <Dialog>
                <DialogTrigger asChild>
                  <Image
                    src={item.url}
                    key={item.id}
                    alt="Notes Images"
                    width={400}
                    height={400}
                    className="h-full w-full rounded"
                  />
                </DialogTrigger>
                <DialogContent className="w-screen">
                  <div className="fixed bg-black bg-opacity-75 z-[100] w-screen sm:w-[500] md:w-[600] lg:w-[1000] top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
                    <div className="relative">
                      <Image
                        src={item.url}
                        alt="Notes Image Preview"
                        width={2000}
                        height={2000}
                        className="rounded h-full w-full"
                      />
                      <DialogClose asChild>
                        <CircleX
                          size={24}
                          className="absolute top-2 right-2 bg-opacity-50 cursor-pointer"
                        />
                      </DialogClose>
                    </div>
                  </div>
                  <DialogTitle className="sr-only">
                    {' '}
                    Notes image preview
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    Notes image preview with full display
                  </DialogDescription>
                </DialogContent>
              </Dialog>
              <div
                className="opacity-0 absolute right-2 bottom-2 bg-slate-400 p-2 rounded overflow-hidden transition-opacity duration-700 ease-in-out group-hover:opacity-70 cursor-pointer"
                onClick={e => handleDelete(item.id, e)}
              >
                <Trash2 size={16} />
              </div>
            </div>
          ))}
          <DialogDescription className="sr-only">
            Make changes to your notes here.
          </DialogDescription>
          <form ref={formRef}>
            <DialogTitle>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Title"
                required
                defaultValue={item.title}
                className={`w-full p-2 shadow-sm rounded-md dark:border-b border-slate-700 mb-2 outline-none ${getLightModeColor(
                  item.todoColor
                )} ${getDarkModeColor(item.todoColor)}`}
              />
            </DialogTitle>

            <textarea
              name="description"
              placeholder="Take a note..."
              id="description"
              rows={1}
              required
              autoFocus
              defaultValue={item.description}
              className={`w-full max-h-96 overflow-x-scroll p-2 shadow-sm rounded-md dark:border-b border-slate-700 mb-2 outline-none resize-none ${getLightModeColor(
                item.todoColor
              )} ${getDarkModeColor(item.todoColor)}`}
              onKeyDown={handleKeyDown}
              onFocus={e =>
                autoResizeTextarea(e.currentTarget as HTMLTextAreaElement)
              }
              onInput={e =>
                autoResizeTextarea(e.currentTarget as HTMLTextAreaElement)
              }
            />
          </form>
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-wrap">
              {collabs
                ?.filter(item => item.user.id !== userId)
                .map(item => (
                  <Avatar key={item.user.id} className="flex items-center">
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
            </div>
            <div className="text-gray-400 text-xs">
              {secondFormatDate(item.updatedAt)}
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <div className="flex items-center gap-6 absolute bottom-4 left-4">
            <Dialog>
              <DialogTrigger asChild>
                <Palette size={16} className="cursor-pointer" />
              </DialogTrigger>

              <DialogContent className="bg-transparent border-none">
                <DialogTitle className="sr-only">Color Palette</DialogTitle>
                <DialogDescription className="sr-only">
                  Color Palette inside the card
                </DialogDescription>
                <ColorPalette
                  className={`md:w-full md:h-24 md:py-4 top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]`}
                  colorPaletteRef={colorPaletteRef as RefObject<HTMLDivElement>}
                  bgColors={bgColors}
                  setBgColor={setBgColor}
                />
              </DialogContent>
            </Dialog>
            <ImageUploadButton todoId={item.id} />
            <Collaboration collabs={collabs} todoId={item.id} />
            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisVertical size={16} className="cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <DeleteNotes id={item.id} userId={userId} />
                </DropdownMenuItem>
                <DropdownMenuItem>Add drawing</DropdownMenuItem>
                <DropdownMenuItem>Add label</DropdownMenuItem>
                <DropdownMenuItem>Show tick boxes</DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={e => {
                    e.stopPropagation();
                    const formData = new FormData();
                    formData.append('title', item.title);
                    formData.append('description', item.description);
                    copyNotes(formData);
                  }}
                >
                  Make a copy
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <VersionHistory id={item.id} />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* <div className="absolute top-2 left-2">
            <Pin size={24} />
          </div> */}
          <DialogClose className="hidden">Close</DialogClose>
        </DialogFooter>
      </DialogContent>
      {isOpened && (
        <ColorPalette
          colorPaletteRef={colorPaletteRef as RefObject<HTMLDivElement>}
          bgColors={bgColors}
          setBgColor={setBgColor}
        />
      )}
    </Dialog>
  );
};
