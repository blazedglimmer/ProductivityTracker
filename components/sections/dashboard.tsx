'use client';

import { useEffect, useState } from 'react';
import { TotalStats } from '@/components/sections/stats/total-stats';
import { TimeDistribution } from '@/components/sections/stats/time-distribution';
import { RecentActivity } from '@/components/sections/stats/recent-activity';
import { fetchTimeEntries, fetchCategories } from '@/lib/api';
import { TimeEntry, Category } from '@/types';
import { toast } from 'sonner';

export function Dashboard() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

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
      }
    }

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TotalStats timeEntries={timeEntries} categories={categories} />
      <TimeDistribution timeEntries={timeEntries} categories={categories} />
      <RecentActivity timeEntries={timeEntries} categories={categories} />
    </div>
  );
}
