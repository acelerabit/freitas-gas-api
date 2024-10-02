import { Sale } from 'src/application/entities/sale';
import { Prisma } from '@prisma/client';
import { Product } from '@/application/entities/product';

export class PrismaSalesMapper {
  static toDomain(sale: any) {
    const newSale = new Sale(
      sale.customerId,
      {
        deliverymanId: sale.deliverymanId,
        paymentMethod: sale.paymentMethod,
        products: sale.products.map((product) => {
          return new Product(product.id, {
            price: product.product.price,
            quantity: product.product.quantity,
            status: product.product.status,
            type: product.product.type,
          });
        }),
        totalAmount: sale.total,
        type: sale.type,
        createdAt: sale.createdAt,
        customer: sale.customer ?? null,
        deliveryman: sale?.transaction?.user ?? null,
      },
      sale.id,
    );

    return newSale;
  }
}
