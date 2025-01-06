import { Category, TimeEntry } from '@/types';

export interface TimeTrackingState {
  categories: Category[];
  timeEntries: TimeEntry[];
  isLoading: boolean;
  error: string | null;
}

export interface TimeTrackingActions {
  // Category actions
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, category: Category) => void;
  deleteCategory: (id: string) => void;

  // Time entry actions
  setTimeEntries: (entries: TimeEntry[]) => void;
  addTimeEntry: (entry: TimeEntry) => void;
  updateTimeEntry: (id: string, entry: TimeEntry) => void;
  deleteTimeEntry: (id: string) => void;

  // Data fetching
  fetchCategories: () => Promise<void>;
  fetchTimeEntries: () => Promise<void>;

  // Status management
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}
