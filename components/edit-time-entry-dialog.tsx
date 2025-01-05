import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { TimeEntry, Category } from '@/types';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fetchCategories } from '@/lib/api';
import { toast } from 'sonner';

interface EditTimeEntryDialogProps {
  timeEntry: TimeEntry;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (updatedEntry: {
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    categoryId: string;
  }) => void;
}

export function EditTimeEntryDialog({
  timeEntry,
  isOpen,
  onClose,
  onConfirm,
}: EditTimeEntryDialogProps) {
  const [title, setTitle] = useState(timeEntry.title);
  const [description, setDescription] = useState(timeEntry.description || '');
  const [startTime, setStartTime] = useState(
    format(new Date(timeEntry.startTime), "yyyy-MM-dd'T'HH:mm")
  );
  const [endTime, setEndTime] = useState(
    format(new Date(timeEntry.endTime), "yyyy-MM-dd'T'HH:mm")
  );
  const [categoryId, setCategoryId] = useState(timeEntry.categoryId);
  const [categories, setCategories] = useState<Category[]>([]);

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

    loadCategories();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      toast.error('End time must be after start time');
      return;
    }

    onConfirm({
      title,
      description: description || undefined,
      startTime: start,
      endTime: end,
      categoryId,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Time Entry</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={categoryId}
              onValueChange={value => setCategoryId(value)}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
