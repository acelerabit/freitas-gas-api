import { TransactionCategory } from '@prisma/client';
import { Transaction } from '../entities/transaction';
import { PaginationParams } from '@/@shared/pagination-interface';

export type SortType =
  | 'createdAt'
  | 'customer'
  | 'transactionType'
  | 'category'
  | 'amount'
  | 'customCategory';

export abstract class TransactionRepository {
  abstract createTransaction(transaction: Transaction): Promise<void>;
  abstract findAllWithoutPaginate(): Promise<Transaction[]>;
  abstract calculateBalance(): Promise<number>;
  abstract findAll(
    type?: string,
    orderByField?: SortType,
    orderDirection?: 'desc' | 'asc',
    filterParams?: {
      category?: TransactionCategory;
      startDate: Date;
      endDate: Date;
    },
    pagination?: PaginationParams,
  ): Promise<Transaction[]>;
  abstract calculateDeliverymanBalance(deliverymanId: string): Promise<number>;
  abstract findAllExpensesByDeliveryman(
    deliverymanId: string,
    pagination: PaginationParams,
  ): Promise<Transaction[]>;
  abstract findAllExpenses(
    pagination: PaginationParams,
  ): Promise<Transaction[]>;
  abstract findById(id: string): Promise<Transaction | null>;
  abstract update(transaction: Transaction): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract getExpenseIndicators(
    startDate: Date,
    endDate: Date,
    deliverymanId?: string,
  ): Promise<{
    totalExpenses: number;
    totalPerDay: { createdAt: Date; total: number }[];
    totalPerMonth: { year: number; month: number; total: number }[];
  }>;
  abstract getExpenseProportionByCustomCategory(
    startDate: Date,
    endDate: Date,
    deliverymanId?: string,
  ): Promise<{ category: string; percentage: number }[]>;
  abstract getTotalExpensesByDeliveryman(id: string): Promise<number>;
}
