import { Router } from "express";
import categoryRouter from "./category.route";
import productRouter from "./product.route";

const rootRouter = Router();

const moduleRoutes = [
  { path: "/category", route: categoryRouter },
  { path: "/products", route: productRouter },
];

moduleRoutes.forEach(({ path, route }) => rootRouter.use(path, route));

export default rootRouter;
