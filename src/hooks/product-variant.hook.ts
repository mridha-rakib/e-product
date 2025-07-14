import type {
  CallbackWithoutResultAndOptionalError,
  Query,
  UpdateQuery,
} from "mongoose";
import { calculateCurrentPrice, getProductStatus } from "@/utils/product.utils";

import { IProductVariantDocument } from "@/ts/interfaces/product.interface";

export const preSaveProductVariantHook = async function (
  this: IProductVariantDocument,
  next: CallbackWithoutResultAndOptionalError
) {
  let variant = this;

  Object.assign(variant, {
    price: calculateCurrentPrice(variant.originalPrice, variant.discount),
    status: getProductStatus(variant.stock),
  });

  return next();
};

export const preUpdateProductVariantHook = async function (
  this: Query<IProductVariantDocument, {}>,
  next: CallbackWithoutResultAndOptionalError
) {
  const update = this.getUpdate() as UpdateQuery<IProductVariantDocument>;

  if (!update || typeof update !== "object") {
    return next();
  }

  try {
    // $set operation handle করুন
    if (update.$set) {
      const setData = update.$set;

      // originalPrice বা discount change হলে price recalculate করুন
      if (
        setData.originalPrice !== undefined ||
        setData.discount !== undefined
      ) {
        const result = await this.model.findOne(this.getQuery()).lean().exec();

        let currentDoc: any = null;
        if (result) {
          currentDoc = Array.isArray(result) ? result[0] : result;
        }

        if (currentDoc) {
          const originalPrice =
            setData.originalPrice ?? currentDoc.originalPrice ?? 0;
          const discount = setData.discount ?? currentDoc.discount ?? 0;

          // এখানে await যোগ করুন
          setData.price = await calculateCurrentPrice(originalPrice, discount);
        }
      }

      // stock change হলে status update করুন
      if (setData.stock !== undefined) {
        setData.status = getProductStatus(setData.stock);
      }
    }

    // Direct update handle করুন
    else {
      if (update.originalPrice !== undefined || update.discount !== undefined) {
        const result = await this.model.findOne(this.getQuery()).lean().exec();
        let currentDoc: any = null;

        if (result) {
          currentDoc = Array.isArray(result) ? result[0] : result;
        }

        if (currentDoc) {
          const originalPrice =
            update.originalPrice ?? currentDoc.originalPrice ?? 0;
          const discount = update.discount ?? currentDoc.discount ?? 0;

          // এখানে await যোগ করুন
          update.price = await calculateCurrentPrice(originalPrice, discount);
        }
      }

      if (update.stock !== undefined) {
        update.status = getProductStatus(update.stock);
      }
    }
  } catch (error) {
    console.error("Error in preUpdateProductVariantHook:", error);
  }

  return next();
};
