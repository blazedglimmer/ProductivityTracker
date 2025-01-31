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

    const friends = await prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: session.user.id },
          { addresseeId: session.user.id },
        ],
        status: 'ACCEPTED',
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        addressee: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    // Transform the data to return just the friend's information
    const transformedFriends = friends.map(friendship => {
      const friend =
        friendship.requesterId === session.user.id
          ? friendship.addressee
          : friendship.requester;
      return friend;
    });

    return NextResponse.json(transformedFriends);
  } catch (error) {
    console.error('Failed to fetch friends:', error);
    return NextResponse.json(
      { error: 'Failed to fetch friends' },
      { status: 500 }
    );
  }
}
