import { CallbackWithoutResultAndOptionalError, Query, UpdateQuery } from 'mongoose';

import { CategoryModel } from '@/models/category.model';
import { ICategoryDocument } from '@/ts/interfaces/category.interface';
import { NotFoundException } from '@/utils/error-handler.utils';

export const preUpdateCategoryHook = async function (
  this: Query<ICategoryDocument, object>,
  next: CallbackWithoutResultAndOptionalError
) {
  const category = await CategoryModel.findOne(this.getQuery()).lean();
  if (!category) {
    throw new NotFoundException('Category not found');
  }

  const data = this.getUpdate() as ICategoryDocument & UpdateQuery<ICategoryDocument>;

  this.setUpdate({ ...data });

  return next();
};
