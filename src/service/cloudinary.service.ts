import fs from 'fs/promises';
import { cloudinary } from '@/config/cloudinary.config';

export const CloudinaryService = {
  async uploadImage(filePath: string) {
    try {
      await fs.access(filePath);

      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'products',
        use_filename: true,
        unique_filename: false,
        resource_type: 'auto',
      });

      await fs.unlink(filePath);

      return {
        url: result.secure_url,
        public_id: result.public_id,
      };
    } catch (error: any) {
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  },

  async deleteImage(publicId: string) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error: any) {
      console.error('Cloudinary delete error:', error.message);
      throw new Error(`Cloudinary delete failed: ${error.message}`);
    }
  },
};
