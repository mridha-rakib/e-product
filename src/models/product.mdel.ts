import { model, Schema } from "mongoose";

import {
  IProduct,
  IProductDocument,
  IProductMethods,
  IProductModel,
  IProductPaginateModel,
} from "@/ts/interfaces/product.interface";

const ProductSchema = new Schema<IProduct, IProductModel, IProductMethods>(
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
    // category: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Category",
    //   required: true,
    // },
    variants: [{ type: Schema.Types.ObjectId, ref: "ProductVariant" }],
  },
  { timestamps: true, collation: { locale: "en" } }
);
