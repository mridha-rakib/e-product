import { Router } from "express";
import { ProductController } from "@/controllers/product.controller";
import upload from "@/utils/upload.utils";

const productRouter = Router();

productRouter.post(
  "/",
  upload.single("image"),
  ProductController.createProduct
);

export default productRouter;
