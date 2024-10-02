import { Sale } from '@/application/entities/sale';

export class SalesPresenters {
  static toHTTP(sale: Sale) {
    return {
      customer: sale.customer,
      deliveryman: sale.deliveryman,
      products: sale.products.map((product) => {
        return {
          id: product.id,
          type: product.type,
          price: product.price,
          quantity: product.quantity,
          status: product.status,
        };
      }),
      paymentMethod: sale.paymentMethod,
      total: sale.totalAmount,
      saleType: sale.type,
      createdAt: sale.createdAt,
    };
  }
}
