import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TimeEntry } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function hasTimeOverlap(
  existingEntries: TimeEntry[],
  newStartTime: Date,
  newEndTime: Date,
  excludeEntryId?: string
): boolean {
  return existingEntries.some(entry => {
    if (excludeEntryId && entry.id === excludeEntryId) {
      return false;
    }

    const existingStart = new Date(entry.startTime);
    const existingEnd = new Date(entry.endTime);

    return (
      (newStartTime >= existingStart && newStartTime < existingEnd) ||
      (newEndTime > existingStart && newEndTime <= existingEnd) ||
      (newStartTime <= existingStart && newEndTime >= existingEnd)
    );
  });
}

export function formatDuration(hours: number): string {
  const totalMinutes = Math.round(hours * 60);
  const wholeHours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (wholeHours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${wholeHours}h`;
  } else {
    return `${wholeHours}h ${minutes}m`;
  }
}
