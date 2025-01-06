'use client';

import { TotalStats } from '@/components/sections/stats/total-stats';
import { TimeDistribution } from '@/components/sections/stats/time-distribution';
import { RecentActivity } from '@/components/sections/stats/recent-activity';
import { useTimeEntriesCategories } from '@/hooks/use-time-entries-categories';

export function Dashboard() {
  const { timeEntries, categories } = useTimeEntriesCategories();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TotalStats timeEntries={timeEntries} categories={categories} />
      <TimeDistribution timeEntries={timeEntries} categories={categories} />
      <RecentActivity timeEntries={timeEntries} categories={categories} />
    </div>
  );
}
