'use client';

import { create } from 'zustand';
import { Category, TimeEntry } from '@/types';
import { generateId } from '@/lib/utils';

interface TimeTrackingStore {
  categories: Category[];
  timeEntries: TimeEntry[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  addTimeEntry: (entry: Omit<TimeEntry, 'id'>) => void;
  deleteTimeEntry: (id: string) => void;
}

export const useTimeTrackingStore = create<TimeTrackingStore>(set => ({
  categories: [
    { id: '1', name: 'Work', color: '#0ea5e9' },
    { id: '2', name: 'Study', color: '#8b5cf6' },
    { id: '3', name: 'Exercise', color: '#22c55e' },
    { id: '4', name: 'Personal', color: '#f59e0b' },
  ],
  timeEntries: [],
  addCategory: category =>
    set(state => ({
      categories: [...state.categories, { ...category, id: generateId() }],
    })),
  addTimeEntry: entry =>
    set(state => ({
      timeEntries: [...state.timeEntries, { ...entry, id: generateId() }],
    })),
  deleteTimeEntry: id =>
    set(state => ({
      timeEntries: state.timeEntries.filter(entry => entry.id !== id),
    })),
}));
