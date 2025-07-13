import { z } from "zod";
import {
  createProductSchema,
  getProductsSchema,
  updateProductSchema,
} from "@/schema/product.schema";

export type TProductCreate = z.infer<typeof createProductSchema>["body"];
export type TProductUpdate = z.infer<typeof updateProductSchema>["body"];
export type TProductQuery = z.infer<typeof getProductsSchema>["query"];
