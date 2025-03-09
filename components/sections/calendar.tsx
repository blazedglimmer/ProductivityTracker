'use client';

import { useState } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetchTimeEntries, deleteTimeEntry, updateTimeEntry } from '@/lib/api';
import { format } from 'date-fns';
import { useTimeEntriesCategories } from '@/hooks/use-time-entries-categories';
import { TimeEntry } from '@/types';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { EditTimeEntryDialog } from '@/components/edit-time-entry-dialog';
import { DeleteTimeEntryDialog } from '@/components/delete-time-entry-dialog';
import { TimeEntryDialog } from '@/components/time-entry-dialog';
import { formatDuration, hasTimeOverlap } from '@/lib/utils';

type ViewMode = 'day' | 'week' | 'month';

export function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const { timeEntries, categories, setTimeEntries } =
    useTimeEntriesCategories();
  const [timeEntryToEdit, setTimeEntryToEdit] = useState<TimeEntry | null>(
    null
  );
  const [timeEntryToDelete, setTimeEntryToDelete] = useState<TimeEntry | null>(
    null
  );
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const getDayEntries = (day: Date) => {
    return timeEntries.filter(
      entry =>
        format(new Date(entry.startTime), 'yyyy-MM-dd') ===
        format(day, 'yyyy-MM-dd')
    );
  };

  const calculateDayStats = (entries: TimeEntry[]) => {
    const totalMinutes = entries.reduce((acc, entry) => {
      const duration =
        new Date(entry.endTime).getTime() - new Date(entry.startTime).getTime();
      return acc + duration / (1000 * 60);
    }, 0);

    const categoryStats = entries.reduce((acc, entry) => {
      const category = categories.find(c => c.id === entry.categoryId);
      if (category) {
        const duration =
          new Date(entry.endTime).getTime() -
          new Date(entry.startTime).getTime();
        acc[category.name] =
          (acc[category.name] || 0) + duration / (1000 * 60 * 60);
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalHours: totalMinutes / 60,
      categoryStats,
    };
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      await deleteTimeEntry(entryId);
      setTimeEntries(entries => entries.filter(e => e.id !== entryId));
      toast.success('Time entry deleted successfully');
      setTimeEntryToDelete(null);
    } catch (error) {
      console.error({ error });
      toast.error('Failed to delete time entry');
    }
  };

  const handleEditEntry = async (
    entryId: string,
    updatedData: {
      title: string;
      description?: string;
      startTime: Date;
      endTime: Date;
      categoryId: string;
    }
  ) => {
    try {
      if (
        hasTimeOverlap(
          timeEntries,
          updatedData.startTime,
          updatedData.endTime,
          entryId
        )
      ) {
        toast.error(
          'This time slot overlaps with an existing entry. Please choose a different time.'
        );
        return;
      }

      await updateTimeEntry(entryId, updatedData);
      const updatedEntries = await fetchTimeEntries();
      setTimeEntries(updatedEntries);
      setTimeEntryToEdit(null);
      toast.success('Time entry updated successfully');
    } catch (error) {
      console.error({ error });
      toast.error('Failed to update time entry');
    }
  };

  const handleQuickAdd = (time: Date) => {
    setSelectedTime(time);
    setShowAddDialog(true);
  };

  const selectedDayEntries = date ? getDayEntries(date) : [];
  const dayStats = calculateDayStats(selectedDayEntries);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Select
          value={viewMode}
          onValueChange={(value: ViewMode) => setViewMode(value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Day View</SelectItem>
            <SelectItem value="week">Week View</SelectItem>
            <SelectItem value="month">Month View</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 sm:p-6">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow flex justify-center"
          />

          {/* Daily Statistics */}
          {date && (
            <div className="mt-6 p-4 bg-accent/50 rounded-lg">
              <h3 className="font-semibold mb-2">Daily Statistics</h3>
              <p className="text-sm">
                Total Hours: {formatDuration(dayStats.totalHours)}
              </p>
              <div className="mt-2">
                {Object.entries(dayStats.categoryStats).map(
                  ([category, hours]) => (
                    <div
                      key={category}
                      className="text-sm flex justify-between"
                    >
                      <span>{category}:</span>
                      <span>{formatDuration(hours)}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="text-xl font-semibold">
              {date ? format(date, 'MMMM d, yyyy') : 'Select a date'}
            </h2>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-20rem)]">
            {/* Time slots for quick add */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {Array.from({ length: 24 }).map((_, hour) => (
                <Button
                  key={hour}
                  variant="outline"
                  className="text-sm"
                  onClick={() => {
                    const time = new Date(date!);
                    time.setHours(hour, 0, 0, 0);
                    handleQuickAdd(time);
                  }}
                >
                  {format(new Date().setHours(hour, 0, 0, 0), 'h:mm a')}
                </Button>
              ))}
            </div>

            {selectedDayEntries.map(entry => {
              const category = categories.find(c => c.id === entry.categoryId);
              return (
                <div
                  key={entry.id}
                  className="p-4 rounded-lg bg-accent/50 hover:bg-accent/70 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-medium">{entry.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(entry.startTime), 'h:mm a')} -{' '}
                        {format(new Date(entry.endTime), 'h:mm a')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category?.color }}
                      />
                      <span className="text-sm font-medium">
                        {category?.name}
                      </span>
                      <div className="flex items-center gap-1 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setTimeEntryToEdit(entry)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setTimeEntryToDelete(entry)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {entry.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {entry.description}
                    </p>
                  )}
                </div>
              );
            })}
            {selectedDayEntries.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No entries for this date
              </p>
            )}
          </div>
        </Card>
      </div>

      {timeEntryToEdit && (
        <EditTimeEntryDialog
          timeEntry={timeEntryToEdit}
          isOpen={!!timeEntryToEdit}
          onClose={() => setTimeEntryToEdit(null)}
          onConfirm={updatedData =>
            handleEditEntry(timeEntryToEdit.id, updatedData)
          }
        />
      )}

      {timeEntryToDelete && (
        <DeleteTimeEntryDialog
          timeEntry={timeEntryToDelete}
          isOpen={!!timeEntryToDelete}
          onClose={() => setTimeEntryToDelete(null)}
          onConfirm={() => handleDeleteEntry(timeEntryToDelete.id)}
        />
      )}

      {showAddDialog && (
        <TimeEntryDialog
          isOpen={showAddDialog}
          onClose={() => {
            setShowAddDialog(false);
            setSelectedTime(null);
          }}
          initialDate={date}
          initialTime={selectedTime}
        />
      )}
    </div>
  );
}
