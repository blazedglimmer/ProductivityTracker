import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/actions/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const timeEntries = await prisma.timeEntry.findMany({
      where: { userId: session.user.id },
      include: { category: true },
      orderBy: { startTime: 'desc' },
    });

    return NextResponse.json(timeEntries);
  } catch (error) {
    console.error('Failed to fetch time entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch time entries' },
      { status: 500 }
    );
  }
}
