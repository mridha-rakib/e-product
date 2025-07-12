import { z } from "zod";
import { createProductSchema } from "@/schema/product.schema";

export type TProductCreate = z.infer<typeof createProductSchema>["body"];
