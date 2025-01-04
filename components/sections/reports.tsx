'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
// import { getUserTimeEntries, getUserCategories } from '@/lib/data';
import { fetchCategories, fetchTimeEntries } from '@/lib/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { TimeEntry, Category } from '@/types';
import { toast } from 'sonner';

export function Reports() {
  const { data: session } = useSession();
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (session?.user?.id) {
        try {
          const [entries, cats] = await Promise.all([
            // getUserTimeEntries(session.user.id),
            // getUserCategories(session.user.id),
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
    }

    fetchData();
  }, [session?.user?.id]);

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
