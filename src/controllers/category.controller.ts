import type { Request, Response } from "express";
import statuses from "http-status";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import {
  createCategorySchema,
  getCategoriesSchema,
  getCategorySchema,
  updateCategorySchema,
} from "@/schema/category.schema";
import { CategoryService } from "@/service/category.service";
import { zParse } from "@/utils/validators.utils";

const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { body: data } = await zParse(createCategorySchema, req);
  const response = await CategoryService.createCategory(data);

  return res.status(statuses.CREATED).json({
    success: true,
    message: "Category created successfully",
    data: response,
  });
});

const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const { query } = await zParse(getCategoriesSchema, req);
  const categories = await CategoryService.getCategories(query);
  return res.status(statuses.OK).send(categories);
});

const getCategory = asyncHandler(async (req: Request, res: Response) => {
  const {
    params: { id },
  } = await zParse(getCategorySchema, req);

  const cart = await CategoryService.getCategory(id);

  return res.status(statuses.OK).send(cart);
});

const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const {
    params: { id },
    body: data,
  } = await zParse(updateCategorySchema, req);

  const response = await CategoryService.updateCategory(id, data);

  return res.status(statuses.OK).send(response);
});

export const CategoryController = {
  createCategory,
  getCategories,
  getCategory,
};
