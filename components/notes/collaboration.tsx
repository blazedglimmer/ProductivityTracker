'use client';

import React, { FormEvent, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from '@/components/ui/dialog';
import { CircleUser, Crown } from 'lucide-react';
import { Collaborator, User } from '@prisma/client';
import { Button } from '@/components/ui/button';
import {
  addCollaborator,
  removeCollaborator,
} from '@/app/actions/collaborate-actions';
import { useToast } from '@/components/ui/use-toast';

type CollaboratorWithUser = Collaborator & { user: User };

interface CollaborationProps {
  collabs: CollaboratorWithUser[] | undefined;
  todoId: string;
}

export const Collaboration: React.FC<CollaborationProps> = ({
  collabs,
  todoId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const collaborator = formData.get('collaborator') as string;
    if (collaborator) {
      try {
        const result = await addCollaborator(todoId, collaborator);
        toast({
          title: result.success ? 'Success' : 'Error',
          description: result.message,
          variant: result.success ? 'default' : 'destructive',
        });
      } catch (error) {
        console.error('Error adding collaborator:', error);
        toast({
          title: 'Error',
          description: 'something went wrong',
          variant: 'destructive',
        });
      }
    }
  };

  const handleRemove = async (collaboratorId: string) => {
    try {
      const result = await removeCollaborator(todoId, collaboratorId);
      toast({
        title: result.success ? 'Success' : 'Error',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
    } catch (error) {
      console.error('Error removing collaborator:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while removing the collaborator.',
        variant: 'destructive',
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
              placeholder="Add collaborator by username"
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
