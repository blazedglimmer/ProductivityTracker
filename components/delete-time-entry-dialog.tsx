import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TimeEntry } from '@/types';

interface DeleteTimeEntryDialogProps {
  timeEntry: TimeEntry;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteTimeEntryDialog({
  timeEntry,
  isOpen,
  onClose,
  onConfirm,
}: DeleteTimeEntryDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Time Entry</DialogTitle>
          <DialogDescription>
            {`Are you sure you want to delete the time entry "${timeEntry.title}"? This
              action cannot be undone.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
