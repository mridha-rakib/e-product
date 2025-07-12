import { model, Schema } from "mongoose";

import { aggregatePaginatePlugin } from "@/config/paginate.config";
import {
  IProductDocument,
  IProductMethods,
  IProductModel,
  IProductPaginateModel,
} from "@/ts/interfaces/product.interface";

const ProductSchema = new Schema<
  IProductDocument,
  IProductModel,
  IProductMethods
>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    variants: [{ type: Schema.Types.ObjectId, ref: "ProductVariant" }],
  },
  { timestamps: true, collation: { locale: "en" } }
);

ProductSchema.plugin(aggregatePaginatePlugin);

ProductSchema.index({ name: "text", description: "text" });

export const ProductModel = model<IProductDocument, IProductPaginateModel>(
  "Product",
  ProductSchema
);
