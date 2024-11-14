import { Injectable } from '@nestjs/common';
import { PaginationParams } from '@/@shared/pagination-interface';
import { Transaction } from '../../entities/transaction';
import { TransactionRepository } from '@/application/repositories/transaction-repository';

export interface FetchDepositsRequest {
  pagination: PaginationParams;
  startDate?: Date;
  endDate?: Date;
}

interface FetchDepositsResponse {
  transactions: Transaction[];
}

@Injectable()
export class FetchDeposits {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute({
    pagination,
    startDate,
    endDate,
  }: FetchDepositsRequest): Promise<FetchDepositsResponse> {
    const transactions = await this.transactionRepository.findAllDeposits(
      pagination,
      startDate,
      endDate,
    );

    return {
      transactions,
    };
  }
}
