import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { ProductController } from "../controllers/product.controller";

export const createProductRoutes = (): Router => {
  const productController = new ProductController();
  const router = Router();

  router.get("/:id", authMiddleware, productController.getProductById);
  router.get("/", authMiddleware, productController.getAllProductsByUserId);
  router.post("/", authMiddleware, productController.createProduct);
  router.put("/:id", authMiddleware, productController.updateProduct);
  router.delete("/:id", authMiddleware, productController.deleteProduct);
  router.delete(
    "/",
    authMiddleware,
    productController.deleteAllProductsByUserId
  );
  return router;
};
