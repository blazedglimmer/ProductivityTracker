import { prisma } from '@/lib/prisma';
import { CategorySchema } from '@/lib/validations/category';

export async function createCategory(userId: string, formData: FormData) {
  const validatedFields = CategorySchema.safeParse({
    name: formData.get('name'),
    color: formData.get('color'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, color } = validatedFields.data;

  try {
    await prisma.category.create({
      data: {
        name,
        color,
        userId,
      },
    });
  } catch (error) {
    console.error({ error });
    return {
      error: 'Failed to create category',
    };
  }
}
