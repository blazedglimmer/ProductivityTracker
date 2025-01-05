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
import { Category } from '@/types';
import { useState } from 'react';

interface EditCategoryDialogProps {
  category: Category;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (updatedCategory: { name: string; color: string }) => void;
}

export function EditCategoryDialog({
  category,
  isOpen,
  onClose,
  onConfirm,
}: EditCategoryDialogProps) {
  const [name, setName] = useState(category.name);
  const [color, setColor] = useState(category.color);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({ name, color });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter category name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
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
