import { Injectable } from '@nestjs/common';
import { PaginationParams } from '@/@shared/pagination-interface';
import { Transaction } from '../../entities/transaction';
import {
  SortType,
  TransactionRepository,
} from '@/application/repositories/transaction-repository';
import { TransactionCategory } from '@prisma/client';

interface FindAllTransactionsRequest {
  type?: string;
  orderByField?: SortType;
  orderDirection?: 'desc' | 'asc';
  filterParams?: {
    category?: TransactionCategory;
    startDate: Date;
    endDate: Date;
  };
  pagination: PaginationParams;
}

@Injectable()
export class FindAllTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute({
    type,
    orderByField,
    orderDirection,
    filterParams,
    pagination,
  }: FindAllTransactionsRequest): Promise<Transaction[]> {
    return this.transactionRepository.findAll(
      type,
      orderByField,
      orderDirection,
      filterParams,
      pagination,
    );
  }
}
