import { eq } from "drizzle-orm";
import { db } from "../db/connection";
import { CreateProductRequest, Product } from "../types/products.types";
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

  // Repository methods would go here
}
