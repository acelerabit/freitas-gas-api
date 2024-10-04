import { Sale } from 'src/application/entities/sale';
import { PaymentMethod, Prisma } from '@prisma/client';
import { Product } from '@/application/entities/product';

export class PrismaSalesMapper {
  static toDomain(sale: any) {
    const newSale = new Sale(
      sale.customerId,
      {
        deliverymanId: sale.transaction.userId,
        paymentMethod: sale.paymentMethod,
        products: sale.products.map((product) => {
          return new Product(product.id, {
            productId: product.productId,
            salePrice: product.salePrice,
            price: product.product.price,
            quantity: product.quantity,
            status: product.product.status,
            type: product.product.type,
          });
        }),
        totalAmount: sale.total,
        type: sale.type,
        createdAt: sale.createdAt,
        customer: sale.customer ?? null,
        deliveryman: sale?.transaction?.user ?? null,
        transactionId: sale?.transaction?.id,
      },
      sale.id,
    );

    return newSale;
  }

  static toPrisma(sale: Sale) {
    return {
      id: sale.id,
      paymentMethod: sale.paymentMethod as PaymentMethod,
      total: sale.totalAmount,
      customerId: sale.customerId,
      transactionId: sale.transactionId,
      createdAt: sale.createdAt,
    };
  }
}
