import type { Request, Response } from "express";

import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { createCategorySchema } from "@/schema/category.schema";
import { CategoryService } from "@/service/category.service";

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { body } = createCategorySchema.parse(req.body);

    const response = await CategoryService.createCategory(body);
  }
);

export const CategoryController = {
  createCategory,
};
