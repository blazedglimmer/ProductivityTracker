'use server';
import { cache } from 'react';
import { fetchUserDetails } from '@/app/actions/user-details';
export const GetUserDetails = cache(async (userId: string) => {
  const response = await fetchUserDetails(userId);
  return response;
});
