import { Sale } from '@/application/entities/sale';

export class SalesPresenters {
  static toHTTP(sale: Sale) {
    return {
      id: sale.id,
      customer: sale.customer ?? null,
      deliveryman: sale.deliveryman,
      products: sale.products.map((product) => {
        return {
          id: product.id,
          type: product.type,
          price: product.price,
          quantity: product.quantity,
          status: product.status,
          productId: product.productId,
          salePrice: product.salePrice,
          typeSale: product.typeSale,
        };
      }),
      paymentMethod: sale.paymentMethod,
      total: sale.totalAmount,
      saleType: sale.type,
      createdAt: sale.createdAt,
    };
  }
}
