import { cloudinary } from '@/lib/cloudinary';

export async function deleteOldProfilePic(publicId: string) {
  try {
    await cloudinary.uploader.destroy(`profile-pictures/${publicId}`);
    console.log('Old profile picture deleted from Cloudinary');
  } catch (error) {
    console.error('Failed to delete old profile picture:', error);
  }
}
