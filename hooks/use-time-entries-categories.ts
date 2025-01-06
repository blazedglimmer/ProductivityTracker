'use client';

import { useState, useEffect } from 'react';
import { Category, TimeEntry } from '@/types';
import { fetchCategories, fetchTimeEntries } from '@/lib/api';
import { toast } from 'sonner';

export function useTimeEntriesCategories() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [entries, cats] = await Promise.all([
          fetchTimeEntries(),
          fetchCategories(),
        ]);
        setTimeEntries(entries);
        setCategories(cats);
      } catch (error) {
        console.error({ error });
        toast.error('Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return {
    timeEntries,
    setTimeEntries,
    categories,
    setCategories,
    isLoading,
  };
}
