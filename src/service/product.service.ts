import fs from 'fs/promises';
import {
  IProduct,
  IProductPopulated,
  IProductVariant,
} from '@/ts/interfaces/product.interface';
import { TProductCreate, TProductQuery, TProductUpdate } from '@/ts/types/product.type';
import { CloudinaryService } from './cloudinary.service';
import { logger } from '@/middlewares/pino-logger';
import { IRequest, IUploadResult } from '@/ts/types/file-upload.type';
import { NotFoundError } from '@/utils/error-handler.utils';
import { ProductVariantModel } from '@/models/product-variant.model';
import { ProductModel } from '@/models/product.model';
import { PipelineStage, Types } from 'mongoose';
import { paginateConfig } from '@/config/paginate.config';

export const ProductService = {
  async createProduct(product: TProductCreate) {
    let variants: IProduct['variants'] = [];

    if (product?.variants?.length) {
      const createdVariants = await ProductVariantModel.create(product.variants);

      variants = createdVariants.map(variant => variant._id);
    }

    const createdProduct = await ProductModel.create({ ...product, variants })
      .then(doc => doc.populate('variants'))
      .then(doc =>
        doc.populate({
          path: 'category',
        })
      );

    return createdProduct.toObject<IProductPopulated>();
  },

  async getProducts(query: TProductQuery) {
    const conditions: PipelineStage[] = [];

    const activeQuery: Record<string, boolean> = {
      category: !!query.category,
      variants: !!(query.startPrice || query.endPrice || query.hasEmptyStock),
    };

    const populateDictionary: Record<string, PipelineStage[]> = {
      category: [
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $unwind: {
            path: '$category',
            preserveNullAndEmptyArrays: true,
          },
        },
      ],
      variants: [
        {
          $lookup: {
            from: 'productvariants',
            localField: 'variants',
            foreignField: '_id',
            as: 'variants',
          },
        },
      ],
    };

    const sortByDictionary = {
      term: { name: query.orderBy },
      price: { 'variants.price': query.orderBy },
      stock: { 'variants.stock': query.orderBy },
      status: { 'variants.status': query.orderBy },
      createdAt: { createdAt: query.orderBy },
      updatedAt: { updatedAt: query.orderBy },
    } as const;

    if (query.term) conditions.unshift({ $match: { $text: { $search: query.term } } });

    if (query.category)
      conditions.push(...populateDictionary.category, {
        $match: { 'category.name': query.category },
      });

    if (query.startPrice || query.endPrice || query.hasEmptyStock)
      conditions.push(...populateDictionary.variants);

    if (query.startPrice || query.endPrice)
      conditions.push({
        $match: {
          'variants.price': {
            ...(query.startPrice && { $gte: query.startPrice }),
            ...(query.endPrice && { $lte: query.endPrice }),
          },
        },
      });

    if (query.hasEmptyStock)
      conditions.push({
        $match: {
          'variants.stock': { $lte: 0 },
        },
      });

    const keysToPopulate = Object.keys(populateDictionary).filter(
      key => !activeQuery[key]
    );

    const populateDictionaryFiltered = Object.fromEntries(
      Object.entries(populateDictionary).filter(([key]) => keysToPopulate.includes(key))
    );

    const populateStages = Object.values(populateDictionaryFiltered).flat();

    conditions.push(...populateStages);

    const aggregation = ProductModel.aggregate<IProductPopulated>(conditions);

    return await ProductModel.aggregatePaginate(aggregation, {
      ...paginateConfig,
      page: query.page,
      limit: query.limit,
      sort: sortByDictionary[query.sortBy],
    });
  },

  async getProduct(productCode: IProduct['productCode']) {
    return await ProductModel.findOne({ productCode })
      .populate('variants category')
      .lean<IProductPopulated>();
  },

  async updateProduct(id: IProduct['_id'], product: TProductUpdate) {
    let variants: IProduct['variants'] = [];

    if (product?.variants?.length) {
      const variantPromises = product.variants.map(async ({ _id, ...variant }) => {
        if (_id) {
          return await ProductVariantModel.findByIdAndUpdate(
            _id,
            { $set: variant },
            { new: true, upsert: false }
          );
        } else {
          return await ProductVariantModel.create(variant);
        }
      });

      const updatedVariants = await Promise.all(variantPromises);
      variants = updatedVariants.filter(v => v !== null).map(v => v!._id.toString());
    }

    const data = { ...product };
    delete data.variants;
    return await ProductModel.findByIdAndUpdate(
      id,
      { ...data, ...(variants.length && { variants }) },
      { new: true }
    )
      .populate('category variants')
      .lean<IProductPopulated>();
  },

  async deleteProduct(id: IProduct['_id']) {
    return await ProductModel.findByIdAndDelete(id).lean<IProduct>();
  },

  async deleteProductVariant(id: IProduct['_id'], variantId: IProductVariant['_id']) {
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
        await CloudinaryService.deleteImage(uploadResult.public_id).catch(console.error);
      }
      logger.error(`Update product controller error: ${error.message}`);
      throw new NotFoundError('Image upload failed');
    }
  },

  async cleanupFile(filePath: string) {
    if (!filePath) return;

    try {
      await fs.unlink(filePath);
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        console.error('File cleanup error:', error.message);
      }
      throw error;
    }
  },
};
