'use client';

import { useState, useEffect } from 'react';
import { TimeEntry } from '@/types';
import { fetchTimeEntries } from '@/lib/api';
import { toast } from 'sonner';

export function useTimeEntries() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTimeEntries();
  }, []);

  async function loadTimeEntries() {
    try {
      const entries = await fetchTimeEntries();
      setTimeEntries(entries);
    } catch (error) {
      console.error({ error });
      toast.error('Failed to load time entries');
    } finally {
      setIsLoading(false);
    }
  }

  return {
    timeEntries,
    setTimeEntries,
    isLoading,
    refresh: loadTimeEntries,
  };
}
