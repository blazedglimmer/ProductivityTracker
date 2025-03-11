'use client';

import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card className="p-6">
        <div className="flex flex-col items-center gap-6 mb-8">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="text-2xl">
              {session.user?.name?.charAt(0) || session.user?.email?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <Button>Change Avatar</Button>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              defaultValue={session.user?.name || ''}
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              defaultValue={session.user?.email || ''}
              disabled
            />
            <p className="text-sm text-muted-foreground">
              Email cannot be changed
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="Choose a username" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
            />
          </div>

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
}
