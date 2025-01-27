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
import { useInView } from 'react-intersection-observer';
import {
  getFilteredTimeEntries,
  getCategories,
} from '@/lib/actions/time-entries';

type TimeRange = 'today' | 'week' | 'month' | 'year' | 'custom';

interface TimeEntry {
  id: string;
  title: string;
  description: string | null; // Allow null
  startTime: Date;
  endTime: Date;
  category: Category;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

export function Dashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('today');
  const [categoryId, setCategoryId] = useState<string>('all'); // Initialize with 'all'
  const [customDateRange, setCustomDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
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

  const loadTimeEntries = useCallback(
    async (reset = false) => {
      const currentPage = reset ? 1 : page;
      const { startDate, endDate } = getDateRange();

      if (!startDate || !endDate) return;

      try {
        const result = await getFilteredTimeEntries(
          startDate,
          endDate,
          categoryId === 'all' ? undefined : categoryId, // Handle 'all' case
          currentPage,
          20
        );

        setTimeEntries(prev =>
          reset ? result.timeEntries : [...prev, ...result.timeEntries]
        );
        // setTimeEntries(prev => {
        //   if (reset) return result.timeEntries;

        //   // Create a Set of existing IDs for O(1) lookup
        //   const existingIds = new Set(prev.map(entry => entry.id));

        //   // Filter out any duplicates from the new entries
        //   const newEntries = result.timeEntries.filter(
        //     entry => !existingIds.has(entry.id)
        //   );

        //   return [...prev, ...newEntries];
        // });

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
    [page, timeRange, categoryId, customDateRange]
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

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <>
            {timeEntries.map((entry, index) => (
              <div
                key={`${entry.id}-${index}`}
                className="p-4 bg-card rounded-lg border border-border"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{entry.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {entry.description}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(new Date(entry.startTime), 'MMM d, yyyy h:mm a')}{' '}
                      - {format(new Date(entry.endTime), 'h:mm a')}
                    </p>
                  </div>
                  <div
                    className="px-2 py-1 rounded text-xs"
                    style={{ backgroundColor: entry.category.color }}
                  >
                    {entry.category.name}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            <div ref={ref}>
              {isPending && (
                <div className="text-center py-4">Loading more...</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
