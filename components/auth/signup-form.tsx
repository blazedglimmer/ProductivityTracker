'use client';
import { useState } from 'react';
import type React from 'react';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  ArrowRight,
  Github,
  Loader2,
  Mail,
  User,
  UserPlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { signIn } from 'next-auth/react';

export function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to register');
      }

      toast.success('Account created successfully!');
      router.push('/signin');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong'
      );
    } finally {
      setIsLoading(false);
    }
  }

  const handleGithubSignUp = async () => {
    setIsGithubLoading(true);
    try {
      await signIn('github', { callbackUrl: '/' });
    } catch (error) {
      console.error('GitHub sign-up failed:', error);
      toast.error('Failed to sign up with GitHub');
    } finally {
      setIsGithubLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Decorative elements */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary/10 rounded-full blur-xl" />

      <Card className="w-full border-none shadow-lg bg-card/50 backdrop-blur-sm">
        <div className="px-6 pt-8 pb-2">
          <div className="mb-6 flex flex-col items-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <UserPlus className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your information to get started
            </p>
          </div>

          <div className="grid gap-4">
            <Button
              variant="outline"
              className="relative overflow-hidden group border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              onClick={handleGithubSignUp}
              disabled={isGithubLoading}
            >
              {isGithubLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Github className="mr-2 h-4 w-4" />
              )}
              Sign up with GitHub
              <span className="absolute bottom-0 left-0 h-1 w-0 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit}>
          <CardContent className="space-y-8 px-6">
            <div className="space-y-2">
              <div className="relative">
                <Label
                  htmlFor="name"
                  className={cn(
                    'absolute left-3 top-2 text-muted-foreground transition-all duration-200',
                    name && 'text-xs -translate-y-8 text-primary'
                  )}
                >
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  className="pt-6 pb-2 px-3 h-14 bg-muted/40 border-muted focus-visible:ring-primary"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
                <User className="absolute right-3 top-4 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Label
                  htmlFor="email"
                  className={cn(
                    'absolute left-3 top-2 text-muted-foreground transition-all duration-200',
                    email && 'text-xs -translate-y-8 text-primary'
                  )}
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="pt-6 pb-2 px-3 h-14 bg-muted/40 border-muted focus-visible:ring-primary"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <Mail className="absolute right-3 top-4 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Label
                  htmlFor="password"
                  className={cn(
                    'absolute left-3 top-2 text-muted-foreground transition-all duration-200',
                    password && 'text-xs -translate-y-8 text-primary'
                  )}
                >
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  className="pt-6 pb-2 px-3 h-14 bg-muted/40 border-muted focus-visible:ring-primary"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col px-6 pb-8">
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 group"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </Button>
            <p className="mt-4 text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/signin"
                className="text-primary font-medium hover:underline transition-all"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
