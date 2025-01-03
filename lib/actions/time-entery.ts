import { prisma } from '@/lib/prisma';
import { TimeEntrySchema } from '@/lib/validations/time-entry';

export async function createTimeEntry(userId: string, formData: FormData) {
  const validatedFields = TimeEntrySchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    startTime: new Date(formData.get('startTime') as string),
    endTime: new Date(formData.get('endTime') as string),
    categoryId: formData.get('categoryId'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { title, description, startTime, endTime, categoryId } =
    validatedFields.data;

  try {
    await prisma.timeEntry.create({
      data: {
        title,
        description,
        startTime,
        endTime,
        categoryId,
        userId,
      },
    });
  } catch (error) {
    console.error({ error });
    return {
      error: 'Failed to create time entry',
    };
  }
}
