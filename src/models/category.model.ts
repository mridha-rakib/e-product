import { model, Schema } from 'mongoose';

import { preUpdateCategoryHook } from '@/hooks/category.hook';

import {
  ICategoryDocument,
  ICategoryMethods,
  ICategoryModel,
} from '@/ts/interfaces/category.interface';

const CategorySchema = new Schema<ICategoryDocument, ICategoryModel, ICategoryMethods>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
  },
  { timestamps: true, collation: { locale: 'en' } }
);

CategorySchema.pre('findOneAndUpdate', preUpdateCategoryHook);

CategorySchema.index({ name: 'text' });

export const CategoryModel = model<ICategoryDocument>('Category', CategorySchema);
