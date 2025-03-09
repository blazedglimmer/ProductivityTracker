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
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { getFilteredTimeEntries } from '@/lib/actions/time-entries';
import { formatDuration } from '@/lib/utils';

ChartJS.register(ArcElement, Tooltip, Legend);

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

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

export function Dashboard({ categories }: { categories: Category[] }) {
  const [timeRange, setTimeRange] = useState<TimeRange>('today');
  const [categoryId, setCategoryId] = useState<string>('all');
  const [customDateRange, setCustomDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });
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

  const updateChartData = (entries: TimeEntry[]) => {
    const categoryDurations = new Map<string, number>();
    const categoryColors = new Map<string, string>();

    entries.forEach(entry => {
      const duration =
        new Date(entry.endTime).getTime() - new Date(entry.startTime).getTime();
      const categoryName = entry.category.name;
      categoryColors.set(categoryName, entry.category.color);
      categoryDurations.set(
        categoryName,
        (categoryDurations.get(categoryName) || 0) + duration
      );
    });

    const labels = Array.from(categoryDurations.keys());
    const data = Array.from(categoryDurations.values()).map(
      duration => duration / (1000 * 60 * 60)
    ); // Convert to hours
    const backgroundColor = labels.map(
      label => categoryColors.get(label) || '#000000'
    );
    const borderColor = backgroundColor.map(color => color);

    setChartData({
      labels,
      datasets: [
        {
          data,
          backgroundColor,
          borderColor,
          borderWidth: 1,
        },
      ],
    });
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
        updateChartData(newEntries);
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
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <Select
          value={timeRange}
          onValueChange={(value: TimeRange) => setTimeRange(value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
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
                className="w-full sm:w-[280px] justify-start text-left font-normal"
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
            <PopoverContent className="w-auto p-0" align="start">
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
          <SelectTrigger className="w-full sm:w-[180px]">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ... (keep existing statistics cards) */}
      </div>

      {/* Chart Section */}
      {timeEntries.length > 0 && (
        <div className="bg-card p-4 sm:p-6 rounded-lg border border-border">
          <h2 className="text-lg font-semibold mb-4">
            Time Distribution by Category
          </h2>
          <div className="w-full max-w-md mx-auto">
            <Pie
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      boxWidth: 12,
                      padding: 15,
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const hours = context.raw as number;
                        return formatDuration(hours);
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      )}

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
