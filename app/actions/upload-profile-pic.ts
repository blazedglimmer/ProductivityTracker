'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { deleteOldProfilePic } from './delete-old-profile-pic';

export async function updateProfilePic(userId: string, profilePicUrl: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const oldProfilePicPublicId = user?.image?.split('/').pop()?.split('.')[0]; //These two above lines are for deletion of old profile pic, since we are not maintaining the old pic

    await prisma.user.update({
      where: { id: userId },
      data: { image: profilePicUrl },
    });
    // Delete old profile picture, Remove Line number 9, 10 and 20 in future, if we are storing old pic as well
    if (oldProfilePicPublicId) {
      await deleteOldProfilePic(oldProfilePicPublicId);
    }
    revalidatePath('/profile');
    return { success: true };
  } catch (error) {
    console.error('Failed to update profile picture:', error);
    return { success: false, error: String(error) };
  }
}
