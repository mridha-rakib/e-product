import { model, Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
  },
  { timestamps: true, collation: { locale: "en" } }
);

export const CategoryModel = model("Category", CategorySchema);
