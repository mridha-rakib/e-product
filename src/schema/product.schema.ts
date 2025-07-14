import { z } from 'zod';
import { objectIdGeneric } from './common.schema';
import { queryEnums, queryGeneric } from './query.schema';

export const productVariantGeneric = z.object({
  name: z.string().trim().min(1).max(100),
  price: z.number().nonnegative().min(0).default(0),
  originalPrice: z.number().nonnegative().min(0).optional(),
  discount: z.number().min(0).max(100).optional(),
  stock: z.number().nonnegative().min(0).default(0),
  status: z.enum(['out-of-stock', 'in-stock']).optional(),
});

export const productGeneric = z.object({
  name: z.string({ message: 'product name is required' }).trim().min(1).max(200),
  productCode: z.string().trim().min(2).max(50).optional(),
  image: z
    .url()
    .refine(url => /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(url), 'Invalid URL')
    .optional(),
  description: z
    .string({ message: 'product description is required' })
    .trim()
    .min(1)
    .max(1000),
  category: objectIdGeneric,
  variants: z.array(productVariantGeneric),
});

export const getProductsSchema = z.object({
  query: z
    .object({
      term: z.coerce.string().optional(),
      category: z.coerce.string().optional(),
      startPrice: z.coerce.number().positive().optional(),
      endPrice: z.coerce.number().positive().optional(),
      hasEmptyStock: z.coerce.boolean().optional(),
    })
    .extend({
      ...queryGeneric.shape,
      sortBy: z
        .enum(['term', 'price', 'stock', 'status', ...queryEnums.sortBy])
        .default('term'),
    }),
});

export const getProductSchema = z.object({
  params: z
    .object({
      productCode: productGeneric.shape.productCode,
    })
    .required(),
});

export const createProductSchema = z.object({
  body: productGeneric.extend({
    variants: productGeneric.shape.variants.default([]),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: objectIdGeneric,
  }),
  body: productGeneric.partial().extend({
    variants: z
      .array(
        productVariantGeneric
          .omit({ status: true })
          .extend({ _id: objectIdGeneric })
          .partial()
      )
      .optional(),
  }),
});

export const deleteProductSchema = z.object({
  params: z.object({
    id: objectIdGeneric,
  }),
});

export const deleteProductVariantSchema = z.object({
  params: z.object({
    id: objectIdGeneric,
    idVariant: objectIdGeneric,
  }),
});
