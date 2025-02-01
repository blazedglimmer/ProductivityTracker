import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/actions/auth';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: userId } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await request.json();

    const friendRequest = await prisma.friendship.findUnique({
      where: { id: userId },
      include: { requester: true, addressee: true },
    });

    if (!friendRequest) {
      return NextResponse.json(
        { error: 'Friend request not found' },
        { status: 404 }
      );
    }

    if (friendRequest.addresseeId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedRequest = await prisma.friendship.update({
      where: { id: userId },
      data: { status },
      include: { requester: true, addressee: true },
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error('Failed to update friend request:', error);
    return NextResponse.json(
      { error: 'Failed to update friend request' },
      { status: 500 }
    );
  }
}

// include: {
//     requester: {
//       select: {
//         id: true,
//         name: true,
//         username: true,
//       },
//     },
//     addressee: {
//       select: {
//         id: true,
//         name: true,
//         username: true,
//       },
//     },
//   },
