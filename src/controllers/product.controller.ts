import statuses from "http-status";

import {
  createProductSchema,
  deleteProductSchema,
  deleteProductVariantSchema,
  getProductSchema,
  getProductsSchema,
  updateProductSchema,
} from "@/schema/product.schema";

import { zParse } from "@/utils/validators.utils";
import { asyncHandler } from "@/middlewares/async-handler.middleware";
import { Request, Response } from "express";
import { NotFoundError } from "@/utils/error-handler.utils";
import { ProductService } from "@/service/product.service";
import { IUploadResult } from "@/ts/types/file-upload.type";


const createProduct = asyncHandler(async (req: Request, res: Response) => {
  let uploadResult: IUploadResult | undefined;

  if (!req.file) {
    throw new NotFoundError("Product image required");
  } else {
    uploadResult = await ProductService.createImageFileLink(req);
  }

  req.body.image = uploadResult!.url;

  const { body: data } = await zParse(createProductSchema, req);

  const response = await ProductService.createProduct(data);

  return res.status(statuses.CREATED).send(response);
});

export const ProductController = {
  createProduct,
};

/*   // const productCode = generateProductCode(req.body.name);
  // req.body.productCode = productCode;  */
