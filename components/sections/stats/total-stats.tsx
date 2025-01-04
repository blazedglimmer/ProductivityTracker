import { Clock, TrendingUp, Calendar as CalendarIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { TimeEntry, Category } from '@/types';

interface TotalStatsProps {
  timeEntries: TimeEntry[];
  categories: Category[];
}

export function TotalStats({ timeEntries, categories }: TotalStatsProps) {
  const totalHours = timeEntries.reduce((acc, entry) => {
    return (
      acc +
      (new Date(entry.endTime).getTime() -
        new Date(entry.startTime).getTime()) /
        (1000 * 60 * 60)
    );
  }, 0);

  return (
    <Card className="p-6 col-span-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-full bg-primary/10">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Hours</p>
            <p className="text-2xl font-bold">{totalHours.toFixed(1)}h</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-full bg-primary/10">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Categories</p>
            <p className="text-2xl font-bold">{categories.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-full bg-primary/10">
            <CalendarIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Entries</p>
            <p className="text-2xl font-bold">{timeEntries.length}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
