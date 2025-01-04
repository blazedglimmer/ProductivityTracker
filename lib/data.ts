'user serer';

import { prisma } from '@/lib/prisma';

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function getUserCategories(userId: string) {
  try {
    const categories = await prisma.category.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return categories;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw new Error('Failed to fetch categories.');
  }
}

export async function getUserTimeEntries(userId: string) {
  try {
    const timeEntries = await prisma.timeEntry.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { startTime: 'desc' },
    });
    return timeEntries;
  } catch (error) {
    console.error('Failed to fetch time entries:', error);
    throw new Error('Failed to fetch time entries.');
  }
}
