import { model, Schema } from "mongoose";

import { aggregatePaginatePlugin } from "@/config/paginate.config";
import {
  IProductDocument,
  IProductMethods,
  IProductModel,
  IProductPaginateModel,
} from "@/ts/interfaces/product.interface";
import { preSaveProductHook, preUpdateProductHook } from "@/hooks/product.hook";

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
    productCode: {
      type: String,
      unique: true,
      trim: true,
    },
    image: {
      type: String,
      validate: {
        validator: function (v: any) {
          return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
        },
        message: (props: any) => `${props.value} is not a valid URL!`,
      },
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    variants: [{ type: Schema.Types.ObjectId, ref: "ProductVariant" }],
  },
  { timestamps: true, collation: { locale: "en" } }
);

ProductSchema.plugin(aggregatePaginatePlugin);
ProductSchema.pre("save", preSaveProductHook);
ProductSchema.pre("findOneAndUpdate", preUpdateProductHook);

ProductSchema.index({ name: "text", description: "text" });

export const ProductModel = model<IProductDocument, IProductPaginateModel>(
  "Product",
  ProductSchema
);
