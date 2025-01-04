import { Category, TimeEntry } from '@/types';

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch('/api/categories');
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
}

export async function fetchTimeEntries(): Promise<TimeEntry[]> {
  const response = await fetch('/api/time-entries');
  if (!response.ok) {
    throw new Error('Failed to fetch time entries');
  }
  return response.json();
}
