import { z } from 'zod';

export const TimeEntrySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startTime: z.date(),
  endTime: z.date(),
  categoryId: z.string().min(1, 'Category is required'),
});
