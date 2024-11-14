import { Injectable } from '@nestjs/common';
import { PaginationParams } from '@/@shared/pagination-interface';
import { Transaction } from '../../entities/transaction';
import { TransactionRepository } from '@/application/repositories/transaction-repository';

@Injectable()
export class FetchExpenses {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(
    pagination: PaginationParams,
    startDate: Date,
    endDate: Date,
  ): Promise<Transaction[]> {
    return this.transactionRepository.findAllExpenses(
      pagination,
      startDate,
      endDate,
    );
  }
}
