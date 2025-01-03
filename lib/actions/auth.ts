import { redirect } from 'next/navigation';
import { signIn } from 'next-auth/react';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { UserSchema } from '@/lib/validations/auth';

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
      callbackUrl: '/dashboard',
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
