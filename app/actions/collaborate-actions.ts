'use server';
import { prisma } from '@/lib/prisma';
import { Collaborator, User } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function addCollaborator(
  todoId: string,
  username: string,
  isOwner: boolean = false
): Promise<{ success: boolean; message: string; data?: Collaborator }> {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const existingCollaboration = await prisma.collaborator.findUnique({
      where: {
        userId_todoId: {
          userId: user.id,
          todoId,
        },
      },
    });

    if (existingCollaboration) {
      throw new Error('User is already a collaborator');
    }

    const result = await prisma.collaborator.create({
      data: {
        userId: user.id,
        todoId,
        isOwner,
      },
    });

    revalidatePath('/');
    return {
      success: true,
      message: 'Collaborator added successfully',
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'error while fetching collaborator data',
    };
  }
}

export async function removeCollaborator(
  todoId: string,
  userId: string
): Promise<{
  success: boolean;
  message: string;
  data?: { count: number };
}> {
  try {
    const collaborator = await prisma.collaborator.findUnique({
      where: {
        userId_todoId: {
          userId,
          todoId,
        },
      },
    });

    if (collaborator?.isOwner) {
      throw new Error('Cannot remove the owner from the todo'); //Even tho we will be handling this thru front end, and this was still server action so can be skipped but we still added this check
    }

    const result = await prisma.collaborator.deleteMany({
      where: {
        todoId,
        userId,
      },
    });

    revalidatePath('/');
    return {
      success: true,
      message: 'Collaborator removed successfully',
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'error while removing the collaborator',
    };
  }
}

export async function getCollaborators(todoId: string): Promise<{
  success: boolean;
  message?: string;
  data?: (Collaborator & { user: User })[];
}> {
  try {
    const collaborators = await prisma.collaborator.findMany({
      where: { todoId },
      include: { user: true },
    });

    return { success: true, data: collaborators };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : `error while fetching the collaborator's data`,
    };
  }
}
