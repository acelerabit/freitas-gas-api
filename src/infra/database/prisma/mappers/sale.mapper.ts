import { Sale } from 'src/application/entities/sale';
import { Prisma } from '@prisma/client';
import { Product } from '@/application/entities/product';

export class PrismaSalesMapper {
  static toDomain(sale: any) {
    const newSale = new Sale(
      sale.customerId,
      sale.deliverymanId,
      sale.products.map((product) => {
        return new Product(
          product.id,
          product.product.type,
          product.product.status,
          product.product.price,
          product.product.quantity,
        );
      }),
      sale.paymentMethod,
      sale.total,
      sale.type,
      sale.customer ?? null,
      sale?.transaction?.user ?? null,
      sale.createdAt,
    );

    return newSale;
  }
}
