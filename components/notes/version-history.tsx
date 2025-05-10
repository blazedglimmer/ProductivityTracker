'use client';
import { getTodoHistory } from '@/app/actions/notes-actions';
import {
  getDarkModeColor,
  getLightModeColor,
  secondFormatDate,
} from '@/common/notes/common';
import { parseFormattedText } from '@/common/notes/formatted-text';
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
import { CircleX } from 'lucide-react';
import React, { useState } from 'react';

export const VersionHistory = ({ id }: { id: string }) => {
  const [versionData, setVersionData] = useState<
    {
      id: string;
      todoId: string;
      title: string | null;
      description: string | null;
      done: boolean | null;
      todoColor: string | null;
      lastModifiedBy: string;
      createdAt: Date;
      userId: string | null;
    }[]
  >([]);

  return (
    <Dialog>
      <DialogTrigger
        onClick={async e => {
          e.stopPropagation();
          const res = await getTodoHistory(id);
          setVersionData(res);
        }}
      >
        Version history
      </DialogTrigger>
      <DialogContent className="max-h-svh overflow-y-scroll">
        <DialogHeader>
          {versionData.length == 0 && (
            <>
              <DialogTitle>
                There are no previous versions for this note yet.{' '}
              </DialogTitle>
              <DialogDescription className="sr-only"></DialogDescription>
            </>
          )}
        </DialogHeader>
        {versionData.map(item => (
          <DialogHeader
            key={item.id}
            className={`pt-4 text-start rounded-md shadow-md px-6 py-4 ${getLightModeColor(
              item.todoColor || ''
            )} ${getDarkModeColor(item.todoColor || '')} `}
          >
            <DialogTitle>{item.title}</DialogTitle>
            <span className="mt-2">
              {parseFormattedText(item.description || '')}
            </span>
            <span className="text-white bg-slate-600 rounded-md px-2 py-1 text-xs max-w-fit mt-2">
              {' '}
              Modified: {secondFormatDate(item.createdAt)}
            </span>
          </DialogHeader>
        ))}
        <DialogFooter>
          <DialogClose asChild>
            <CircleX
              size={24}
              className="absolute top-2 right-2 bg-opacity-50 cursor-pointer"
            />
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
