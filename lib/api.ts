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

export async function checkCategoryExists(name: string): Promise<boolean> {
  const response = await fetch('/api/categories/exists', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error('Failed to check category');
  }

  const data = await response.json();
  return data.exists;
}

export async function deleteCategory(id: string): Promise<void> {
  const response = await fetch(`/api/categories/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete category');
  }
}

export async function updateCategory(
  id: string,
  data: { name: string; color: string }
): Promise<void> {
  const response = await fetch(`/api/categories/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update category');
  }
}

export async function deleteTimeEntry(id: string): Promise<void> {
  const response = await fetch(`/api/time-entries/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete time entry');
  }
}

export async function updateTimeEntry(
  id: string,
  data: {
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    categoryId: string;
  }
): Promise<void> {
  const response = await fetch(`/api/time-entries/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update time entry');
  }
}
