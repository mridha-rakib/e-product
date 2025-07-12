import { Document, Model } from "mongoose";

import { TDocument } from "@/ts/types/document.type";

export interface ICategory extends TDocument {
  name: string;
  description?: string;
}

export interface ICategoryDocument extends ICategory, Document<string> {}
export interface ICategoryModel extends Model<ICategoryDocument> {}
export interface ICategoryMethods extends ICategoryDocument {}
