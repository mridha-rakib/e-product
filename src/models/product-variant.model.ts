import { ProductStatus } from "@/enums/product-status.enum";
import { model, Schema } from "mongoose";

const ProductVariantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    productCode: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
    },
    image: {
      type: String,
      required: [true, "Please add an image URL"],
      validate: {
        validator: function (v: any) {
          return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
        },
        message: (props: any) => `${props.value} is not a valid URL!`,
      },
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    status: ProductStatus,
  },
  { timestamps: true, collation: { locale: "en" } }
);
