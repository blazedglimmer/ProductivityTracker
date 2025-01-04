'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createCategory } from '@/lib/actions/category';
// import { getUserCategories } from '@/lib/data';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Category } from '@/types';
import { fetchCategories } from '@/lib/api';

export function Settings() {
  const { data: session } = useSession();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#000000');
  const [categories, setCategories] = useState<Category[]>([]);

  // useEffect(() => {
  //   async function fetchCategories() {
  //     if (session?.user?.id) {
  //       try {
  //         const userCategories = await getUserCategories(session.user.id);
  //         setCategories(userCategories);
  //       } catch (error) {
  //         console.error({ error });
  //         toast.error('Failed to fetch categories');
  //       }
  //     }
  //   }

  //   fetchCategories();
  // }, [session?.user?.id]);

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

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id) {
      toast.error('You must be logged in to add categories');
      return;
    }

    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    const formData = new FormData();
    formData.append('name', newCategoryName);
    formData.append('color', newCategoryColor);

    try {
      const result = await createCategory(session.user.id, formData);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      // Refresh categories
      const updatedCategories = await fetchCategories();
      setCategories(updatedCategories);

      toast.success('Category added successfully');
      setNewCategoryName('');
      setNewCategoryColor('#000000');
    } catch (error) {
      console.error({ error });
      toast.error('Failed to add category');
    }
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
