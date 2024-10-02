import { PaginationParams } from '@/@shared/pagination-interface';
import { Sale } from '../entities/sale';

export type SortType =
  | 'createdAt'
  | 'customer'
  | 'saleType'
  | 'total'
  | 'deliveryman'
  | 'paymentMethod'
  | 'total'
  | 'quantity';

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
  abstract findAll(
    deliveryman?: string,
    customer?: string,
    orderByField?: SortType,
    orderDirection?: 'desc' | 'asc',
    filterParams?: {
      saleType: 'EMPTY' | 'FULL' | 'COMODATO';
      startDate: Date;
      endDate: Date;
    },
    pagination?: PaginationParams,
  ): Promise<Sale[]>;
}
