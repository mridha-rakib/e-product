import fs from "fs/promises";
import {
  IProduct,
  IProductPopulated,
  IProductVariant,
} from "@/ts/interfaces/product.interface";
import { TProductCreate, TProductUpdate } from "@/ts/types/product.type";
import { CloudinaryService } from "./cloudinary.service";
import { logger } from "@/middlewares/pino-logger";
import { IRequest, IUploadResult } from "@/ts/types/file-upload.type";
import { NotFoundError } from "@/utils/error-handler.utils";
import { ProductVariantModel } from "@/models/product-variant.model";
import { ProductModel } from "@/models/product.model";
import { Types } from "mongoose";

export const ProductService = {
  async createProduct(product: TProductCreate) {
    let variants: IProduct["variants"] = [];

    if (product?.variants?.length) {
      const createdVariants = await ProductVariantModel.create(
        product.variants
      );

      variants = createdVariants.map((variant) => variant._id);
    }

    const createdProduct = await ProductModel.create({ ...product, variants })
      .then((doc) => doc.populate("variants"))
      .then((doc) =>
        doc.populate({
          path: "category",
        })
      );

    return createdProduct.toObject<IProductPopulated>();
  },

  async updateProduct(id: IProduct["_id"], product: TProductUpdate) {
    let variants: IProduct["variants"] = [];

    if (product?.variants?.length) {
      const upsertedVariants = await ProductVariantModel.bulkWrite(
        product.variants.map(({ _id, ...variant }) => ({
          updateOne: {
            filter: { _id },
            update: { $set: variant },
            upsert: true,
          },
        }))
      );

      const upsertedVariantsIds: Types.ObjectId[] = Object.values(
        upsertedVariants.upsertedIds
      );

      if (upsertedVariantsIds.length)
        variants = upsertedVariantsIds.map((upsertedIds) =>
          upsertedIds.toString()
        );
    }

    const data = { ...product, ...(variants.length && { variants }) };

    return await ProductModel.findByIdAndUpdate(id, data, {
      new: true,
    })
      .populate("category variants")
      .lean<IProductPopulated>();
  },

  async deleteProduct(id: IProduct["_id"]) {
    return await ProductModel.findByIdAndDelete(id).lean<IProduct>();
  },

  async deleteProductVariant(
    id: IProduct["_id"],
    variantId: IProductVariant["_id"]
  ) {
    return await Promise.all([
      ProductModel.findByIdAndUpdate(
        id,
        { $pull: { variants: variantId } },
        { new: true }
      ).lean<IProduct>(),
      ProductVariantModel.findByIdAndDelete(variantId).lean<IProductVariant>(),
    ]);
  },

  async createImageFileLink(req: IRequest): Promise<IUploadResult> {
    const filePath = req.file?.path as string;
    let uploadResult;

    try {
      await fs.access(filePath!);

      uploadResult = await CloudinaryService.uploadImage(filePath);
      return uploadResult;
    } catch (error: any) {
      if (filePath) {
        await ProductService.cleanupFile(filePath);
      }

      if (uploadResult?.public_id) {
        await CloudinaryService.deleteImage(uploadResult.public_id).catch(
          console.error
        );
      }
      logger.error(`Update product controller error: ${error.message}`);
      throw new NotFoundError("Image upload failed");
    }
  },

  async cleanupFile(filePath: string) {
    if (!filePath) return;

    try {
      await fs.unlink(filePath);
    } catch (error: any) {
      if (error.code !== "ENOENT") {
        console.error("File cleanup error:", error.message);
      }
      throw error;
    }
  },
};
