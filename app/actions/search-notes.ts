'use server';
import { prisma } from '@/lib/prisma';

export async function searchNotes(
  query: string,
  userId: string
): Promise<{
  success: boolean;
  error: unknown;
  message: string;
  data: {
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
  }[];
}> {
  try {
    const results = await prisma.todo.findMany({
      where: {
        AND: [
          {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          },
          {
            OR: [
              { userId }, // Notes owned by the user
              {
                collaborators: {
                  some: { userId }, // Notes where the user is a collaborator
                },
              },
            ],
          },
        ],
      },
      select: {
        title: true,
        description: true,
        done: true,
        id: true,
        todoColor: true,
        updatedAt: true,
        lastModifiedBy: true,
        user: {
          select: {
            username: true,
          },
        },
        images: {
          select: {
            url: true,
            id: true,
          },
        },
      },
    });

    return {
      success: true,
      //   data: results,
      data: results.map(result => ({
        ...result,
        user: {
          ...result.user,
          username: result.user.username ?? 'Unknown', // Provide a default value for null
        },
      })),
      error: false,
      message: 'Data fetched successfully.',
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      message: 'Error fetching notes.',
      error,
    };
  }
}
