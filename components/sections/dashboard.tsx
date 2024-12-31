'use client';

import { TotalStats } from '@/components/sections/stats/total-stats';
import { TimeDistribution } from '@/components/sections/stats/time-distribution';
import { RecentActivity } from '@/components/sections/stats/recent-activity';

export function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TotalStats />
      <TimeDistribution />
      <RecentActivity />
    </div>
  );
}
