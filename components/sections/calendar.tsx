'use client';

import { useState } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { useTimeTrackingStore } from '@/lib/store';
import { format } from 'date-fns';

export function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { timeEntries, categories } = useTimeTrackingStore();

  const getDayEntries = (day: Date) => {
    return timeEntries.filter(
      entry =>
        format(entry.startTime, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
  };

  const selectedDayEntries = date ? getDayEntries(date) : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6">
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </Card>
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          {date ? format(date, 'MMMM d, yyyy') : 'Select a date'}
        </h2>
        <div className="space-y-4">
          {selectedDayEntries.map(entry => {
            const category = categories.find(c => c.id === entry.categoryId);
            return (
              <div key={entry.id} className="p-4 rounded-lg bg-accent/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{entry.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(entry.startTime, 'h:mm a')} -{' '}
                      {format(entry.endTime, 'h:mm a')}
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
                  </div>
                </div>
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
  );
}
