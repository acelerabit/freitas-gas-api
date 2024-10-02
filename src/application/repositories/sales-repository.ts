import { Sale } from '../entities/sale';

export abstract class SalesRepository {
  abstract createSale(sale: Sale): Promise<string>;
  abstract updateStock(
    productId: string,
    quantityChange: number,
  ): Promise<void>;
  abstract createSalesProducts(
    saleId: string,
    products: { id: string; quantity: number }[],
  ): Promise<void>;
  abstract deleteSale(saleId: string): Promise<void>;
}
