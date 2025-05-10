'use client';

import { ImageIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { uploadImages } from '@/app/actions/upload-images';

export function ImageUploadButton({ todoId }: { todoId: string }) {
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      try {
        const formData = new FormData();
        selectedFiles.forEach(file => formData.append('files', file));
        // formData.append('todoId', todoId);

        const response = await uploadImages(formData, todoId);

        if (response.success) {
          toast({
            title: 'Images uploaded successfully!',
          });
        } else {
          throw new Error(response.error || 'Upload failed');
        }
      } catch (err) {
        toast({
          title: 'Error',
          description:
            err instanceof Error ? err.message : 'An unknown error occurred',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="relative" onClick={e => e.stopPropagation()}>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 opacity-0 cursor-pointer text-[0]"
      />
      <ImageIcon size={16} className="cursor-pointer" />
    </div>
  );
}
