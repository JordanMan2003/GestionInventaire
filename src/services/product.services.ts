import { ProductRepository } from "../repositories/product.repositories";
import { CreateProductRequest } from "../types/products.types";

const productRepository = new ProductRepository();
export class ProductService {
  async getProductById(id: string) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }
  async getAllProductsByUserId(userId: string) {
    const products = await productRepository.getAllProductsByUserId(userId);
    if (!products) {
      throw new Error("No products found for this user");
    }
    return products;
  }
  async createProduct(
    productData: CreateProductRequest & { id: string; userId: string }
  ) {
    const existingProduct = await productRepository.findById(productData.id);
    if (existingProduct) {
      throw new Error("Product with this ID already exists");
    }
    const newProduct = productRepository.createProduct(productData);

    return newProduct;
  }
}
