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

    const { name } = await request.json();

    const existingCategory = await prisma.category.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        userId: session.user.id,
      },
    });

    return NextResponse.json({ exists: !!existingCategory });
  } catch (error) {
    console.error('Failed to check category:', error);
    return NextResponse.json(
      { error: 'Failed to check category' },
      { status: 500 }
    );
  }
}
