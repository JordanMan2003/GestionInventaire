export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  minQuantity: number;
  quantity: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  quantity: number;
  minQuantity: number;
}
export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  minQuantity?: number;
}
