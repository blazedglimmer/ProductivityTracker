'use client';

import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns';
import { useTimeEntriesCategories } from '@/hooks/use-time-entries-categories';

export function Reports() {
  const { timeEntries, categories } = useTimeEntriesCategories();

  const start = startOfWeek(new Date());
  const end = endOfWeek(new Date());

  const weekDays = eachDayOfInterval({ start, end }).map(date => {
    const dayEntries = timeEntries.filter(
      entry =>
        format(new Date(entry.startTime), 'yyyy-MM-dd') ===
        format(date, 'yyyy-MM-dd')
    );

    const categoryDurations = categories.map(category => {
      const categoryEntries = dayEntries.filter(
        entry => entry.categoryId === category.id
      );
      const duration = categoryEntries.reduce((acc, entry) => {
        return (
          acc +
          (new Date(entry.endTime).getTime() -
            new Date(entry.startTime).getTime()) /
            (1000 * 60 * 60)
        );
      }, 0);

      return {
        name: category.name,
        duration: Number(duration.toFixed(2)),
        color: category.color,
      };
    });

    return {
      date: format(date, 'EEE'),
      ...Object.fromEntries(categoryDurations.map(c => [c.name, c.duration])),
    };
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Weekly Activity</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekDays}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              {categories.map(category => (
                <Bar
                  key={category.id}
                  dataKey={category.name}
                  stackId="a"
                  fill={category.color}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
