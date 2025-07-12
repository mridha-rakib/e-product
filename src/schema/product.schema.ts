import { z } from "zod";
import { objectIdGeneric } from "./common.schema";

export const productVariantGeneric = z.object({
  name: z
    .string({ message: "variant name is required" })
    .trim()
    .min(1)
    .max(100),
  productCode: z
    .string({ message: "product code is required" })
    .trim()
    .min(2)
    .max(50),
  price: z.number().nonnegative().min(0).default(0),
  originalPrice: z.number().nonnegative().min(0).optional(),
  discount: z.number().min(0).max(100),
  image: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      if (!file) return true;
      return file.size <= 5 * 1024 * 1024;
    }, "File size must be less than 5MB")
    .refine((file) => {
      if (!file) return true;
      return ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        file.type
      );
    }, "Only JPEG, PNG, and WebP images are allowed"),
  stock: z.number().nonnegative().min(0).default(0),
  status: z.enum(["out-of-stock", "in-stock"]).optional(),
});

export const productGeneric = z.object({
  name: z
    .string({ message: "product name is required" })
    .trim()
    .min(1)
    .max(200),
  description: z
    .string({ message: "product description is required" })
    .trim()
    .min(1)
    .max(1000),
  variants: z.array(productVariantGeneric),
});

export const createProductSchema = z.object({
  body: productGeneric.extend({
    variants: productGeneric.shape.variants.default([]),
  }),
});
