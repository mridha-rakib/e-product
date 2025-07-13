import { CategoryModel } from "@/models/category.model";
import { ProductModel } from "@/models/product.model";
import { CallbackWithoutResultAndOptionalError } from "mongoose";

import { generateProductCode } from "@/utils/product.utils";

import { IProductDocument } from "@/ts/interfaces/product.interface";
import { ConflictError, NotFoundError } from "@/utils/error-handler.utils";

export const preSaveProductHook = async function (
  this: IProductDocument,
  next: CallbackWithoutResultAndOptionalError
) {
  const product = this;

  product.productCode = generateProductCode(product.name);

  const [productExists, categoryExists] = await Promise.all([
    ProductModel.exists({ productCode: product.productCode }),
    CategoryModel.exists({ _id: product.category }),
  ]);

  if (productExists) throw new ConflictError("Product already exists");

  if (!categoryExists) throw new NotFoundError("Category not found");

  return next();
};
