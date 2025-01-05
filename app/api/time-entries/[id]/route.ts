import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/actions/auth';

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Extract user ID from params
  const { id: userId } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the time entry belongs to the user
    const timeEntry = await prisma.timeEntry.findFirst({
      where: {
        id: userId,
        userId: session.user.id,
      },
    });

    if (!timeEntry) {
      return NextResponse.json(
        { error: 'Time entry not found' },
        { status: 404 }
      );
    }

    await prisma.timeEntry.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete time entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete time entry' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Extract user ID from params
  const { id: userId } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, startTime, endTime, categoryId } = body;

    // Verify the time entry belongs to the user
    const timeEntry = await prisma.timeEntry.findFirst({
      where: {
        id: userId,
        userId: session.user.id,
      },
    });

    if (!timeEntry) {
      return NextResponse.json(
        { error: 'Time entry not found' },
        { status: 404 }
      );
    }

    const updatedTimeEntry = await prisma.timeEntry.update({
      where: { id: userId },
      data: {
        title,
        description,
        startTime,
        endTime,
        categoryId,
      },
    });

    return NextResponse.json(updatedTimeEntry);
  } catch (error) {
    console.error('Failed to update time entry:', error);
    return NextResponse.json(
      { error: 'Failed to update time entry' },
      { status: 500 }
    );
  }
}
