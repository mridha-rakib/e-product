import { Router } from "express";
import categoryRouter from "./category.route";

const rootRouter = Router();

const moduleRoutes = [{ path: "/category", route: categoryRouter }];

moduleRoutes.forEach(({ path, route }) => rootRouter.use(path, route));

export default rootRouter;
