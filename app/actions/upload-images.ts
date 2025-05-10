'use server';

import { cloudinary } from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function uploadImages(formData: FormData, todoId: string) {
  try {
    const files: File[] = formData.getAll('files') as unknown as File[];

    const uploadedImages = [];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const secure_url = await new Promise<string>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: 'todo-images' }, (error, result) => {
            if (error) reject(error);
            else resolve(result?.secure_url || '');
          })
          .end(buffer);
      });

      const image = await prisma.image.create({
        data: {
          url: secure_url,
          todoId,
        },
      });

      uploadedImages.push(image);
    }
    revalidatePath('/');
    return { success: true, images: uploadedImages };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
