import { Product } from '@/application/entities/product';
import { PaginationParams } from '@/@shared/pagination-interface';
import { Sale } from '../entities/sale';
import { BottleStatus, PaymentMethod } from '@prisma/client';
import { Customer } from '../entities/customer';
import { User } from '../entities/user';

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
  abstract saveSale(
    sale: Sale,
    customer: Customer,
    deliveryman: User,
  ): Promise<void>;
  abstract markAsPaid(id: string, bankAccountId: string): Promise<void>;
  abstract markAllAsPaid(
    customerId: string,
    bankAccountId: string,
  ): Promise<void>;
  abstract updateStock(
    productId: string,
    quantityChange: number,
    status: BottleStatus,
  ): Promise<void>;
  abstract revertStock(
    productId: string,
    quantityChange: number,
    status: BottleStatus,
  ): Promise<void>;
  abstract updateStockOperations(
    productId: string,
    quantityChange: number,
    status: BottleStatus,
    operation: 'add' | 'remove',
    customerId: string,
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
  abstract addComodato(
    customerId: string,
    quantity: number,
    typeSale: BottleStatus,
    productId: string,
  );
  abstract revertComodato(
    customerId: string,
    quantity: number,
    typeSale: BottleStatus,
    productId: string,
  );
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
  abstract getTotalBalanceByDeliverymanYesterday(
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
  abstract getCustomersWithPositiveFiadoDebtsByCustomer(
    customerId: string,
    pagination?: PaginationParams,
  ): Promise<
    {
      customerId: string;
      customerName: string;
      totalDebt: number;
    }[]
  >;
  abstract getCustomersWithPositiveFiadoDebtsTotal(
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
