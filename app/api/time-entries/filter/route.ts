import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/actions/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      startDate,
      endDate,
      categoryId,
      page = 1,
      limit = 20,
    } = await request.json();

    const skip = (page - 1) * limit;

    const where = {
      userId: session.user.id,
      ...(startDate &&
        endDate && {
          startTime: {
            gte: new Date(startDate),
            lte: new Date(endDate),
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

    return NextResponse.json({
      timeEntries,
      total,
      hasMore: total > skip + timeEntries.length,
    });
  } catch (error) {
    console.error('Failed to fetch filtered time entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filtered time entries' },
      { status: 500 }
    );
  }
}
