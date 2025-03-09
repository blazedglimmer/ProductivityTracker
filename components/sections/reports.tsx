/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState, useTransition, useCallback } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useInView } from 'react-intersection-observer';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  getFilteredTimeEntries,
  getCategories,
} from '@/lib/actions/time-entries';
import { formatDuration } from '@/lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type TimeRange = 'today' | 'week' | 'month' | 'year' | 'custom';

interface TimeEntry {
  id: string;
  title: string;
  description: string | null;
  startTime: Date;
  endTime: Date;
  category: Category;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Statistics {
  totalHours: number;
  averageHoursPerDay: number;
  mostProductiveDay: string;
  topCategory: {
    name: string;
    hours: number;
    color: string;
  } | null;
}

export function Reports() {
  const [timeRange, setTimeRange] = useState<TimeRange>('today');
  const [categoryId, setCategoryId] = useState<string>('all');
  const [customDateRange, setCustomDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    totalHours: 0,
    averageHoursPerDay: 0,
    mostProductiveDay: '',
    topCategory: null,
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [, setIsLoading] = useState(true); // add loading if needed
  const { ref, inView } = useInView();

  const getDateRange = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (timeRange) {
      case 'today':
        return {
          startDate: today,
          endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        };
      case 'week': {
        const weekStart = new Date(
          today.setDate(today.getDate() - today.getDay())
        );
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);
        return { startDate: weekStart, endDate: weekEnd };
      }
      case 'month': {
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return { startDate: monthStart, endDate: monthEnd };
      }
      case 'year': {
        const yearStart = new Date(today.getFullYear(), 0, 1);
        const yearEnd = new Date(today.getFullYear(), 11, 31);
        return { startDate: yearStart, endDate: yearEnd };
      }
      case 'custom':
        return {
          startDate: customDateRange.from,
          endDate: customDateRange.to,
        };
      default:
        return { startDate: today, endDate: new Date() };
    }
  };

  const calculateStatistics = (entries: TimeEntry[]) => {
    if (entries.length === 0) {
      return {
        totalHours: 0,
        averageHoursPerDay: 0,
        mostProductiveDay: '',
        topCategory: null,
      };
    }

    // Calculate total hours
    const totalMilliseconds = entries.reduce((total, entry) => {
      return (
        total +
        (new Date(entry.endTime).getTime() -
          new Date(entry.startTime).getTime())
      );
    }, 0);
    const totalHours = totalMilliseconds / (1000 * 60 * 60);

    // Calculate hours per day
    const days = new Set(
      entries.map(entry => format(new Date(entry.startTime), 'yyyy-MM-dd'))
    ).size;
    const averageHoursPerDay = totalHours / Math.max(days, 1);

    // Find most productive day
    const dailyHours = entries.reduce((acc, entry) => {
      const day = format(new Date(entry.startTime), 'yyyy-MM-dd');
      const hours =
        (new Date(entry.endTime).getTime() -
          new Date(entry.startTime).getTime()) /
        (1000 * 60 * 60);
      acc[day] = (acc[day] || 0) + hours;
      return acc;
    }, {} as Record<string, number>);

    const mostProductiveDay = Object.entries(dailyHours).reduce(
      (max, [day, hours]) => (hours > (max[1] || 0) ? [day, hours] : max),
      ['', 0]
    )[0];

    // Find top category
    const categoryHours = entries.reduce((acc, entry) => {
      const hours =
        (new Date(entry.endTime).getTime() -
          new Date(entry.startTime).getTime()) /
        (1000 * 60 * 60);
      acc[entry.category.name] = {
        hours: (acc[entry.category.name]?.hours || 0) + hours,
        color: entry.category.color,
      };
      return acc;
    }, {} as Record<string, { hours: number; color: string }>);

    const topCategory = Object.entries(categoryHours).reduce(
      (max, [name, data]) =>
        data.hours > (max?.hours || 0) ? { name, ...data } : max,
      null as null | { name: string; hours: number; color: string }
    );

    return {
      totalHours,
      averageHoursPerDay,
      mostProductiveDay: mostProductiveDay
        ? format(new Date(mostProductiveDay), 'MMM d, yyyy')
        : '',
      topCategory,
    };
  };

  const loadTimeEntries = useCallback(
    async (reset = false) => {
      const currentPage = reset ? 1 : page;
      const { startDate, endDate } = getDateRange();

      if (!startDate || !endDate) return;

      try {
        const result = await getFilteredTimeEntries(
          startDate,
          endDate,
          categoryId === 'all' ? undefined : categoryId,
          currentPage,
          20
        );

        const newEntries = reset
          ? result.timeEntries
          : [...timeEntries, ...result.timeEntries];

        setTimeEntries(newEntries);
        setStatistics(calculateStatistics(newEntries));
        setHasMore(result.hasMore);
        if (!reset) {
          setPage(prev => prev + 1);
        }
      } catch (error) {
        console.error('Failed to load time entries:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [page, timeRange, categoryId, customDateRange, timeEntries]
  );

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await getCategories();
        setCategories(result);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    setPage(1);
    setIsLoading(true);
    startTransition(() => {
      loadTimeEntries(true);
    });
  }, [timeRange, categoryId, customDateRange]);

  useEffect(() => {
    if (inView && hasMore && !isPending) {
      startTransition(() => {
        loadTimeEntries();
      });
    }
  }, [inView, hasMore, isPending]);

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <Select
          value={timeRange}
          onValueChange={(value: TimeRange) => setTimeRange(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>

        {timeRange === 'custom' && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[280px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {customDateRange.from ? (
                  customDateRange.to ? (
                    <>
                      {format(customDateRange.from, 'LLL dd, y')} -{' '}
                      {format(customDateRange.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(customDateRange.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="range"
                selected={{
                  from: customDateRange.from,
                  to: customDateRange.to,
                }}
                onSelect={range =>
                  setCustomDateRange({
                    from: range?.from,
                    to: range?.to,
                  })
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )}

        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Hours</CardTitle>
            <CardDescription>Time spent in selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatDuration(statistics.totalHours)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Average</CardTitle>
            <CardDescription>Average hours per day</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatDuration(statistics.averageHoursPerDay)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Productive</CardTitle>
            <CardDescription>Day with most hours</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {statistics.mostProductiveDay || 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Category</CardTitle>
            <CardDescription>Most time spent</CardDescription>
          </CardHeader>
          <CardContent>
            {statistics.topCategory ? (
              <div className="space-y-2">
                <div
                  className="px-2 py-1 rounded text-xs inline-block"
                  style={{
                    backgroundColor: statistics.topCategory.color,
                  }}
                >
                  {statistics.topCategory.name}
                </div>
                <p className="text-2xl font-bold">
                  {formatDuration(statistics.topCategory.hours)}
                </p>
              </div>
            ) : (
              <p className="text-2xl font-bold">N/A</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Time Entries Table */}
      <div className="bg-card rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timeEntries.map((entry, index) => {
              return (
                <TableRow key={`${entry.id}-${index}`}>
                  <TableCell>
                    {format(new Date(entry.startTime), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{entry.title}</p>
                      {entry.description && (
                        <p className="text-sm text-muted-foreground">
                          {entry.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className="px-2 py-1 rounded text-xs inline-block"
                      style={{ backgroundColor: entry.category.color }}
                    >
                      {entry.category.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDuration(
                      (new Date(entry.endTime).getTime() -
                        new Date(entry.startTime).getTime()) /
                        (1000 * 60 * 60)
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div ref={ref} className="p-4 text-center">
          {isPending && <div>Loading more...</div>}
        </div>
      </div>
    </div>
  );
}
