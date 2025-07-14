import { FilterQuery, Types } from 'mongoose';
import { CategoryModel } from '@/models/category.model';

import { ICategory, ICategoryDocument } from '@/ts/interfaces/category.interface';

import {
  TCategoryCreate,
  TCategoryQuery,
  TCategoryUpdate,
} from '@/ts/types/category.type';
import { ConflictError } from '@/utils/error-handler.utils';

export const CategoryService = {
  async getCategories(query: TCategoryQuery) {
    const conditions: FilterQuery<ICategoryDocument> = {
      ...(query.name && { $text: { $search: query.name } }),
    };

    return await CategoryModel.find(conditions)
      .sort({ [query.sortBy]: query.orderBy })
      .lean<ICategory>();
  },

  async getCategory(id: ICategory['_id']) {
    return await CategoryModel.findById(id).lean<ICategory>();
  },

  async createCategory(category: TCategoryCreate) {
    try {
      const createdCategory = await CategoryModel.create({
        ...category,
      });
      return createdCategory.toObject<ICategory>();
    } catch (error: any) {
      console.log(error);
      if (error.code === 11000) {
        throw new ConflictError('Category with this name already exists');
      }
      throw error;
    }
  },

  async updateCategory(id: ICategory['_id'], category: TCategoryUpdate) {
    return await CategoryModel.findByIdAndUpdate(id, category, {
      new: true,
    }).lean<ICategory>();
  },

  async deleteCategory(id: ICategory['_id']) {
    return await CategoryModel.findByIdAndDelete(id).lean<ICategory>();
  },
};
