import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

export function useTimeTracking() {
  const store = useStore();
  const { fetchCategories, fetchTimeEntries, categories, timeEntries, error } =
    store;

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
    if (timeEntries.length === 0) {
      fetchTimeEntries();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return store;
}
