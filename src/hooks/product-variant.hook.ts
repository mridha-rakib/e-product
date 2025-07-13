import type { CallbackWithoutResultAndOptionalError } from "mongoose";
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
