import { Card } from '@/components/ui/card';
import { TimeEntry, Category } from '@/types';
import { format } from 'date-fns';

interface RecentActivityProps {
  timeEntries: TimeEntry[];
  categories: Category[];
}

export function RecentActivity({
  timeEntries,
  categories,
}: RecentActivityProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4 overflow-y-auto sm:h-[calc(100svh-20rem)]">
        {timeEntries.map(entry => {
          const category = categories.find(c => c.id === entry.categoryId);
          return (
            <div
              key={entry.id}
              className="flex items-center justify-between p-4 rounded-lg bg-accent/50"
            >
              <div>
                <h3 className="font-medium">{entry.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(entry.startTime), 'MMM d, h:mm a')} -{' '}
                  {format(new Date(entry.endTime), 'MMM d, h:mm a')}
                </p>
              </div>
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category?.color }}
              />
            </div>
          );
        })}
        {timeEntries.length === 0 && (
          <p className="text-muted-foreground text-center py-4">
            No recent activity
          </p>
        )}
      </div>
    </Card>
  );
}
