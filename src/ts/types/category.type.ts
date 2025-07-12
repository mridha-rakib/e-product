import { z } from "zod";

// Schemas
import {
  createCategorySchema,
  getCategoriesSchema,
  updateCategorySchema,
} from "@/schema/category.schema";

export type TCategoryCreate = z.infer<typeof createCategorySchema>["body"];
export type TCategoryQuery = z.infer<typeof getCategoriesSchema>["query"];
export type TCategoryUpdate = z.infer<typeof updateCategorySchema>["body"];
