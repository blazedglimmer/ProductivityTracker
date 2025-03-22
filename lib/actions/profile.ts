'use server';

import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/actions/auth';
import { cloudinary } from '@/lib/cloudinary';
import { ProfileSchema } from '@/lib/validations/profile';
import { revalidatePath } from 'next/cache';
import type { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

export async function getProfile() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        phone: true,
        image: true,
      },
    });

    return user;
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    throw new Error('Failed to fetch profile');
  }
}

export async function updateProfile(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { error: 'Unauthorized' };
    }

    const validatedFields = ProfileSchema.safeParse({
      name: formData.get('name'),
      username: formData.get('username'),
      phone: formData.get('phone'),
    });

    if (!validatedFields.success) {
      return {
        error: 'Invalid input',
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { name, username, phone } = validatedFields.data;

    // Check if username is already taken
    if (username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username,
          NOT: { id: session.user.id },
        },
      });

      if (existingUser) {
        return { error: 'Username already taken' };
      }
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { name, username, phone },
    });

    revalidatePath('/profile');
    return { success: true };
  } catch (error) {
    console.error('Failed to update profile:', error);
    return { error: 'Failed to update profile' };
  }
}

export async function updateProfileImage(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { error: 'Unauthorized' };
    }

    const file = formData.get('file') as File;
    if (!file) {
      return { error: 'No file provided' };
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'flow-sync/avatars',
            public_id: `user-${session.user.id}`,
            overwrite: true,
            resource_type: 'auto',
          },
          (
            err: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined
          ) => {
            if (err) reject(err);
            if (!result) reject(new Error('Upload failed'));
            resolve(result as UploadApiResponse);
          }
        )
        .end(buffer);
    });

    // Update user profile with new image URL
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        image: result.secure_url,
      },
    });

    revalidatePath('/profile');
    return { success: true, image: result.secure_url };
  } catch (error) {
    console.error('Failed to update profile image:', error);
    return { error: 'Failed to update profile image' };
  }
}
