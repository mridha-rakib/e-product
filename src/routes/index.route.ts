import { Router } from 'express';
import categoryRouter from './category.route';
import productRouter from './product.route';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from '../../swagger-output.json';

const rootRouter = Router();
rootRouter.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
const moduleRoutes = [
  { path: '/category', route: categoryRouter },
  { path: '/products', route: productRouter },
];

moduleRoutes.forEach(({ path, route }) => rootRouter.use(path, route));

export default rootRouter;
