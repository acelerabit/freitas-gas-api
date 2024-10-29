import { Injectable } from '@nestjs/common';
import { PaginationParams } from '@/@shared/pagination-interface';
import { Transaction } from '../../entities/transaction';
import { TransactionRepository } from '@/application/repositories/transaction-repository';

interface FetchDepositsRequest {
  pagination: PaginationParams;
}

interface FetchDepositsResponse {
  transactions: Transaction[];
}

@Injectable()
export class FetchDeposits {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute({
    pagination,
  }: FetchDepositsRequest): Promise<FetchDepositsResponse> {
    const transactions = await this.transactionRepository.findAllDeposits(
      pagination,
    );

    return {
      transactions,
    };
  }
}
