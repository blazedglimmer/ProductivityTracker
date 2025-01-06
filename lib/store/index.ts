import { create } from 'zustand';
import { TimeTrackingState, TimeTrackingActions } from './types';
import * as api from '@/lib/api';

export type Store = TimeTrackingState & TimeTrackingActions;

export const useStore = create<Store>((set, get) => ({
  // Initial state
  categories: [],
  timeEntries: [],
  isLoading: false,
  error: null,

  // Status management
  setLoading: isLoading => set({ isLoading }),
  setError: error => set({ error }),

  // Category actions
  setCategories: categories => set({ categories }),
  addCategory: category =>
    set(state => ({
      categories: [...state.categories, category],
    })),
  updateCategory: (id, category) =>
    set(state => ({
      categories: state.categories.map(c =>
        c.id === id ? { ...c, ...category } : c
      ),
    })),
  deleteCategory: id =>
    set(state => ({
      categories: state.categories.filter(c => c.id !== id),
    })),

  // Time entry actions
  setTimeEntries: timeEntries => set({ timeEntries }),
  addTimeEntry: entry =>
    set(state => ({
      timeEntries: [...state.timeEntries, entry],
    })),
  updateTimeEntry: (id, entry) =>
    set(state => ({
      timeEntries: state.timeEntries.map(e =>
        e.id === id ? { ...e, ...entry } : e
      ),
    })),
  deleteTimeEntry: id =>
    set(state => ({
      timeEntries: state.timeEntries.filter(e => e.id !== id),
    })),

  // Data fetching
  fetchCategories: async () => {
    const { setLoading, setError, setCategories } = get();
    try {
      setLoading(true);
      const categories = await api.fetchCategories();
      setCategories(categories);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to fetch categories'
      );
    } finally {
      setLoading(false);
    }
  },

  fetchTimeEntries: async () => {
    const { setLoading, setError, setTimeEntries } = get();
    try {
      setLoading(true);
      const entries = await api.fetchTimeEntries();
      setTimeEntries(entries);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to fetch time entries'
      );
    } finally {
      setLoading(false);
    }
  },
}));
