'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Pencil } from 'lucide-react';
import { createCategory } from '@/lib/actions/category';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Category } from '@/types';
import {
  fetchCategories,
  checkCategoryExists,
  deleteCategory,
  updateCategory,
} from '@/lib/api';
import { DeleteCategoryDialog } from '@/components/delete-category-dialog';
import { EditCategoryDialog } from '@/components/edit-category-dialog';

export function Settings() {
  const { data: session } = useSession();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#000000');
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

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
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const cats = await fetchCategories();
      setCategories(cats);
    } catch (error) {
      console.error({ error });
      toast.error('Failed to load categories');
    }
  }

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

    try {
      const exists = await checkCategoryExists(newCategoryName);
      if (exists) {
        toast.error('A category with this name already exists');
        return;
      }

      const formData = new FormData();
      formData.append('name', newCategoryName);
      formData.append('color', newCategoryColor);

      const result = await createCategory(session.user.id, formData);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      await loadCategories();
      toast.success('Category added successfully');
      setNewCategoryName('');
      setNewCategoryColor('#000000');
    } catch (error) {
      console.error({ error });
      toast.error('Failed to add category');
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete.id);
      await loadCategories();
      toast.success('Category deleted successfully');
      setCategoryToDelete(null);
    } catch (error) {
      console.error({ error });
      toast.error('Failed to delete category');
    }
  };

  const handleEditCategory = async (updatedData: {
    name: string;
    color: string;
  }) => {
    if (!categoryToEdit) return;

    try {
      await updateCategory(categoryToEdit.id, updatedData);
      await loadCategories();
      toast.success('Category updated successfully');
      setCategoryToEdit(null);
    } catch (error) {
      console.error({ error });
      toast.error('Failed to update category');
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
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCategoryToEdit(category)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCategoryToDelete(category)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {categoryToDelete && (
        <DeleteCategoryDialog
          category={categoryToDelete}
          isOpen={!!categoryToDelete}
          onClose={() => setCategoryToDelete(null)}
          onConfirm={handleDeleteCategory}
        />
      )}

      {categoryToEdit && (
        <EditCategoryDialog
          category={categoryToEdit}
          isOpen={!!categoryToEdit}
          onClose={() => setCategoryToEdit(null)}
          onConfirm={handleEditCategory}
        />
      )}
    </div>
  );
}
