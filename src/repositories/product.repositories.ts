import { eq, and, Update } from "drizzle-orm";
import { db } from "../db/connection";
import {
  CreateProductRequest,
  Product,
  UpdateProductRequest,
} from "../types/products.types";
import { products } from "../db/schema";

export class ProductRepository {
  async findById(id: string): Promise<Product | null> {
    const result = await db.select().from(products).where(eq(products.id, id));
    if (result[0]) {
      const product = result[0];
      return {
        ...product,
        price: parseFloat(product.price),
      } as Product;
    }
    return null;
  }
  async getAllProductsByUserId(userId: string): Promise<Product[]> {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.userId, userId));
    return result.map((product) => ({
      ...product,
      price: parseFloat(product.price),
    })) as Product[];
  }
  async createProduct(
    productData: CreateProductRequest & { id: string; userId: string }
  ): Promise<Product> {
    await db.insert(products).values({
      id: productData.id,
      name: productData.name,
      description: productData.description,
      price: productData.price.toString(),
      quantity: productData.quantity,
      minQuantity: productData.minQuantity,
      userId: productData.userId,
    });
    const createdProduct = await this.findById(productData.id);
    if (!createdProduct) {
      throw new Error("Failed to create product");
    }
    return createdProduct;
  }
  async updateProduct(
    id: string,
    userId: string,
    updatedData: Partial<UpdateProductRequest>
  ): Promise<Product> {
    await db
      .update(products)
      .set({
        name: updatedData.name,
        description: updatedData.description,
        price: updatedData.price ? updatedData.price.toString() : undefined,
        quantity: updatedData.quantity,
        minQuantity: updatedData.minQuantity,
      })
      .where(and(eq(products.id, id), eq(products.userId, userId)));
    const updatedProduct = await this.findById(id);
    if (!updatedProduct) {
      throw new Error("Failed to update product");
    }
    return updatedProduct;
  }
  async deleteProduct(id: string, userId: string): Promise<void> {
    await db
      .delete(products)
      .where(and(eq(products.id, id), eq(products.userId, userId)));
  }
  async deleteAllProductsByUserId(userId: string): Promise<void> {
    await db.delete(products).where(eq(products.userId, userId));
  }
}
