import { CategoryModel } from '@/models/category.model';
import { ProductModel } from '@/models/product.model';
import { CallbackWithoutResultAndOptionalError, Query, UpdateQuery } from 'mongoose';

import { generateProductCode } from '@/utils/product.utils';

import { IProductDocument } from '@/ts/interfaces/product.interface';
import { ConflictError, NotFoundException } from '@/utils/error-handler.utils';

export const preSaveProductHook = async function (
  this: IProductDocument,
  next: CallbackWithoutResultAndOptionalError
) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const product = this;

  product.productCode = generateProductCode(product.name);

  const [productExists, categoryExists] = await Promise.all([
    ProductModel.exists({ productCode: product.productCode }),
    CategoryModel.exists({ _id: product.category }),
  ]);

  if (productExists) throw new ConflictError('Product already exists');

  if (!categoryExists) throw new NotFoundException('Category not found');

  return next();
};

export const preUpdateProductHook = async function (
  this: Query<IProductDocument, object>,
  next: CallbackWithoutResultAndOptionalError
) {
  const product = await ProductModel.findOne(this.getQuery()).lean();
  if (!product) throw new NotFoundException('Product not found');

  const data = this.getUpdate() as IProductDocument & UpdateQuery<IProductDocument>;

  if (data.category) {
    const categoryExists = await CategoryModel.exists({ _id: data.category });
    if (!categoryExists) throw new NotFoundException('Category not found.');
  }

  return next();
};
