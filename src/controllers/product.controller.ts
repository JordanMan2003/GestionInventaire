import { NextFunction, Request, Response } from "express";
import { ProductService } from "../services/product.services";
import { randomUUID } from "crypto";
import {
  CreateProductRequest,
  UpdateProductRequest,
} from "../types/products.types";
import { Update } from "drizzle-orm";

const productService = new ProductService();
export class ProductController {
  getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await productService.getProductById(req.params.id);
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  };

  getAllProductsByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const products = await productService.getAllProductsByUserId(userId);
      res.json(products);
    } catch (error) {
      next(error);
    }
  };

  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    const product: CreateProductRequest = req.body;
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const newProduct = await productService.createProduct({
        ...product,
        id: randomUUID(),
        userId,
      });
      res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  };
  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    const updateProductData: UpdateProductRequest = req.body;
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const updatedProduct = await productService.updateProduct(
        req.params.id,
        userId,
        updateProductData
      );
      res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      await productService.deleteProduct(req.params.id, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
  deleteAllProductsByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      await productService.deleteAllProductsByUserId(userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
