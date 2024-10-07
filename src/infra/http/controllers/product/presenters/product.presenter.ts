import { Product } from '@/application/entities/product';

export class ProductsPresenters {
  static toHTTP(product: Product) {
    return {
      id: product.id,
      type: product.type,
      price: product.price,
      quantity: product.quantity,
      status: product.status,
    };
  }
}
