'use server';

import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/actions/auth';

export async function getFilteredTimeEntries(
  startDate: Date | undefined,
  endDate: Date | undefined,
  categoryId: string | undefined,
  page: number = 1,
  limit: number = 20
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    const skip = (page - 1) * limit;

    const where = {
      userId: session.user.id,
      ...(startDate &&
        endDate && {
          startTime: {
            gte: startDate,
            lte: endDate,
          },
        }),
      ...(categoryId && { categoryId }),
    };

    const [timeEntries, total] = await Promise.all([
      prisma.timeEntry.findMany({
        where,
        include: { category: true },
        orderBy: { startTime: 'desc' },
        take: limit,
        skip,
      }),
      prisma.timeEntry.count({ where }),
    ]);

    return {
      timeEntries,
      total,
      hasMore: total > skip + timeEntries.length,
    };
  } catch (error) {
    console.error('Failed to fetch filtered time entries:', error);
    throw new Error('Failed to fetch filtered time entries');
  }
}

export async function getCategories() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    const categories = await prisma.category.findMany({
      where: { userId: session.user.id },
      orderBy: { name: 'asc' },
    });

    return categories;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw new Error('Failed to fetch categories');
  }
}
