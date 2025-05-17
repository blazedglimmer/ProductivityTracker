'use client';

import { FormEvent, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from '@/components/ui/dialog';
import { CircleUser, Crown } from 'lucide-react';
import { CollaboratorWithUser } from '@/types/notes';
import { Button } from '@/components/ui/button';
import {
  addCollaborator,
  removeCollaborator,
} from '@/app/actions/collaborate-actions';
import { toast } from 'sonner';

interface CollaborationProps {
  collabs: CollaboratorWithUser[];
  todoId: string;
  refreshPage?: (page: number) => void;
  page?: number;
}

export const Collaboration: React.FC<CollaborationProps> = ({
  collabs,
  todoId,
  refreshPage,
  page,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const collaborator = formData.get('collaborator') as string;
    if (collaborator) {
      try {
        const result = await addCollaborator(todoId, collaborator);
        if (result.success) {
          toast.success('Success', {
            description: result.message,
          });
          if (page) {
            refreshPage?.(page);
          }
        } else {
          toast.error('Uh oh! Something went wrong.', {
            description: result.message,
          });
        }
      } catch (error) {
        console.error('Error adding collaborator:', error);
        toast.error('Uh oh! Something went wrong.', {
          description:
            error instanceof Error
              ? error.message
              : 'An error occurred while adding the collaborator.',
        });
      }
    }
  };

  const handleRemove = async (collaboratorId: string) => {
    try {
      const result = await removeCollaborator(todoId, collaboratorId);
      if (result.success) {
        toast.success('Success', {
          description: result.message,
        });
        if (page) {
          refreshPage?.(page);
        }
      } else {
        toast.error('Uh oh! Something went wrong.', {
          description: result.message,
        });
      }
    } catch (error) {
      console.error('Error removing collaborator:', error);
      toast.error('Uh oh! Something went wrong.', {
        description:
          error instanceof Error
            ? error.message
            : 'An error occurred while adding the collaborator.',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <CircleUser
          size={16}
          onClick={e => {
            e.stopPropagation();
            setIsOpen(true);
          }}
          className="cursor-pointer"
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Collaborators</DialogTitle>
          <DialogDescription className="sr-only">
            {' '}
            Manage collaborators on the notes - add or remove{' '}
          </DialogDescription>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="collaborator"
              id="collaborator"
              placeholder="Add collaborator by username or email"
              className="w-full p-2 border rounded"
            />
            <Button type="submit">Add Collaborator</Button>
          </form>
          <ul className="mt-4 space-y-2">
            {collabs?.map(item => (
              <li
                key={item.user.id}
                className="flex justify-between items-center"
              >
                <span>
                  {item.user.name} ({item.user.username})
                </span>
                {!item.isOwner && (
                  <Button
                    onClick={() => handleRemove(item.user.id)}
                    variant="destructive"
                    size="sm"
                  >
                    Remove
                  </Button>
                )}
                {item.isOwner && (
                  <span className="flex items-center justify-center gap-2">
                    (Owner)
                    <Crown size={20} />
                  </span>
                )}
              </li>
            ))}
          </ul>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
