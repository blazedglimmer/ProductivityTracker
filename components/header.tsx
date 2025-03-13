'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/user-nav';
import { ModeToggle } from '@/components/mode-toggle';
import { User } from '@/types';

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (pathname === '/signin' || pathname === '/signup') return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center gap-2 mr-8">
          <Timer className="h-6 w-6" />
          <span className="font-bold hidden sm:inline-block">FlowSync</span>
        </Link>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex justify-end space-x-2">
            {session ? (
              <UserNav user={session.user as User} />
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/signin">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign up</Button>
                </Link>
              </div>
            )}
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
