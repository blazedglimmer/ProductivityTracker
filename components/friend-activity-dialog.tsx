import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  format,
  startOfYear,
  endOfYear,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { toast } from 'sonner';
import { TimeEntry } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn, formatDuration } from '@/lib/utils';
import { TimeRange, FriendActivityDialogProps } from '@/types';

export function FriendActivityDialog({
  friend,
  isOpen,
  onClose,
}: FriendActivityDialogProps) {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('today');
  const [customDateRange, setCustomDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    if (isOpen) {
      loadActivities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, friend.id]);

  const loadActivities = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/friends/activities/${friend.id}`);
      if (!response.ok) {
        throw new Error('Failed to load activities');
      }
      const data = await response.json();
      setTimeEntries(data);
    } catch (error) {
      console.error('Failed to load activities:', error);
      toast.error('Failed to load activities');
    } finally {
      setIsLoading(false);
    }
  };

  const filterTimeEntries = () => {
    const now = new Date();
    let start: Date;
    let end: Date;

    switch (timeRange) {
      case 'today':
        start = startOfDay(now);
        end = endOfDay(now);
        break;
      case 'week':
        start = startOfWeek(now);
        end = endOfWeek(now);
        break;
      case 'month':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case 'year':
        start = startOfYear(now);
        end = endOfYear(now);
        break;
      case 'custom':
        if (!customDateRange.from || !customDateRange.to) {
          return timeEntries;
        }
        start = startOfDay(customDateRange.from);
        end = endOfDay(customDateRange.to);
        break;
      default:
        return timeEntries;
    }

    return timeEntries.filter(entry => {
      const entryDate = new Date(entry.startTime);
      return entryDate >= start && entryDate <= end;
    });
  };

  const calculateTotalHours = (entries: TimeEntry[]) => {
    return entries.reduce((total, entry) => {
      const duration =
        new Date(entry.endTime).getTime() - new Date(entry.startTime).getTime();
      return total + duration / (1000 * 60 * 60);
    }, 0);
  };

  const filteredEntries = filterTimeEntries();
  const totalHours = calculateTotalHours(filteredEntries);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {`${friend.name}'s Activities`}
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 items-center mb-4">
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
                  className={cn(
                    'w-[280px] justify-start text-left font-normal',
                    !customDateRange.from && 'text-muted-foreground'
                  )}
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
        </div>

        <div className="mb-4 p-4 bg-accent/50 rounded-lg">
          <p className="text-lg font-semibold">
            Total Hours: {formatDuration(totalHours)}
          </p>
        </div>

        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="text-center py-4">Loading activities...</div>
          ) : filteredEntries.length > 0 ? (
            <div className="space-y-4">
              {filteredEntries.map(entry => (
                <div
                  key={entry.id}
                  className="p-4 rounded-lg bg-accent/50 hover:bg-accent/70 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{entry.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(
                          new Date(entry.startTime),
                          'MMM d, yyyy h:mm a'
                        )}{' '}
                        - {format(new Date(entry.endTime), 'h:mm a')}
                      </p>
                    </div>
                    {entry.category && (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: entry.category.color }}
                        />
                        <span className="text-sm font-medium">
                          {entry.category.name}
                        </span>
                      </div>
                    )}
                  </div>
                  {entry.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {entry.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No activities found for this time period
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
