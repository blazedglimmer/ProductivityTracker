import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/actions/auth';

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: friendId } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if they are friends
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          {
            requesterId: session.user.id,
            addresseeId: friendId,
            status: 'ACCEPTED',
          },
          {
            requesterId: friendId,
            addresseeId: session.user.id,
            status: 'ACCEPTED',
          },
        ],
      },
    });

    if (!friendship) {
      return NextResponse.json(
        { error: "Not authorized to view this user's activities" },
        { status: 403 }
      );
    }

    // Get friend's time entries with categories
    const timeEntries = await prisma.timeEntry.findMany({
      where: {
        userId: friendId,
      },
      include: {
        category: true,
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    return NextResponse.json(timeEntries);
  } catch (error) {
    console.error("Failed to fetch friend's activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch friend's activities" },
      { status: 500 }
    );
  }
}
