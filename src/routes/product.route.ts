import { Router } from 'express';
import { ProductController } from '@/controllers/product.controller';
import upload from '@/utils/upload.utils';

const productRouter = Router();

productRouter
  .route('/')
  .post(upload.single('image'), ProductController.createProduct)
  .get(ProductController.getProducts);
productRouter.route('/:productCode').get(ProductController.getProduct);
productRouter
  .route('/:id')
  .put(upload.single('image'), ProductController.updateProduct)
  .delete(ProductController.deleteProduct);
productRouter
  .route('/:id/variants/:idVariant')
  .delete(ProductController.deleteProductVariant);

export default productRouter;
