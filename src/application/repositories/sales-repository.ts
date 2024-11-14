import { Product } from '@/application/entities/product';
import { PaginationParams } from '@/@shared/pagination-interface';
import { Sale } from '../entities/sale';
import { BottleStatus, PaymentMethod } from '@prisma/client';

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
  abstract markAsPaid(id: string, bankAccountId: string): Promise<void>;
  abstract updateStock(
    productId: string,
    quantityChange: number,
    status: BottleStatus,
  ): Promise<void>;
  abstract findById(id: string): Promise<Sale | null>;
  abstract createSalesProducts(
    saleId: string,
    products: { id: string; quantity: number }[],
  ): Promise<void>;
  abstract findAllComodato(pagination?: PaginationParams): Promise<Sale[]>;
  abstract findComodatoByCustomer(customerId: string): Promise<number>;
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
  abstract findAllByDeliveryman(
    deliverymanId: string,
    pagination?: PaginationParams,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Sale[]>;
  abstract deleteSale(saleId: string): Promise<void>;
  abstract update(sale: Sale): Promise<void>;
  abstract updateSalesProducts(
    saleId: string,
    saleProducts: {
      id: string;
      quantity: number;
    }[],
  ): Promise<void>;
  abstract getSalesIndicators(
    startDate: Date,
    endDate: Date,
    deliverymanId?: string,
  ): Promise<{
    totalSales: number;
    totalPerDay: { createdAt: Date; total: number }[];
    totalPerMonth: { year: number; month: number; total: number }[];
  }>;
  abstract getAverageSales(
    startDate: Date,
    endDate: Date,
    deliverymanId?: string,
  ): Promise<{
    averageDailySales: number;
    averageMonthlySales: number;
  }>;
  abstract getTotalMoneySalesByDeliveryman(
    deliverymanId: string,
  ): Promise<number>;
  abstract getTotalMoneySalesByDeliverymanYesterday(
    deliverymanId: string,
  ): Promise<number>;
  abstract getTotalRevenuesByDeliveryman(
    deliverymanId: string,
  ): Promise<number>;
  abstract getTotalMoneySalesByPaymentMethodFiado(
    startDate: Date,
    endDate: Date,
    deliverymanId?: string,
  ): Promise<number>;
  abstract getCustomersWithPositiveFiadoDebts(
    pagination?: PaginationParams,
  ): Promise<
    {
      customerId: string;
      customerName: string;
      totalDebt: number;
    }[]
  >;
  abstract getTotalSalesByPaymentMethod(
    startDate: Date,
    endDate: Date,
    deliverymanId?: string,
  ): Promise<Record<PaymentMethod, string>>;
  abstract getTotalSalesByPaymentMethodForToday(
    deliverymanId: string,
  ): Promise<Record<PaymentMethod, string>>;
}
