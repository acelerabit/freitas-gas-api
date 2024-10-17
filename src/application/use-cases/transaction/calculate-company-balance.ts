import { Injectable } from '@nestjs/common';
import { PaginationParams } from '@/@shared/pagination-interface';
import { Transaction } from '../../entities/transaction';
import {
  SortType,
  TransactionRepository,
} from '@/application/repositories/transaction-repository';
import { TransactionCategory } from '@prisma/client';

interface CalculateCompanyBalanceResponse {
  finalBalance: number;
}

@Injectable()
export class CalculateCompanyBalance {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(): Promise<CalculateCompanyBalanceResponse> {
    const finalBalance = await this.transactionRepository.calculateBalance();

    return { finalBalance };
  }
}
