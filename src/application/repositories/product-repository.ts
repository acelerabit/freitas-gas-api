import { BottleStatus, ProductType } from '@prisma/client';
import { Product } from '../entities/product';

export abstract class ProductRepository {
  abstract findAll(): Promise<Product[]>;
  abstract findById(productId: string): Promise<Product | null>;
  abstract findByTypeAndStatus(
    type: ProductType,
    status: BottleStatus,
  ): Promise<Product | null>;
  abstract createProduct(product: Product): Promise<void>;
  abstract updateProduct(product: Product): Promise<void>;
  abstract deleteProduct(productId: string): Promise<void>;
}
