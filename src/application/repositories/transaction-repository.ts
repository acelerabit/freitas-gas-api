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
  abstract calculateAccountsBalance(): Promise<
    {
      bank: string;
      balance: number;
    }[]
  >;
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
  abstract findAllDepositsByDeliveryman(
    deliverymanId: string,
    pagination: PaginationParams,
  ): Promise<Transaction[]>;
  abstract findAllDepositsByDeliverymanYesterday(
    deliverymanId: string,
  ): Promise<Transaction[]>;
  abstract findAllDeposits(
    pagination: PaginationParams,
    startDate: Date,
    endDate: Date,
  ): Promise<Transaction[]>;
  abstract findAllExpensesByDeliveryman(
    deliverymanId: string,
    pagination: PaginationParams,
  ): Promise<Transaction[]>;
  abstract findAllExpenses(
    pagination: PaginationParams,
    startDate: Date,
    endDate: Date,
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
  abstract getSalesVsExpensesComparison(
    startDate?: Date,
    endDate?: Date,
    deliverymanId?: string,
  ): Promise<{
    totalSales: { year: number; month: number; total: number }[];
    totalExpenses: { year: number; month: number; total: number }[];
  }>;
  abstract getGrossProfit(
    startDate?: Date,
    endDate?: Date,
    deliverymanId?: string,
  ): Promise<number>;
}
