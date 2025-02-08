import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createTimeEntry } from '@/lib/actions/time-entry';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  CalendarIcon,
  Bold,
  Italic,
  Underline,
  List,
  Eye,
  Edit,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { Category } from '@/types';
import { fetchCategories } from '@/lib/api';
import { useTimeEntries } from '@/hooks/use-time-entries';
import { hasTimeOverlap } from '@/lib/utils';
import { MarkdownPreview } from '@/components/markdown-preview';

interface TimeEntryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: Date;
  initialTime?: Date | null;
  initialEndTime?: Date | null;
}

export function TimeEntryDialog({
  isOpen,
  onClose,
  initialDate,
  initialTime,
  initialEndTime,
}: TimeEntryDialogProps) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    description: '',
    date: initialDate || new Date(),
    startTime: initialTime ? format(initialTime, 'HH:mm') : '',
    endTime: initialEndTime
      ? format(initialEndTime, 'HH:mm')
      : initialTime
      ? format(new Date(initialTime.getTime() + 60 * 60 * 1000), 'HH:mm')
      : '',
  });

  const { timeEntries } = useTimeEntries();
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeMarkup, setActiveMarkup] = useState<string[]>([]);
  const [descriptionTab, setDescriptionTab] = useState<'write' | 'preview'>(
    'write'
  );

  const resetForm = () => {
    setFormData({
      title: '',
      categoryId: '',
      description: '',
      date: initialDate || new Date(),
      startTime: initialTime ? format(initialTime, 'HH:mm') : '',
      endTime: initialEndTime
        ? format(initialEndTime, 'HH:mm')
        : initialTime
        ? format(new Date(initialTime.getTime() + 60 * 60 * 1000), 'HH:mm')
        : '',
    });
    setActiveMarkup([]);
    setDescriptionTab('write');
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

    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialDate, initialTime, initialEndTime]);

  const handleMarkup = (value: string) => {
    const textarea = document.getElementById(
      'description'
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.description.substring(start, end);
    let newText = formData.description;

    switch (value) {
      case 'bold':
        newText =
          newText.substring(0, start) +
          `**${selectedText}**` +
          newText.substring(end);
        break;
      case 'italic':
        newText =
          newText.substring(0, start) +
          `_${selectedText}_` +
          newText.substring(end);
        break;
      case 'underline':
        newText =
          newText.substring(0, start) +
          `__${selectedText}__` +
          newText.substring(end);
        break;
      case 'list':
        const lines = selectedText.split('\n').map(line => `- ${line}`);
        newText =
          newText.substring(0, start) +
          lines.join('\n') +
          newText.substring(end);
        break;
    }

    setFormData(prev => ({ ...prev, description: newText }));
  };

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
    formDataToSend.append('description', formData.description);
    formDataToSend.append('startTime', start.toISOString());
    formDataToSend.append('endTime', end.toISOString());

    try {
      const result = await createTimeEntry(session.user.id, formDataToSend);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success('Time entry added successfully');
      onClose();
    } catch (error) {
      console.error({ error });
      toast.error('Failed to add time entry');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
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
            <Label htmlFor="description">Description</Label>
            <Tabs
              value={descriptionTab}
              onValueChange={value =>
                setDescriptionTab(value as 'write' | 'preview')
              }
            >
              <TabsList className="mb-2">
                <TabsTrigger value="write" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Write
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </TabsTrigger>
              </TabsList>
              <TabsContent value="write" className="space-y-2">
                <ToggleGroup
                  type="multiple"
                  value={activeMarkup}
                  onValueChange={setActiveMarkup}
                  className="mb-2"
                >
                  <ToggleGroupItem
                    value="bold"
                    onClick={() => handleMarkup('bold')}
                  >
                    <Bold className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="italic"
                    onClick={() => handleMarkup('italic')}
                  >
                    <Italic className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="underline"
                    onClick={() => handleMarkup('underline')}
                  >
                    <Underline className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="list"
                    onClick={() => handleMarkup('list')}
                  >
                    <List className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="min-h-[200px] font-mono"
                  placeholder="Use markdown for formatting:
**bold**
_italic_
__underlined__
- list item"
                />
              </TabsContent>
              <TabsContent
                value="preview"
                className="min-h-[200px] border rounded-md p-4"
              >
                {formData.description ? (
                  <MarkdownPreview content={formData.description} />
                ) : (
                  <p className="text-muted-foreground">Nothing to preview</p>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <Button type="submit" className="w-full">
            Add Entry
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
