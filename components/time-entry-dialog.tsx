'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createTimeEntry } from '@/lib/actions/time-entry';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { Category } from '@/types';
import { fetchCategories } from '@/lib/api';
import { useTimeEntries } from '@/hooks/use-time-entries';
import { hasTimeOverlap } from '@/lib/utils';

export function TimeEntryDialog() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    description: '',
    date: new Date(),
    startTime: '',
    endTime: '',
  });

  const { timeEntries } = useTimeEntries();
  const [categories, setCategories] = useState<Category[]>([]);
  const resetForm = () => {
    setFormData({
      title: '',
      categoryId: '',
      description: '',
      date: new Date(),
      startTime: '',
      endTime: '',
    });
  };

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await fetchCategories();
        setCategories(cats);
      } catch (error) {
        console.error({ error });
        toast.error('Failed to load categories');
      }
    }

    if (open) {
      loadCategories();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id) {
      toast.error('You must be logged in to add time entries');
      return;
    }

    const start = new Date(formData.date);
    const [startHours, startMinutes] = formData.startTime.split(':');
    start.setHours(parseInt(startHours), parseInt(startMinutes));

    const end = new Date(formData.date);
    const [endHours, endMinutes] = formData.endTime.split(':');
    end.setHours(parseInt(endHours), parseInt(endMinutes));

    if (start >= end) {
      toast.error('End time must be after start time');
      return;
    }

    // Check for time overlap
    if (hasTimeOverlap(timeEntries, start, end)) {
      toast.error(
        'This time slot overlaps with an existing entry. Please choose a different time.'
      );
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('categoryId', formData.categoryId);
    formDataToSend.append('description', formData.description || '');
    formDataToSend.append('startTime', start.toISOString());
    formDataToSend.append('endTime', end.toISOString());

    try {
      const result = await createTimeEntry(session.user.id, formDataToSend);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success('Time entry added successfully');
      setOpen(false);
    } catch (error) {
      console.error({ error });
      toast.error('Failed to add time entry');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">Add Time Entry</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Time Entry</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={e =>
                setFormData(prev => ({ ...prev, title: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={formData.categoryId}
              onValueChange={value =>
                setFormData(prev => ({ ...prev, categoryId: value }))
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !formData.date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? (
                    format(formData.date, 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={date =>
                    date && setFormData(prev => ({ ...prev, date }))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={e =>
                  setFormData(prev => ({ ...prev, startTime: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={e =>
                  setFormData(prev => ({ ...prev, endTime: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={e =>
                setFormData(prev => ({ ...prev, description: e.target.value }))
              }
            />
          </div>

          <Button type="submit" className="w-full">
            Add Entry
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
