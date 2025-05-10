'use server';

import { prisma } from '@/lib/prisma';
import { User } from '@prisma/client';

export async function fetchUserDetails(userId: string): Promise<{
  success: boolean;
  error: boolean;
  message: string;
  data?: User | [];
}> {
  if (!userId) {
    return {
      success: false,
      error: true,
      message: 'User id is required',
    };
  }

  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return {
    success: true,
    data: data || [],
    message: 'User details fetched successfully',
    error: false,
  };
}
