import { Router } from "express";
import { CategoryController } from "@/controllers/category.controller";

const categoryRouter = Router();

categoryRouter.post("/", CategoryController.createCategory);
categoryRouter.get("/:id", CategoryController.getCategory);
categoryRouter.get("/", CategoryController.getCategories);

export default categoryRouter;
