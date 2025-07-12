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
      required: [true, "Product image URL is required"],
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: ["out-of-stock", "in-stock"],
    },
  },
  { timestamps: true, collation: { locale: "en" } }
);
