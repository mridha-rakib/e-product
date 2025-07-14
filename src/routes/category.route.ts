import { Router } from 'express';
import { CategoryController } from '@/controllers/category.controller';

const categoryRouter = Router();

categoryRouter
  .route('/')
  .post(CategoryController.createCategory)
  .get(CategoryController.getCategories);
categoryRouter
  .route('/:id')
  .get(CategoryController.getCategory)
  .put(CategoryController.updateCategory)
  .delete(CategoryController.deleteCategory);

export default categoryRouter;
