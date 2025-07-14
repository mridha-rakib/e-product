import { z } from "zod";
import { objectIdGeneric } from "./common.schema";
import { queryGeneric } from "./query.schema";

export const categoryGeneric = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export const getCategoriesSchema = z.object({
  query: z
    .object({
      name: z.coerce.string().optional(),
      sortBy: z.enum(["name"]).default("name"),
    })
    .extend({
      orderBy: queryGeneric.shape.orderBy,
    }),
});

export const getCategorySchema = z.object({
  params: z.object({
    id: objectIdGeneric,
  }),
});

export const createCategorySchema = z.object({
  body: categoryGeneric,
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: objectIdGeneric,
  }),
  body: categoryGeneric.partial(),
});

export const deleteCategorySchema = z.object({
  params: z.object({
    id: objectIdGeneric,
  }),
});
