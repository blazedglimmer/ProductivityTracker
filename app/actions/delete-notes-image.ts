'use server';
import { prisma } from '@/lib/prisma';
import { cloudinary } from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';

export async function deleteImage(imageId: string) {
  try {
    // Find the image in the database
    const image = await prisma.image.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return { success: false, message: 'Image not found' };
    }

    // Delete the image from Cloudinary
    const publicId = image.url.split('/').pop()?.split('.')[0]; // Extract public ID from URL
    await cloudinary.uploader.destroy(`todo-images/${publicId}`);

    // Delete the image record from the database
    await prisma.image.delete({
      where: { id: imageId },
    });

    revalidatePath('/');
    return { success: true, message: 'Image deleted successfully' };
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, message: error };
  }
}
