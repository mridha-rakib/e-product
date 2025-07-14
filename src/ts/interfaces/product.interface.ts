/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Document, Model, Schema, AggregatePaginateModel } from 'mongoose';
import { TDocument } from '@/ts/types/document.type';
import { ICategory } from './category.interface';
import { Url } from 'url';

export interface IProduct extends TDocument {
  name: string;
  productCode: string;
  image?: Url;
  description: string;
  category: Schema.Types.ObjectId;
  variants?: TDocument['_id'][];
}

export interface IProductVariant extends TDocument {
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  stock: number;
  status?: 'out-of-stock' | 'in-stock';
}

export interface IProductPopulated extends Omit<IProduct, 'category' | 'variants'> {
  category: ICategory;
  variants: IProductVariant[];
}

export interface IProductDocument extends IProduct, Document<string> {}
export interface IProductModel extends Model<IProductDocument> {}
export interface IProductMethods extends IProductDocument {}
export interface IProductPaginateModel extends AggregatePaginateModel<IProductDocument> {}

export interface IProductVariantDocument extends IProductVariant, Document<string> {}
export interface IProductVariantModel extends Model<IProductVariantDocument> {}
export interface IProductVariantMethods extends IProductVariantDocument {}
