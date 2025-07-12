import { Router } from "express";
import { CategoryController } from "@/controllers/category.controller";

const categoryRouter = Router();

categoryRouter.post("/category", CategoryController.createCategory);

export default categoryRouter;
