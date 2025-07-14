import statuses from 'http-status';

import {
  createProductSchema,
  deleteProductSchema,
  deleteProductVariantSchema,
  getProductSchema,
  getProductsSchema,
  updateProductSchema,
} from '@/schema/product.schema';

import { zParse } from '@/utils/validators.utils';
import { asyncHandler } from '@/middlewares/async-handler.middleware';
import { Request, Response } from 'express';
import { ProductService } from '@/service/product.service';
import { IUploadResult } from '@/ts/types/file-upload.type';

const createProduct = asyncHandler(async (req: Request, res: Response) => {
  // let uploadResult: IUploadResult | undefined;

  // if (!req.file) {
  //   throw new NotFoundError("Product image required");
  // } else {
  //   uploadResult = await ProductService.createImageFileLink(req);
  // }

  // req.body.image = uploadResult!.url;

  const { body: data } = await zParse(createProductSchema, req);

  const response = await ProductService.createProduct(data);

  return res.status(statuses.CREATED).send(response);
});

const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const { query } = await zParse(getProductsSchema, req);

  const products = await ProductService.getProducts(query);

  return res.status(statuses.OK).send(products);
});

const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const {
    params: { productCode },
  } = await zParse(getProductSchema, req);

  const product = await ProductService.getProduct(productCode);

  return res.status(statuses.OK).send(product);
});

const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  if (req.file) {
    const uploadResult: IUploadResult = await ProductService.createImageFileLink(req);
    req.body.image = uploadResult!.url;
  }

  const {
    params: { id },
    body: data,
  } = await zParse(updateProductSchema, req);

  const response = await ProductService.updateProduct(id, data);

  return res.status(statuses.OK).send(response);
});

const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const {
    params: { id },
  } = await zParse(deleteProductSchema, req);
  await ProductService.deleteProduct(id);

  return res.status(statuses.NO_CONTENT).send({
    message: 'Product deleted successfully.',
  });
});

const deleteProductVariant = asyncHandler(async (req: Request, res: Response) => {
  const {
    params: { id, idVariant },
  } = await zParse(deleteProductVariantSchema, req);

  await ProductService.deleteProductVariant(id, idVariant);
  return res.sendStatus(statuses.NO_CONTENT);
});

export const ProductController = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  deleteProductVariant,
};
