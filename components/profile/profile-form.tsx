'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { updateProfile, updateProfileImage } from '@/lib/actions/profile';
import { toast } from 'sonner';
import { Camera } from 'lucide-react';

interface ProfileFormProps {
  profile: {
    id: string;
    name: string | null;
    email: string;
    username: string | null;
    phone: string | null;
    image: string | null;
  };
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(profile.image);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const result = await updateProfile(formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="space-y-6 mr-[28px] py-10 px-4 mt-4">
      <div className="flex flex-col items-center gap-6 mb-8">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={imageUrl || undefined} />
            <AvatarFallback className="text-2xl">
              {profile.name?.charAt(0) || profile.email.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="profile-image"
            onChange={async e => {
              const file = e.target.files?.[0];
              if (!file) return;

              try {
                const timestamp = Math.round(new Date().getTime() / 1000);
                const paramsToSign = {
                  timestamp,
                  folder: 'profile-images',
                };

                const signatureResponse = await fetch(
                  '/api/cloudinary/signature',
                  {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paramsToSign }),
                  }
                );

                const { signature } = await signatureResponse.json();

                const formData = new FormData();
                formData.append('file', file);
                formData.append(
                  'api_key',
                  process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!
                );
                formData.append('timestamp', timestamp.toString());
                formData.append('signature', signature);
                formData.append('folder', 'profile-images');

                const uploadResponse = await fetch(
                  `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                  {
                    method: 'POST',
                    body: formData,
                  }
                );

                const uploadResult = await uploadResponse.json();

                if (uploadResult.error) {
                  toast.error('Failed to upload image');
                  return;
                }

                const imageFormData = new FormData();
                imageFormData.append('file', uploadResult.secure_url);
                const updateResult = await updateProfileImage(imageFormData);

                if (updateResult.error) {
                  toast.error(updateResult.error);
                  return;
                }

                if (updateResult.image) {
                  setImageUrl(updateResult.image);
                  toast.success('Profile picture updated');
                }
              } catch (error) {
                console.error('Error uploading image:', error);
                toast.error('Failed to upload image');
              }
            }}
          />
          <label
            htmlFor="profile-image"
            className="absolute bottom-0 right-0 p-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
          >
            <Camera className="h-4 w-4" />
          </label>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={profile.name || ''}
            placeholder="Enter your full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            defaultValue={profile.email}
            disabled
          />
          <p className="text-sm text-muted-foreground">
            Email cannot be changed
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            defaultValue={profile.username || ''}
            placeholder="Choose a username"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={profile.phone || ''}
            placeholder="Enter your phone number"
            maxLength={12}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Card>
  );
}
