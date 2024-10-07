import { Product } from '@/application/entities/product';

export class PrismaProductsMapper {
  static toDomain(product: any) {
    return new Product(
      {
        price: product.price,
        quantity: product.quantity,
        status: product.status,
        type: product.type,
      },
      product.id,
    );
  }

  static toPrisma(product: Product) {
    return {
      price: product.price,
      quantity: product.quantity,
      status: product.status,
      type: product.type,
      id: product.id,
    };
  }
}
