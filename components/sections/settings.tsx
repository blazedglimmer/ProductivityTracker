'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTimeTrackingStore } from '@/lib/store';
import { toast } from 'sonner';

export function Settings() {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#000000');
  const { categories, addCategory } = useTimeTrackingStore();

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    addCategory({
      name: newCategoryName,
      color: newCategoryColor,
    });

    toast.success('Category added successfully');
    setNewCategoryName('');
    setNewCategoryColor('#000000');
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Categories</h2>
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryColor">Color</Label>
              <Input
                id="categoryColor"
                type="color"
                value={newCategoryColor}
                onChange={e => setNewCategoryColor(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit">Add Category</Button>
        </form>

        <div className="mt-8 space-y-4">
          <h3 className="font-medium">Existing Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map(category => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 rounded-lg bg-accent/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span>{category.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
