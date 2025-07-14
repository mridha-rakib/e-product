import { ProductStatus } from '@/enums/product-status.enum';
import { model, Schema } from 'mongoose';
import {
  IProductVariantDocument,
  IProductVariantMethods,
  IProductVariantModel,
} from '@/ts/interfaces/product.interface';
import {
  preSaveProductVariantHook,
  preUpdateProductVariantHook,
} from '@/hooks/product-variant.hook';

const ProductVariantSchema = new Schema<
  IProductVariantDocument,
  IProductVariantModel,
  IProductVariantMethods
>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: ['out-of-stock', 'in-stock'],
    },
  },
  { timestamps: true, collation: { locale: 'en' } }
);

ProductVariantSchema.pre('save', preSaveProductVariantHook);
ProductVariantSchema.pre('findOneAndUpdate', preUpdateProductVariantHook);
ProductVariantSchema.pre('updateOne', preUpdateProductVariantHook);
ProductVariantSchema.pre('updateMany', preUpdateProductVariantHook);

ProductVariantSchema.index({ name: 'text' });

export const ProductVariantModel = model<IProductVariantDocument>(
  'ProductVariant',
  ProductVariantSchema
);
