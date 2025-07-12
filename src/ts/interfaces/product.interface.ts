import { Document, Model, AggregatePaginateModel } from "mongoose";
import { TDocument } from "@/ts/types/document.type";

export interface IProduct extends TDocument {
  name: string;
  description: string;
  //   category: TDocument["_id"];
  variants?: TDocument["_id"][];
}

export interface IProductVariant extends TDocument {
  name: string;
  productCode: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: String;
  stock: number;
  status?: "out-of-stock" | "in-stock";
}

export interface IProductDocument extends IProduct, Document<string> {}
export interface IProductModel extends Model<IProductDocument> {}
export interface IProductMethods extends IProductDocument {}
export interface IProductPaginateModel
  extends AggregatePaginateModel<IProductDocument> {}

export interface IProductVariantDocument
  extends IProductVariant,
    Document<string> {}
export interface IProductVariantModel extends Model<IProductVariantDocument> {}
export interface IProductVariantMethods extends IProductVariantDocument {}
