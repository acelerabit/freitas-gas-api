import { Sale } from 'src/application/entities/sale';
import { PaymentMethod, Prisma } from '@prisma/client';
import { Product } from '@/application/entities/product';

export class PrismaSalesMapper {
  static toDomain(sale: any) {
    const newSale = new Sale(
      sale.customerId,
      {
        deliverymanId: sale.transaction.userId ?? null,
        paymentMethod: sale.paymentMethod,
        products: sale.products.map((product) => {
          return new Product(
            {
              productId: product.productId,
              salePrice: product.salePrice,
              price: product.product.price,
              quantity: product.quantity,
              status: product.product.status,
              type: product.product.type,
              typeSale: product.typeSale,
            },
            product.id,
          );
        }),
        totalAmount: sale.total,
        type: sale.type,
        createdAt: sale.createdAt,
        customer: sale.customer ?? null,
        deliveryman: sale?.transaction?.user ?? null,
        transactionId: sale?.transaction?.id,
        paid: sale.paid,
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
      paid: sale.paid,
    };
  }
}
