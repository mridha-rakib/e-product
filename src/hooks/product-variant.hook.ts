import type { CallbackWithoutResultAndOptionalError, Query, UpdateQuery } from 'mongoose';
import { calculateCurrentPrice, getProductStatus } from '@/utils/product.utils';

import { IProductVariantDocument } from '@/ts/interfaces/product.interface';
import { logger } from '@/middlewares/pino-logger';

export const preSaveProductVariantHook = async function (
  this: IProductVariantDocument,
  next: CallbackWithoutResultAndOptionalError
) {
  Object.assign(this, {
    price: calculateCurrentPrice(this.originalPrice, this.discount),
    status: getProductStatus(this.stock),
  });

  return next();
};

export const preUpdateProductVariantHook = async function (
  this: Query<IProductVariantDocument, object>,
  next: CallbackWithoutResultAndOptionalError
) {
  const update = this.getUpdate() as UpdateQuery<IProductVariantDocument>;

  if (!update || typeof update !== 'object') {
    return next();
  }

  try {
    if (update.$set) {
      const setData = update.$set;

      if (setData.originalPrice !== undefined || setData.discount !== undefined) {
        const result = await this.model.findOne(this.getQuery()).lean().exec();

        let currentDoc: any = null;
        if (result) {
          currentDoc = Array.isArray(result) ? result[0] : result;
        }

        if (currentDoc) {
          const originalPrice = setData.originalPrice ?? currentDoc.originalPrice ?? 0;
          const discount = setData.discount ?? currentDoc.discount ?? 0;
          setData.price = await calculateCurrentPrice(originalPrice, discount);
        }
      }
      if (setData.stock !== undefined) {
        setData.status = getProductStatus(setData.stock);
      }
    } else {
      if (update.originalPrice !== undefined || update.discount !== undefined) {
        const result = await this.model.findOne(this.getQuery()).lean().exec();
        let currentDoc: any = null;

        if (result) {
          currentDoc = Array.isArray(result) ? result[0] : result;
        }

        if (currentDoc) {
          const originalPrice = update.originalPrice ?? currentDoc.originalPrice ?? 0;
          const discount = update.discount ?? currentDoc.discount ?? 0;

          update.price = await calculateCurrentPrice(originalPrice, discount);
        }
      }

      if (update.stock !== undefined) {
        update.status = getProductStatus(update.stock);
      }
    }
  } catch (error) {
    logger.error('Error in preUpdateProductVariantHook:', error);
  }

  return next();
};
