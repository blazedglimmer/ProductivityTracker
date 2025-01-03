import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { signIn } from 'next-auth/react';

const UserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const CategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  color: z.string().min(1, 'Color is required'),
});

const TimeEntrySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startTime: z.date(),
  endTime: z.date(),
  categoryId: z.string().min(1, 'Category is required'),
});

export async function register(formData: FormData) {
  const validatedFields = UserSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        error: 'Email already exists',
      };
    }

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    redirect('/login');
  } catch (error) {
    console.error({ error });
    return {
      error: 'Something went wrong',
    };
  }
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await signIn('credentials', {
      email,
      password,
      callbackUrl: '/',
    });
  } catch (error) {
    if ((error as Error).message.includes('CredentialsSignin')) {
      return {
        error: 'Invalid credentials',
      };
    }
    throw error;
  }
}

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
